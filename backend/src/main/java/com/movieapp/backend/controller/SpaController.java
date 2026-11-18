package com.movieapp.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Tek sayfa uygulaması (React) yolları: tarayıcıda doğrudan açılınca index.html dönsün.
 * Örn. şifre sıfırlama mailindeki /reset-password?token=... bağlantısı.
 */
@Controller
public class SpaController {

    @GetMapping({"/reset-password", "/gizlilik"})
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
