package com.movieapp.backend.controller;

import com.movieapp.backend.model.Movie;
import com.movieapp.backend.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private MovieService movieService;

    @Value("${admin.key:admin123}")
    private String adminKey;

    @PostMapping("/movies")
    public ResponseEntity<?> addMovie(
            @RequestHeader(value = "X-ADMIN-KEY", required = false) String adminHeader,
            @RequestBody Movie movie) {

        if (adminHeader == null || !adminHeader.equals(adminKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized admin access");
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

        Movie savedMovie = movieService.saveMovie(movie);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMovie);
    }
}
