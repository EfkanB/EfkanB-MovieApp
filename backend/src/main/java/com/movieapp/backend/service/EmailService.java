package com.movieapp.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.HtmlUtils;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Uygulamanın gönderdiği mailler (şifre sıfırlama, hoş geldin).
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
        send(toEmail, subject, text, null);
    }

    public void sendWelcomeEmail(String toEmail, String username) {
        String siteUrl = siteUrl();
        String subject = "MovieApp'e hoş geldin, " + username + "!";
        String text = "Merhaba " + username + ",\n\n"
                + "MovieApp hesabın hazır. Artık filmleri ve dizileri puanlayabilir, yorum yazabilir,\n"
                + "beğendiklerini favorilerine, sonra izleyeceklerini izleme listene ekleyebilirsin.\n\n"
                + "Keşfetmeye başla: " + siteUrl + "\n\n"
                + "Bu hesabı sen açmadıysan bu e-postayı yok sayabilirsin.\n\n"
                + "İyi seyirler,\nMovieApp";

        String name = HtmlUtils.htmlEscape(username);
        String url = HtmlUtils.htmlEscape(siteUrl);
        String html = """
                <!doctype html>
                <html lang="tr">
                <body style="margin:0;padding:0;background:#faf6f1;font-family:'Segoe UI',Arial,sans-serif;color:#1c2836;">
                  <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background:#faf6f1;padding:32px 16px;">
                    <tr><td align="center">
                      <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border:1px solid #e7ddd2;border-radius:16px;">
                        <tr><td style="padding:32px 32px 8px;">
                          <div style="display:inline-block;background:#fc997c;color:#1c2836;font-weight:700;border-radius:8px;padding:6px 10px;font-size:14px;">MovieApp</div>
                          <h1 style="margin:24px 0 8px;font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:32px;line-height:1.1;color:#1c2836;">Hoş geldin, %s!</h1>
                          <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#47525f;">
                            Hesabın hazır. Artık filmleri ve dizileri puanlayabilir, yorum yazabilir; beğendiklerini
                            favorilerine, sonra izleyeceklerini izleme listene ekleyebilirsin.
                          </p>
                        </td></tr>
                        <tr><td style="padding:8px 32px 32px;">
                          <a href="%s" style="display:inline-block;background:#fc997c;color:#1c2836;text-decoration:none;font-weight:700;border-radius:999px;padding:12px 24px;font-size:15px;">Keşfetmeye başla</a>
                          <p style="margin:24px 0 0;font-size:13px;line-height:1.5;color:#66707c;">
                            Bu hesabı sen açmadıysan bu e-postayı yok sayabilirsin.
                          </p>
                        </td></tr>
                      </table>
                    </td></tr>
                  </table>
                </body>
                </html>
                """.formatted(name, url);
        send(toEmail, subject, text, html);
    }

    /** Sitenin ana adresi: şifre sıfırlama adresinden türetilir (ayrı bir ayar gerekmesin diye). */
    String siteUrl() {
        try {
            URI uri = URI.create(resetPasswordUrl);
            String port = uri.getPort() > 0 ? ":" + uri.getPort() : "";
            return uri.getScheme() + "://" + uri.getHost() + port;
        } catch (RuntimeException e) {
            return resetPasswordUrl;
        }
    }

    private void send(String toEmail, String subject, String text, String html) {
        if (brevoApiKey != null && !brevoApiKey.isBlank()) {
            sendWithBrevo(toEmail, subject, text, html);
        } else {
            sendWithSmtp(toEmail, subject, text, html);
        }
    }

    private void sendWithBrevo(String toEmail, String subject, String text, String html) {
        Map<String, Object> body = new HashMap<>();
        body.put("sender", Map.of("name", fromName, "email", from));
        body.put("to", List.of(Map.of("email", toEmail)));
        body.put("subject", subject);
        body.put("textContent", text);
        if (html != null) {
            body.put("htmlContent", html);
        }
        restClient.post()
                .uri(BREVO_URL)
                .header("api-key", brevoApiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .toBodilessEntity();
    }

    private void sendWithSmtp(String toEmail, String subject, String text, String html) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(from);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            if (html != null) {
                helper.setText(text, html);
            } else {
                helper.setText(text);
            }
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("E-posta gönderilemedi: " + e.getMessage(), e);
        }
    }
}
