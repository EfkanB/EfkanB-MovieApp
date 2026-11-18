package com.movieapp.backend;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.movieapp.backend.model.PasswordResetToken;
import com.movieapp.backend.model.Role;
import com.movieapp.backend.model.User;
import com.movieapp.backend.repository.PasswordResetTokenRepository;
import com.movieapp.backend.repository.UserRepository;
import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.timeout;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityIntegrationTest {

    /** Her istek farklı bir IP'den geliyormuş gibi davranır; böylece testler rate limit'e takılmaz. */
    private static final AtomicInteger IP_COUNTER = new AtomicInteger(1);

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper json;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @MockitoBean
    private JavaMailSender mailSender;

    @BeforeEach
    void setUp() {
        when(mailSender.createMimeMessage()).thenReturn(new MimeMessage((Session) null));
    }

    private static RequestPostProcessor uniqueIp() {
        int n = IP_COUNTER.getAndIncrement();
        return req -> {
            req.setRemoteAddr("10.0." + (n / 250) + "." + (n % 250 + 1));
            return req;
        };
    }

    private MockHttpServletRequestBuilder postJson(String url, Object body) throws Exception {
        return post(url).with(uniqueIp())
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(body));
    }

    private String register(String username) throws Exception {
        String body = mvc.perform(postJson("/api/auth/register", Map.of(
                        "username", username,
                        "password", "password123",
                        "email", username + "@example.com")))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return json.readTree(body).get("token").asText();
    }

    private static String bearer(String token) {
        return "Bearer " + token;
    }

    @Test
    void kayitta_istemcinin_gonderdigi_rol_yok_sayilir() throws Exception {
        mvc.perform(postJson("/api/auth/register", Map.of(
                        "username", "sahteadmin",
                        "password", "password123",
                        "email", "sahteadmin@example.com",
                        "role", "ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("USER"))
                .andExpect(jsonPath("$.password").doesNotExist());

        assertThat(userRepository.findByUsername("sahteadmin").orElseThrow().getRole()).isEqualTo(Role.USER);
    }

    @Test
    void kayittan_sonra_hos_geldin_maili_gonderilir() throws Exception {
        register("yeniuye");

        ArgumentCaptor<MimeMessage> mail = ArgumentCaptor.forClass(MimeMessage.class);
        verify(mailSender, timeout(5000)).send(mail.capture());
        MimeMessage sent = mail.getValue();
        assertThat(sent.getAllRecipients()[0].toString()).isEqualTo("yeniuye@example.com");
        assertThat(sent.getSubject()).contains("hoş geldin").contains("yeniuye");
    }

    @Test
    void hos_geldin_maili_gonderilemese_de_kayit_basarili() throws Exception {
        doThrow(new org.springframework.mail.MailSendException("smtp kapalı"))
                .when(mailSender).send(any(MimeMessage.class));

        register("mailsizuye");

        verify(mailSender, timeout(5000)).send(any(MimeMessage.class));
        assertThat(userRepository.findByUsername("mailsizuye")).isPresent();
    }

    @Test
    void kayitta_zayif_sifre_ve_gecersiz_eposta_reddedilir() throws Exception {
        mvc.perform(postJson("/api/auth/register", Map.of(
                        "username", "kisasifre", "password", "123", "email", "kisa@example.com")))
                .andExpect(status().isBadRequest());
        mvc.perform(postJson("/api/auth/register", Map.of(
                        "username", "bozukmail", "password", "password123", "email", "bozuk")))
                .andExpect(status().isBadRequest());
    }

    @Test
    void token_olmadan_veya_sahte_baslikla_favorilere_erisilemez() throws Exception {
        register("kurban");

        mvc.perform(get("/api/favorites")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/favorites").header("X-Username", "kurban")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/favorites").header("Authorization", "Bearer dummy-kurban"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void kullanici_kendi_favorilerini_yonetebilir() throws Exception {
        String token = register("favorici");

        mvc.perform(post("/api/favorites/1").header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
        mvc.perform(get("/api/users/me/favorites").header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void normal_kullanici_admin_islemi_yapamaz() throws Exception {
        String token = register("siradan");

        mvc.perform(get("/api/admin/movies").header("Authorization", bearer(token)))
                .andExpect(status().isForbidden());
        mvc.perform(delete("/api/contents/1").header("Authorization", bearer(token)))
                .andExpect(status().isForbidden());
    }

    @Test
    void admin_icerik_ekleyebilir_ve_id_ile_ustune_yazamaz() throws Exception {
        String token = register("yonetici");
        User admin = userRepository.findByUsername("yonetici").orElseThrow();
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);

        Map<String, Object> movie = Map.of(
                "id", 1,
                "title", "Test Filmi",
                "genre", "Dram",
                "releaseYear", 2024,
                "director", "Test Yönetmen",
                "durationMinutes", 100);

        String body = mvc.perform(post("/api/admin/movies")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(movie)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        assertThat(json.readTree(body).get("id").asLong()).isNotEqualTo(1L);

        // Eksik alan: 500 değil 400 dönmeli
        mvc.perform(post("/api/admin/movies")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Eksik\"}"))
                .andExpect(status().isBadRequest());

        mvc.perform(get("/api/admin/movies/999999").header("Authorization", bearer(token)))
                .andExpect(status().isNotFound());
    }

    @Test
    void yorumlarda_sadece_kullanici_adi_gorunur() throws Exception {
        String token = register("yorumcu");

        mvc.perform(post("/api/reviews")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"contentId\":2,\"rating\":5,\"comment\":\"Harika\"}"))
                .andExpect(status().isOk());

        String body = mvc.perform(get("/api/reviews/content/2"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        JsonNode review = json.readTree(body).get(0);
        assertThat(review.get("username").asText()).isEqualTo("yorumcu");
        assertThat(review.has("user")).isFalse();
        assertThat(body).doesNotContain("yorumcu@example.com");
    }

    @Test
    void yorumu_olmayan_icerigin_istatistigi_bos_doner() throws Exception {
        mvc.perform(get("/api/reviews/stats/3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reviewCount").value(0))
                .andExpect(jsonPath("$.averageRating").doesNotExist());
    }

    @Test
    void bozuk_istek_400_doner() throws Exception {
        String token = register("bozukistek");
        mvc.perform(post("/api/reviews")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{bozuk"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void cok_fazla_giris_denemesi_429_ile_engellenir() throws Exception {
        RequestPostProcessor sameIp = req -> {
            req.setRemoteAddr("192.0.2.77");
            return req;
        };
        String wrongLogin = "{\"username\":\"yok\",\"password\":\"yanlis\"}";

        for (int i = 0; i < 10; i++) {
            mvc.perform(post("/api/auth/login").with(sameIp)
                            .contentType(MediaType.APPLICATION_JSON).content(wrongLogin))
                    .andExpect(status().isUnauthorized());
        }
        mvc.perform(post("/api/auth/login").with(sameIp)
                        .contentType(MediaType.APPLICATION_JSON).content(wrongLogin))
                .andExpect(status().isTooManyRequests());
    }

    @Test
    void sifre_sifirlama_eposta_varligini_belli_etmez() throws Exception {
        register("unutkan");
        doThrow(new org.springframework.mail.MailSendException("smtp kapalı"))
                .when(mailSender).send(any(MimeMessage.class));

        String unknown = mvc.perform(postJson("/api/auth/forgot-password", Map.of("email", "kimse@example.com")))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        // Mail gönderilemese bile aynı cevap dönmeli
        String known = mvc.perform(postJson("/api/auth/forgot-password", Map.of("email", "unutkan@example.com")))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        assertThat(known).isEqualTo(unknown);
    }

    @Test
    void sifre_sifirlaninca_eski_oturumlar_kapanir() throws Exception {
        String oldToken = register("degistiren");
        mvc.perform(get("/api/favorites").header("Authorization", bearer(oldToken)))
                .andExpect(status().isOk());

        mvc.perform(postJson("/api/auth/forgot-password", Map.of("email", "degistiren@example.com")))
                .andExpect(status().isOk());
        PasswordResetToken resetToken = tokenRepository.findAll().stream()
                .filter(t -> t.getUser().getUsername().equals("degistiren"))
                .findFirst().orElseThrow();

        mvc.perform(postJson("/api/auth/reset-password", Map.of(
                        "token", resetToken.getToken(), "newPassword", "yeniSifre456")))
                .andExpect(status().isOk());

        // Eski token artık geçersiz
        mvc.perform(get("/api/favorites").header("Authorization", bearer(oldToken)))
                .andExpect(status().isUnauthorized());

        // Aynı sıfırlama linki ikinci kez kullanılamaz
        mvc.perform(postJson("/api/auth/reset-password", Map.of(
                        "token", resetToken.getToken(), "newPassword", "baskaSifre789")))
                .andExpect(status().isBadRequest());

        // Yeni şifreyle giriş çalışır
        mvc.perform(postJson("/api/auth/login", Map.of("username", "degistiren", "password", "yeniSifre456")))
                .andExpect(status().isOk());
    }
}
