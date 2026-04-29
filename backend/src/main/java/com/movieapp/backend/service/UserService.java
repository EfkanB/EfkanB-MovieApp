package com.movieapp.backend.service;

import com.movieapp.backend.model.Content;
import com.movieapp.backend.model.Role;
import com.movieapp.backend.model.User;
import com.movieapp.backend.repository.ContentRepository;
import com.movieapp.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ContentRepository contentRepository; // Artık MovieRepository değil, ContentRepository kullanıyoruz
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, ContentRepository contentRepository) {
        this.userRepository = userRepository;
        this.contentRepository = contentRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public User register(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> authenticate(String username, String password) {
        Optional<User> existingUser = userRepository.findByUsername(username);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public boolean isAdmin(String username) {
        return userRepository.findByUsername(username)
                .map(user -> user.getRole() == Role.ADMIN)
                .orElse(false);
    }

    // Artık Set<Movie> değil, Set<Content> dönüyor
    public Set<Content> getFavorites(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getFavorites();
    }

    @Transactional
    public Set<Content> addFavorite(String username, Long contentId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));
        user.getFavorites().add(content);
        return userRepository.save(user).getFavorites();
    }

    @Transactional
    public Set<Content> removeFavorite(String username, Long contentId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));
        user.getFavorites().remove(content);
        return userRepository.save(user).getFavorites();
    }

    public Set<Content> getWatchlist(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getWatchlist();
    }

    @Transactional
    public Set<Content> addToWatchlist(String username, Long contentId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));
        user.getWatchlist().add(content);
        return userRepository.save(user).getWatchlist();
    }

    @Transactional
    public Set<Content> removeFromWatchlist(String username, Long contentId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));
        user.getWatchlist().remove(content);
        return userRepository.save(user).getWatchlist();
    }
}