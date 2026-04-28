package com.movieapp.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    @Column(length = 1000)
    private String description;
    
    private Integer releaseYear;
    private String genre;
    private String posterUrl;

    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    // Senin eski Movie sınıfındaki çift yönlü ilişkileri buraya taşıdık
    @JsonIgnore
    @ManyToMany(mappedBy = "favorites")
    private Set<User> favoritedBy = new HashSet<>();

    @JsonIgnore
    @ManyToMany(mappedBy = "watchlist")
    private Set<User> watchlistedBy = new HashSet<>();

    // GETTERS & SETTERS
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getReleaseYear() { return releaseYear; }
    public void setReleaseYear(Integer releaseYear) { this.releaseYear = releaseYear; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    public List<Review> getReviews() { return reviews; }
    public void setReviews(List<Review> reviews) { this.reviews = reviews; }

    public Set<User> getFavoritedBy() { return favoritedBy; }
    public void setFavoritedBy(Set<User> favoritedBy) { this.favoritedBy = favoritedBy; }

    public Set<User> getWatchlistedBy() { return watchlistedBy; }
    public void setWatchlistedBy(Set<User> watchlistedBy) { this.watchlistedBy = watchlistedBy; }
}