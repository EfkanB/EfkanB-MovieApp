package com.movieapp.backend.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);
    private static final String ISSUER = "movieapp";
    private static final int MIN_SECRET_LENGTH = 32;

    @Value("${jwt.secret:}")
    private String jwtSecret;

    @Value("${jwt.expiration-ms}")
    private long jwtExpirationMs;

    private Algorithm algorithm;
    private JWTVerifier verifier;

    /**
     * JWT_SECRET verilmemişse uygulama tahmin edilebilir bir anahtarla çalışmaz:
     * her açılışta rastgele bir anahtar üretilir (yeniden başlatınca herkes tekrar giriş yapar).
     * Yayında mutlaka en az 32 karakterlik bir JWT_SECRET tanımla.
     */
    @PostConstruct
    void init() {
        if (jwtSecret == null || jwtSecret.isBlank()) {
            byte[] bytes = new byte[48];
            new SecureRandom().nextBytes(bytes);
            jwtSecret = Base64.getEncoder().encodeToString(bytes);
            log.warn("JWT_SECRET tanımlı değil; geçici rastgele bir anahtar üretildi. "
                    + "Uygulama yeniden başlayınca oturumlar geçersiz olur.");
        } else if (jwtSecret.length() < MIN_SECRET_LENGTH) {
            throw new IllegalStateException("JWT_SECRET en az " + MIN_SECRET_LENGTH + " karakter olmalı.");
        }
        algorithm = Algorithm.HMAC256(jwtSecret);
        verifier = JWT.require(algorithm).withIssuer(ISSUER).build();
    }

    public String generateToken(String username) {
        return JWT.create()
                .withIssuer(ISSUER)
                .withSubject(username)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .sign(algorithm);
    }

    public String getUsernameFromToken(String token) {
        DecodedJWT decodedJWT = verifier.verify(token);
        return decodedJWT.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            verifier.verify(token);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }
}
