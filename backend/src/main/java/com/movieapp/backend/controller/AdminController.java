package com.movieapp.backend.controller;

import com.movieapp.backend.model.Content;
import com.movieapp.backend.model.Movie;
import com.movieapp.backend.model.Series;
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

    @PostMapping("/content/add-movie")
    public ResponseEntity<?> addMovie(HttpServletRequest request, @RequestBody Movie movie) {
        ResponseEntity<String> authCheck = requireAdmin(request);
        if (authCheck != null) {
            return authCheck;
        }

        // Validasyonlar
        if (movie.getTitle() == null || movie.getTitle().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Film başlığı zorunludur");
        }
        if (movie.getGenre() == null || movie.getGenre().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Film türü zorunludur");
        }
        if (movie.getReleaseYear() == null || movie.getReleaseYear() <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Geçerli bir çıkış yılı zorunludur");
        }
        if (movie.getDirector() == null || movie.getDirector().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Film yönetmeni zorunludur");
        }
        if (movie.getDurationMinutes() == null || movie.getDurationMinutes() <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Geçerli bir süre zorunludur");
        }

        try {
            Content savedMovie = contentRepository.save(movie);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedMovie);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Film eklenirken bir hata oluştu: " + e.getMessage());
        }
    }

    @PostMapping("/content/add-series")
    public ResponseEntity<?> addSeries(HttpServletRequest request, @RequestBody Series series) {
        ResponseEntity<String> authCheck = requireAdmin(request);
        if (authCheck != null) {
            return authCheck;
        }

        // Validasyonlar
        if (series.getTitle() == null || series.getTitle().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Dizi başlığı zorunludur");
        }
        if (series.getGenre() == null || series.getGenre().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Dizi türü zorunludur");
        }
        if (series.getReleaseYear() == null || series.getReleaseYear() <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Geçerli bir çıkış yılı zorunludur");
        }
        if (series.getSeasonCount() == null || series.getSeasonCount() <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Geçerli bir sezon sayısı zorunludur");
        }
        if (series.getEpisodeCount() == null || series.getEpisodeCount() <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Geçerli bir bölüm sayısı zorunludur");
        }

        try {
            Content savedSeries = contentRepository.save(series);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedSeries);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Dizi eklenirken bir hata oluştu: " + e.getMessage());
        }
    }

    @PostMapping("/movies")
    public ResponseEntity<?> addMovieLegacy(HttpServletRequest request, @RequestBody Movie movie) {
        return addMovie(request, movie);
    }
}
