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
public class WatchlistController {

    private final UserService userService;

    public WatchlistController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping({"/watchlist", "/users/me/watchlist"})
    public ResponseEntity<?> getWatchlist(Principal principal) {
        try {
            Set<Content> items = userService.getWatchlist(principal.getName());
            return ResponseEntity.ok(items);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @PostMapping({"/watchlist/{contentId}", "/users/me/watchlist/{contentId}"})
    public ResponseEntity<?> addWatchlist(@PathVariable Long contentId, Principal principal) {
        try {
            Set<Content> items = userService.addToWatchlist(principal.getName(), contentId);
            return ResponseEntity.ok(items);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @DeleteMapping({"/watchlist/{contentId}", "/users/me/watchlist/{contentId}"})
    public ResponseEntity<?> removeWatchlist(@PathVariable Long contentId, Principal principal) {
        try {
            Set<Content> items = userService.removeFromWatchlist(principal.getName(), contentId);
            return ResponseEntity.ok(items);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }
}
