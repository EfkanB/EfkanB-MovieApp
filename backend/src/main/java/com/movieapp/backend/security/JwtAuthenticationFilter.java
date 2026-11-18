package com.movieapp.backend.security;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.movieapp.backend.model.Role;
import com.movieapp.backend.model.User;
import com.movieapp.backend.repository.UserRepository;
import com.movieapp.backend.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            DecodedJWT jwt = jwtUtil.decode(token);
            if (jwt != null) {
                String username = jwt.getSubject();
                Integer tokenVersion = jwt.getClaim(JwtUtil.VERSION_CLAIM).asInt();

                userRepository.findByUsername(username)
                        // Şifre değiştiyse eski token'lar artık kabul edilmez
                        .filter(user -> tokenVersion != null && tokenVersion == user.getTokenVersion())
                        .ifPresent(user -> {
                    GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + mapRole(user.getRole()));
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            user.getUsername(),
                            null,
                            Collections.singleton(authority)
                    );
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                });
            }
        }

        filterChain.doFilter(request, response);
    }

    private String mapRole(Role role) {
        if (role == null) return "USER";
        return role.name();
    }
}

