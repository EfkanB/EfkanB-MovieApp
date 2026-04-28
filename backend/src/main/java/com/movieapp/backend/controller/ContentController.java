package com.movieapp.backend.controller;

import com.movieapp.backend.model.Content;
import com.movieapp.backend.model.Movie;
import com.movieapp.backend.model.Series;
import com.movieapp.backend.repository.ContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ContentController {

    @Autowired
    private ContentRepository contentRepository;

    // Tüm içerikleri getir
    @GetMapping("/contents")
    public ResponseEntity<List<Content>> getAllContents() {
        List<Content> contents = contentRepository.findAll();
        return ResponseEntity.ok(contents);
    }

    // Sadece filmleri getir
    @GetMapping("/movies")
    public ResponseEntity<List<Content>> getAllMovies() {
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

    // Film ekleme (Admin için)
    @PostMapping("/movies")
    public ResponseEntity<Movie> addMovie(@RequestBody Movie movie) {
        Movie savedMovie = (Movie) contentRepository.save(movie);
        return ResponseEntity.ok(savedMovie);
    }

    // Dizi ekleme (Admin için)
    @PostMapping("/series")
    public ResponseEntity<Series> addSeries(@RequestBody Series series) {
        Series savedSeries = (Series) contentRepository.save(series);
        return ResponseEntity.ok(savedSeries);
    }

    // İçerik güncelleme (Admin için)
    @PutMapping("/contents/{id}")
    public ResponseEntity<Content> updateContent(@PathVariable Long id, @RequestBody Content content) {
        if (!contentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        content.setId(id);
        Content updatedContent = contentRepository.save(content);
        return ResponseEntity.ok(updatedContent);
    }

    // İçerik silme (Admin için)
    @DeleteMapping("/contents/{id}")
    public ResponseEntity<Void> deleteContent(@PathVariable Long id) {
        if (!contentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        contentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}