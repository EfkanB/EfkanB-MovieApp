package com.movieapp.backend.model;

import jakarta.persistence.Entity;

@Entity
public class Movie extends Content {

    private String director;
    private Integer durationMinutes;

    // Boş Constructor
    public Movie() {}

    // Senin eski kodlarının hata vermemesi için dolu Constructor
    public Movie(String title, String description, String genre, Integer releaseYear) {
        this.setTitle(title);
        this.setDescription(description);
        this.setGenre(genre);
        this.setReleaseYear(releaseYear);
    }

    // GETTERS & SETTERS
    public String getDirector() { return director; }
    public void setDirector(String director) { this.director = director; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
}