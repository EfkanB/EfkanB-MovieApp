package com.movieapp.backend.controller;

import com.movieapp.backend.model.Content;
import com.movieapp.backend.service.UserService;
import com.movieapp.backend.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class FavoriteController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    private String extractUsername(HttpServletRequest request) {
        String username = (String) request.getAttribute("username");
        if (username != null && !username.isBlank()) {
            return username;
        }

        username = request.getHeader("X-Username");
        if (username != null && !username.isBlank()) {
            return username;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (token.startsWith("dummy-")) {
                return token.substring("dummy-".length());
            }
            if (jwtUtil.validateToken(token)) {
                return jwtUtil.getUsernameFromToken(token);
            }
        }

        throw new RuntimeException("Kullanıcı bilgisi bulunamadı");
    }

    @GetMapping({"/favorites", "/users/me/favorites"})
    public ResponseEntity<?> getFavorites(HttpServletRequest request) {
        try {
            String username = extractUsername(request);
            Set<Content> favorites = userService.getFavorites(username);
            return ResponseEntity.ok(favorites);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
        }
    }

    @PostMapping({"/favorites/{contentId}", "/users/me/favorites/{contentId}"})
    public ResponseEntity<?> addFavorite(@PathVariable Long contentId, HttpServletRequest request) {
        try {
            String username = extractUsername(request);
            Set<Content> favorites = userService.addFavorite(username, contentId);
            return ResponseEntity.ok(favorites);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @DeleteMapping({"/favorites/{contentId}", "/users/me/favorites/{contentId}"})
    public ResponseEntity<?> removeFavorite(@PathVariable Long contentId, HttpServletRequest request) {
        try {
            String username = extractUsername(request);
            Set<Content> favorites = userService.removeFavorite(username, contentId);
            return ResponseEntity.ok(favorites);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }
}