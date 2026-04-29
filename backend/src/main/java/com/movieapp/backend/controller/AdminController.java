package com.movieapp.backend.controller;

import com.movieapp.backend.model.Content;
import com.movieapp.backend.model.Movie;
import com.movieapp.backend.service.UserService;
import com.movieapp.backend.repository.ContentRepository;
import com.movieapp.backend.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private ContentRepository contentRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    private String extractUsername(HttpServletRequest request) {
        String username = request.getHeader("X-Username");
        if (username != null && !username.isBlank()) {
            return username;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.validateToken(token)) {
                return jwtUtil.getUsernameFromToken(token);
            }
        }

        return null;
    }

    private ResponseEntity<String> requireAdmin(HttpServletRequest request) {
        String username = extractUsername(request);
        if (username == null || !userService.isAdmin(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Admin erişimi için geçerli bir ADMIN rolü gereklidir.");
        }
        return null;
    }

    @PostMapping("/movies")
    public ResponseEntity<?> addMovie(HttpServletRequest request, @RequestBody Movie movie) {
        ResponseEntity<String> authCheck = requireAdmin(request);
        if (authCheck != null) {
            return authCheck;
        }

        if (movie.getTitle() == null || movie.getTitle().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Movie title is required");
        }
        if (movie.getGenre() == null || movie.getGenre().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Movie genre is required");
        }
        if (movie.getReleaseYear() <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Valid release year is required");
        }
        if (movie.getDirector() == null || movie.getDirector().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Movie director is required");
        }
        if (movie.getDurationMinutes() <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Valid duration is required");
        }

        Content savedMovie = contentRepository.save(movie);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMovie);
    }
}
