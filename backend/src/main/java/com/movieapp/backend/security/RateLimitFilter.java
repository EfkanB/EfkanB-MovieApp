package com.movieapp.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Giriş / kayıt / şifre sıfırlama uçlarına IP başına deneme sınırı koyar
 * (şifre deneme saldırısı ve mail spam'ine karşı).
 *
 * Bellek içi çalışır: tek sunucu için yeterli, birden fazla sunucuda her biri kendi sayar.
 * Nginx arkasında gerçek istemci IP'si için server.forward-headers-strategy=native ayarı gerekir
 * (application.properties'te varsayılan olarak açık).
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private record Rule(int maxRequests, Duration window) {}

    private static final Map<String, Rule> RULES = Map.of(
            "/api/auth/login", new Rule(10, Duration.ofMinutes(1)),
            "/api/auth/register", new Rule(5, Duration.ofMinutes(10)),
            "/api/auth/forgot-password", new Rule(5, Duration.ofMinutes(15)),
            "/api/auth/reset-password", new Rule(10, Duration.ofMinutes(15))
    );

    private static final int CLEANUP_THRESHOLD = 10_000;

    private static final class Window {
        long startMillis;
        int count;

        Window(long startMillis) {
            this.startMillis = startMillis;
        }
    }

    private final Map<String, Window> windows = new ConcurrentHashMap<>();

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !HttpMethod.POST.matches(request.getMethod()) || !RULES.containsKey(request.getRequestURI());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        Rule rule = RULES.get(path);
        long now = System.currentTimeMillis();
        long windowMillis = rule.window().toMillis();

        if (windows.size() > CLEANUP_THRESHOLD) {
            windows.entrySet().removeIf(e -> now - e.getValue().startMillis > Duration.ofMinutes(15).toMillis());
        }

        String key = path + "|" + request.getRemoteAddr();
        long retryAfterSeconds;
        boolean allowed;

        Window w = windows.computeIfAbsent(key, k -> new Window(now));
        synchronized (w) {
            if (now - w.startMillis >= windowMillis) {
                w.startMillis = now;
                w.count = 0;
            }
            w.count++;
            allowed = w.count <= rule.maxRequests();
            retryAfterSeconds = Math.max(1, (w.startMillis + windowMillis - now) / 1000);
        }

        if (!allowed) {
            response.setStatus(429);
            response.setHeader("Retry-After", String.valueOf(retryAfterSeconds));
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"message\":\"Çok fazla deneme yaptınız. Lütfen "
                    + retryAfterSeconds + " saniye sonra tekrar deneyin.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
