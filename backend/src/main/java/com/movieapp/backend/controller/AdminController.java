package com.movieapp.backend.controller;

import com.movieapp.backend.model.Content;
import com.movieapp.backend.model.Movie;
import com.movieapp.backend.model.Series;
import com.movieapp.backend.repository.ContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ContentRepository contentRepository;











    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/content/add-movie")
    public ResponseEntity<?> addMovie(@RequestBody Movie movie) {


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

        movie.setId(null); // yeni kayıt: mevcut bir içeriğin üzerine yazılmasın
        Content savedMovie = contentRepository.save(movie);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMovie);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/content/add-series")
    public ResponseEntity<?> addSeries(@RequestBody Series series) {


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

        series.setId(null);
        Content savedSeries = contentRepository.save(series);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedSeries);
    }



}
