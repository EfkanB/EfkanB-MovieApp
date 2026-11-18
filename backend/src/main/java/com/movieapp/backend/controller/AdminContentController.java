package com.movieapp.backend.controller;

import com.movieapp.backend.model.Content;
import com.movieapp.backend.model.Movie;
import com.movieapp.backend.model.Series;
import com.movieapp.backend.service.AdminContentService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminContentController {

    private final AdminContentService adminContentService;


    public AdminContentController(AdminContentService adminContentService) {
        this.adminContentService = adminContentService;
    }


    // ---------------------- MOVIES ----------------------
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/movies")
    public ResponseEntity<Movie> createMovie(@RequestBody Movie movie) {
        Movie created = adminContentService.createMovie(movie);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/movies")
    public ResponseEntity<List<Content>> listMovies() {
        return ResponseEntity.ok(adminContentService.listMovies());
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/movies/{id}")
    public ResponseEntity<Content> getMovie(@PathVariable Long id) {
        return ResponseEntity.ok(adminContentService.getMovie(id));
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/movies/{id}")
    public ResponseEntity<Content> updateMovie(@PathVariable Long id, @RequestBody Movie movie) {
        return ResponseEntity.ok(adminContentService.updateMovie(id, movie));
    }


    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/movies/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        adminContentService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }


    // ---------------------- SERIES ----------------------
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/series")
    public ResponseEntity<Series> createSeries(@RequestBody Series series) {
        Series created = adminContentService.createSeries(series);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/series")
    public ResponseEntity<List<Content>> listSeries() {
        return ResponseEntity.ok(adminContentService.listSeries());
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/series/{id}")
    public ResponseEntity<Content> getSeries(@PathVariable Long id) {
        return ResponseEntity.ok(adminContentService.getSeries(id));
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/series/{id}")
    public ResponseEntity<Content> updateSeries(@PathVariable Long id, @RequestBody Series series) {
        return ResponseEntity.ok(adminContentService.updateSeries(id, series));
    }


    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/series/{id}")
    public ResponseEntity<Void> deleteSeries(@PathVariable Long id) {
        adminContentService.deleteSeries(id);
        return ResponseEntity.noContent().build();
    }



}

