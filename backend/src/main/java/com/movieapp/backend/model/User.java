package com.movieapp.backend.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    // Rolü String yerine Enum yaptık (Admin/User kontrolü daha güvenli olsun diye)
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    // Artık sadece Movie değil, Content (Film+Dizi) ekleyebiliyoruz
    @ManyToMany
    @JoinTable(
            name = "user_favorites",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "content_id")
    )
    private Set<Content> favorites = new HashSet<>();

    // Watchlist için de Content kullanıyoruz
    @ManyToMany
    @JoinTable(
            name = "user_watchlist",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "content_id")
    )
    private Set<Content> watchlist = new HashSet<>();

    // Kullanıcının yaptığı yorumlar
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    // Boş Constructor (JPA için zorunlu)
    public User() {
    }

    // Senin eski servislerinin patlamaması için eski Constructor'ın
    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // --- GETTERS & SETTERS ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Set<Content> getFavorites() {
        return favorites;
    }

    public void setFavorites(Set<Content> favorites) {
        this.favorites = favorites;
    }

    public Set<Content> getWatchlist() {
        return watchlist;
    }

    public void setWatchlist(Set<Content> watchlist) {
        this.watchlist = watchlist;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }
}