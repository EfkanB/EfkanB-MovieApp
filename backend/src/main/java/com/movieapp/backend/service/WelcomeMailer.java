package com.movieapp.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Kayıttan sonra hoş geldin mailini arka planda gönderir.
 * Kayıt isteği maili beklemez; gönderim başarısız olursa kayıt yine geçerlidir, hata sadece loglanır.
 */
@Service
public class WelcomeMailer {

    private static final Logger log = LoggerFactory.getLogger(WelcomeMailer.class);

    private final EmailService emailService;

    public WelcomeMailer(EmailService emailService) {
        this.emailService = emailService;
    }

    @Async
    public void sendWelcome(String email, String username) {
        try {
            emailService.sendWelcomeEmail(email, username);
        } catch (RuntimeException ex) {
            // Mail adresini ve hata detayını loga yazmıyoruz; sadece olayın kendisini
            log.warn("Hoş geldin maili gönderilemedi: {}", ex.getClass().getSimpleName());
        }
    }
}
