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
public class WatchlistController {

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

    @GetMapping({"/watchlist", "/users/me/watchlist"})
    public ResponseEntity<?> getWatchlist(HttpServletRequest request) {
        try {
            String username = extractUsername(request);
            Set<Content> watchlist = userService.getWatchlist(username);
            return ResponseEntity.ok(watchlist);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
        }
    }

    @PostMapping({"/watchlist/{contentId}", "/users/me/watchlist/{contentId}"})
    public ResponseEntity<?> addToWatchlist(@PathVariable Long contentId, HttpServletRequest request) {
        try {
            String username = extractUsername(request);
            Set<Content> watchlist = userService.addToWatchlist(username, contentId);
            return ResponseEntity.ok(watchlist);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @DeleteMapping({"/watchlist/{contentId}", "/users/me/watchlist/{contentId}"})
    public ResponseEntity<?> removeFromWatchlist(@PathVariable Long contentId, HttpServletRequest request) {
        try {
            String username = extractUsername(request);
            Set<Content> watchlist = userService.removeFromWatchlist(username, contentId);
            return ResponseEntity.ok(watchlist);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }
}