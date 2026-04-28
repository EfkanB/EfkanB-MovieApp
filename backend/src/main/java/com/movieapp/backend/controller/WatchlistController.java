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
@RequestMapping("/api")
public class WatchlistController {

    @Autowired
    private UserService userService;

    private String extractUsername(HttpServletRequest request) {
        return (String) request.getAttribute("username");
    }

    @GetMapping("/watchlist")
    public ResponseEntity<?> getWatchlist(HttpServletRequest request) {
        try {
            String username = extractUsername(request);
            Set<Content> watchlist = userService.getWatchlist(username);
            return ResponseEntity.ok(watchlist);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
        }
    }

    @PostMapping("/watchlist")
    public ResponseEntity<?> addToWatchlist(@RequestBody AddContentRequest requestBody, HttpServletRequest request) {
        try {
            String username = extractUsername(request);
            Set<Content> watchlist = userService.addToWatchlist(username, requestBody.getContentId());
            return ResponseEntity.ok(watchlist);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @DeleteMapping("/watchlist/{contentId}")
    public ResponseEntity<?> removeFromWatchlist(@PathVariable Long contentId, HttpServletRequest request) {
        try {
            String username = extractUsername(request);
            Set<Content> watchlist = userService.removeFromWatchlist(username, contentId);
            return ResponseEntity.ok(watchlist);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    public static class AddContentRequest {
        private Long contentId;
        public Long getContentId() { return contentId; }
        public void setContentId(Long contentId) { this.contentId = contentId; }
    }
}