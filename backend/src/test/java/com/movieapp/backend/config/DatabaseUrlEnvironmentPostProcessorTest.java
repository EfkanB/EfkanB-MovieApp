package com.movieapp.backend.config;

import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class DatabaseUrlEnvironmentPostProcessorTest {

    private final DatabaseUrlEnvironmentPostProcessor processor = new DatabaseUrlEnvironmentPostProcessor();

    @Test
    void neon_adresi_jdbc_ayarlarina_cevrilir() {
        Map<String, Object> p = DatabaseUrlEnvironmentPostProcessor.toSpringProperties(
                "postgresql://neondb_owner:s%40fre%3Ax@ep-cool-1.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

        assertThat(p.get("spring.datasource.url"))
                .isEqualTo("jdbc:postgresql://ep-cool-1.eu-central-1.aws.neon.tech/neondb?sslmode=require");
        assertThat(p.get("spring.datasource.username")).isEqualTo("neondb_owner");
        assertThat(p.get("spring.datasource.password")).isEqualTo("s@fre:x");
    }

    @Test
    void havuzlu_adreste_hazir_sorgular_kapatilir_ve_ssl_eklenir() {
        Map<String, Object> p = DatabaseUrlEnvironmentPostProcessor.toSpringProperties(
                "postgres://u:p@ep-x-pooler.neon.tech:5432/db");

        assertThat(p.get("spring.datasource.url"))
                .isEqualTo("jdbc:postgresql://ep-x-pooler.neon.tech:5432/db?sslmode=require&prepareThreshold=0");
    }

    @Test
    void dogrudan_baglanti_tercih_edilir() {
        MockEnvironment env = new MockEnvironment()
                .withProperty("DATABASE_URL", "postgresql://u:p@pooled-pooler.neon.tech/db")
                .withProperty("DATABASE_URL_UNPOOLED", "postgresql://u:p@direct.neon.tech/db");
        processor.postProcessEnvironment(env, null);

        assertThat(env.getProperty("spring.datasource.url")).startsWith("jdbc:postgresql://direct.neon.tech/db");
    }

    @Test
    void db_url_verilmisse_dokunulmaz() {
        MockEnvironment env = new MockEnvironment()
                .withProperty("DB_URL", "jdbc:mysql://localhost/movieapp")
                .withProperty("DATABASE_URL", "postgresql://u:p@x.neon.tech/db");
        processor.postProcessEnvironment(env, null);

        assertThat(env.getPropertySources().contains(DatabaseUrlEnvironmentPostProcessor.SOURCE_NAME)).isFalse();
    }
}
