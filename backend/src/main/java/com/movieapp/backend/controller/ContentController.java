package com.movieapp.backend.controller;

import com.movieapp.backend.model.Content;
import com.movieapp.backend.model.Movie;
import com.movieapp.backend.model.Series;
import com.movieapp.backend.repository.ContentRepository;
import com.movieapp.backend.service.UserService;
import com.movieapp.backend.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ContentController {

    @Autowired
    private ContentRepository contentRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // Tüm içerikleri getir (filmler + diziler)
    @GetMapping("/contents")
    public ResponseEntity<List<Content>> getAllContents() {
        List<Content> contents = contentRepository.findAll();
        return ResponseEntity.ok(contents);
    }

    // Sadece filmleri getir (eski MovieController ile uyumluluk için)
    @GetMapping("/movies")
    public ResponseEntity<List<Content>> getMovies() {
        List<Content> movies = contentRepository.findAllMovies();
        return ResponseEntity.ok(movies);
    }

    // Sadece dizileri getir
    @GetMapping("/series")
    public ResponseEntity<List<Content>> getAllSeries() {
        List<Content> series = contentRepository.findAllSeries();
        return ResponseEntity.ok(series);
    }

    // ID'ye göre içerik getir
    @GetMapping("/contents/{id}")
    public ResponseEntity<Content> getContentById(@PathVariable Long id) {
        return contentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Tür ve başlığa göre arama
    @GetMapping("/contents/search")
    public ResponseEntity<List<Content>> searchContents(
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String title) {
        List<Content> contents = contentRepository.findByGenreAndTitle(genre, title);
        return ResponseEntity.ok(contents);
    }

    // Sadece türe göre arama
    @GetMapping("/contents/search/genre")
    public ResponseEntity<List<Content>> searchByGenre(@RequestParam String genre) {
        List<Content> contents = contentRepository.findByGenreContainingIgnoreCase(genre);
        return ResponseEntity.ok(contents);
    }

    // Sadece başlığa göre arama
    @GetMapping("/contents/search/title")
    public ResponseEntity<List<Content>> searchByTitle(@RequestParam String title) {
        List<Content> contents = contentRepository.findByTitleContainingIgnoreCase(title);
        return ResponseEntity.ok(contents);
    }

    // Yeni arama endpoint'i: title parametresiyle içerik başlığına göre filtreler
    @GetMapping("/content/search")
    public ResponseEntity<List<Content>> searchContentByTitle(@RequestParam String title) {
        List<Content> contents = contentRepository.findByTitleContainingIgnoreCase(title);
        return ResponseEntity.ok(contents);
    }

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

    // Film ekleme (Admin için)
    @PostMapping("/movies")
    public ResponseEntity<Movie> addMovie(HttpServletRequest request, @RequestBody Movie movie) {
        ResponseEntity<String> authCheck = requireAdmin(request);
        if (authCheck != null) {
            return ResponseEntity.status(authCheck.getStatusCode()).build();
        }

        Movie savedMovie = (Movie) contentRepository.save(movie);
        return ResponseEntity.ok(savedMovie);
    }

    // Dizi ekleme (Admin için)
    @PostMapping("/series")
    public ResponseEntity<Series> addSeries(HttpServletRequest request, @RequestBody Series series) {
        ResponseEntity<String> authCheck = requireAdmin(request);
        if (authCheck != null) {
            return ResponseEntity.status(authCheck.getStatusCode()).build();
        }

        Series savedSeries = (Series) contentRepository.save(series);
        return ResponseEntity.ok(savedSeries);
    }

    // İçerik güncelleme (Admin için)
    @PutMapping("/contents/{id}")
    public ResponseEntity<Content> updateContent(HttpServletRequest request, @PathVariable Long id, @RequestBody Content content) {
        ResponseEntity<String> authCheck = requireAdmin(request);
        if (authCheck != null) {
            return ResponseEntity.status(authCheck.getStatusCode()).build();
        }

        if (!contentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        content.setId(id);
        Content updatedContent = contentRepository.save(content);
        return ResponseEntity.ok(updatedContent);
    }

    // İçerik silme (Admin için)
    @DeleteMapping("/contents/{id}")
    public ResponseEntity<Void> deleteContent(HttpServletRequest request, @PathVariable Long id) {
        ResponseEntity<String> authCheck = requireAdmin(request);
        if (authCheck != null) {
            return ResponseEntity.status(authCheck.getStatusCode()).build();
        }

        if (!contentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        contentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}