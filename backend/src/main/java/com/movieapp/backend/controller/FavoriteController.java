package com.movieapp.backend.controller;

import com.movieapp.backend.model.Content;
import com.movieapp.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Set;

/**
 * Kullanıcı, JwtAuthenticationFilter tarafından doğrulanan token'dan gelir (Principal).
 * İstemcinin gönderdiği başlıklara (ör. X-Username) asla güvenilmez.
 */
@RestController
@RequestMapping("/api")
public class FavoriteController {

    private final UserService userService;

    public FavoriteController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping({"/favorites", "/users/me/favorites"})
    public ResponseEntity<?> getFavorite(Principal principal) {
        try {
            Set<Content> items = userService.getFavorites(principal.getName());
            return ResponseEntity.ok(items);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @PostMapping({"/favorites/{contentId}", "/users/me/favorites/{contentId}"})
    public ResponseEntity<?> addFavorite(@PathVariable Long contentId, Principal principal) {
        try {
            Set<Content> items = userService.addFavorite(principal.getName(), contentId);
            return ResponseEntity.ok(items);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @DeleteMapping({"/favorites/{contentId}", "/users/me/favorites/{contentId}"})
    public ResponseEntity<?> removeFavorite(@PathVariable Long contentId, Principal principal) {
        try {
            Set<Content> items = userService.removeFavorite(principal.getName(), contentId);
            return ResponseEntity.ok(items);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }
}
