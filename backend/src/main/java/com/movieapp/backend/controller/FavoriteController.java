package com.movieapp.backend.controller;

import com.movieapp.backend.model.Content;
import com.movieapp.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api") // Eğer eski kodunda farklı bir base URL varsa burayı değiştirebilirsin
public class FavoriteController {

    @Autowired
    private UserService userService;

    // JWT veya Session'dan kullanıcı adını çıkaran metodun
    private String extractUsername(HttpServletRequest request) {
        return (String) request.getAttribute("username"); 
    }

    @GetMapping("/favorites")
    public ResponseEntity<?> getFavorites(HttpServletRequest request) {
        try {
            String username = extractUsername(request);
            Set<Content> favorites = userService.getFavorites(username);
            return ResponseEntity.ok(favorites);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
        }
    }

    @PostMapping("/favorites")
    public ResponseEntity<?> addFavorite(@RequestBody AddContentRequest requestBody, HttpServletRequest request) {
        try {
            String username = extractUsername(request);
            Set<Content> favorites = userService.addFavorite(username, requestBody.getContentId());
            return ResponseEntity.ok(favorites);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @DeleteMapping("/favorites/{contentId}")
    public ResponseEntity<?> removeFavorite(@PathVariable Long contentId, HttpServletRequest request) {
        try {
            String username = extractUsername(request);
            Set<Content> favorites = userService.removeFavorite(username, contentId);
            return ResponseEntity.ok(favorites);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    // JSON içindeki ID'yi yakalamak için kullandığımız yardımcı sınıf (DTO)
    public static class AddContentRequest {
        private Long contentId;
        public Long getContentId() { return contentId; }
        public void setContentId(Long contentId) { this.contentId = contentId; }
    }
}