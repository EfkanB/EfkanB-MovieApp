package com.movieapp.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

/**
 * Şifre sıfırlama maillerini gönderir.
 * BREVO_API_KEY tanımlıysa Brevo HTTP API'si (443 portu) kullanılır; değilse SMTP.
 * Render'ın ücretsiz planı SMTP portlarını engellediği için yayında Brevo gerekir.
 */
@Service
public class EmailService {

    private static final String BREVO_URL = "https://api.brevo.com/v3/smtp/email";

    private final JavaMailSender mailSender;
    private final RestClient restClient = RestClient.create();

    @Value("${app.frontend.reset-password-url}")
    private String resetPasswordUrl;

    @Value("${app.mail.from}")
    private String from;

    @Value("${app.mail.from-name:MovieApp}")
    private String fromName;

    @Value("${app.mail.brevo-api-key:}")
    private String brevoApiKey;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String toEmail, String token) {
        String link = resetPasswordUrl + "?token=" + token;
        String subject = "MovieApp - Şifre Sıfırlama";
        String text = "Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:\n\n" + link + "\n\n"
                + "Bağlantı 15 dakika içinde geçersiz olacaktır. Bu isteği siz yapmadıysanız bu e-postayı yok sayabilirsiniz.";

        if (brevoApiKey != null && !brevoApiKey.isBlank()) {
            sendWithBrevo(toEmail, subject, text);
        } else {
            sendWithSmtp(toEmail, subject, text);
        }
    }

    private void sendWithBrevo(String toEmail, String subject, String text) {
        Map<String, Object> body = Map.of(
                "sender", Map.of("name", fromName, "email", from),
                "to", List.of(Map.of("email", toEmail)),
                "subject", subject,
                "textContent", text
        );
        restClient.post()
                .uri(BREVO_URL)
                .header("api-key", brevoApiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .toBodilessEntity();
    }

    private void sendWithSmtp(String toEmail, String subject, String text) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(from);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(text);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("E-posta gönderilemedi: " + e.getMessage(), e);
        }
    }
}
