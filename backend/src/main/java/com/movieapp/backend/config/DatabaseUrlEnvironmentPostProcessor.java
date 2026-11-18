package com.movieapp.backend.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Neon (ve Render, Heroku gibi platformlar) veritabanını tek bir adresle verir:
 *   postgresql://kullanici:sifre@sunucu/veritabani?sslmode=require
 * Spring Boot ise jdbc:postgresql://... adresi ile ayrı kullanıcı adı/şifre bekler.
 *
 * Bu sınıf açılışta DATABASE_URL_UNPOOLED (yoksa DATABASE_URL) değişkenini çevirip
 * spring.datasource.* ayarlarına yazar. DB_URL açıkça verilmişse hiçbir şey yapmaz.
 */
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    static final String SOURCE_NAME = "databaseUrlFromEnvironment";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        if (hasText(environment.getProperty("DB_URL"))) {
            return;
        }
        // Doğrudan bağlantı tercih edilir: Hibernate'in hazır sorguları havuzlayıcıyla sorun çıkarabilir
        String raw = environment.getProperty("DATABASE_URL_UNPOOLED");
        if (!hasText(raw)) {
            raw = environment.getProperty("DATABASE_URL");
        }
        if (!hasText(raw)) {
            return;
        }
        environment.getPropertySources().addFirst(new MapPropertySource(SOURCE_NAME, toSpringProperties(raw.trim())));
    }

    /** postgres(ql)://user:pass@host[:port]/db?params → spring.datasource.url/username/password */
    static Map<String, Object> toSpringProperties(String databaseUrl) {
        URI uri = URI.create(databaseUrl);
        String scheme = uri.getScheme();
        if (!"postgres".equals(scheme) && !"postgresql".equals(scheme)) {
            throw new IllegalArgumentException("DATABASE_URL postgres:// ya da postgresql:// ile başlamalı");
        }

        String host = uri.getHost();
        String port = uri.getPort() > 0 ? ":" + uri.getPort() : "";
        String database = uri.getPath() == null ? "" : uri.getPath();

        List<String> params = new ArrayList<>();
        if (uri.getRawQuery() != null) {
            for (String param : uri.getRawQuery().split("&")) {
                // channel_binding libpq'ya özgü; JDBC sürücüsü bu adla tanımıyor
                if (!param.isBlank() && !param.startsWith("channel_binding=")) {
                    params.add(param);
                }
            }
        }
        if (params.stream().noneMatch(p -> p.startsWith("sslmode="))) {
            params.add("sslmode=require");
        }
        // Havuzlu (PgBouncer) adreste sunucu tarafı hazır sorgular kapatılmalı
        if (host != null && host.contains("-pooler")) {
            params.add("prepareThreshold=0");
        }

        String jdbcUrl = "jdbc:postgresql://" + host + port + database + "?" + String.join("&", params);

        Map<String, Object> props = new HashMap<>();
        props.put("spring.datasource.url", jdbcUrl);
        String userInfo = uri.getRawUserInfo();
        if (userInfo != null) {
            int colon = userInfo.indexOf(':');
            String user = colon >= 0 ? userInfo.substring(0, colon) : userInfo;
            props.put("spring.datasource.username", decode(user));
            if (colon >= 0) {
                props.put("spring.datasource.password", decode(userInfo.substring(colon + 1)));
            }
        }
        return props;
    }

    private static String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }

    private static boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE;
    }
}
