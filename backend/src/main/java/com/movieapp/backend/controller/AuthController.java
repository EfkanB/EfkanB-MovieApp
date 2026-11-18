package com.movieapp.backend.controller;

import com.movieapp.backend.dto.AuthRequest;
import com.movieapp.backend.dto.AuthResponse;
import com.movieapp.backend.model.Role;
import com.movieapp.backend.model.User;
import com.movieapp.backend.service.UserService;
import com.movieapp.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            // Güvenlik: istemciden gelen id ve rol asla kullanılmaz.
            // id gönderilirse JPA mevcut bir kullanıcının (ör. admin) üzerine yazabilirdi.
            user.setId(null);
            user.setRole(Role.USER);

            String username = user.getUsername() == null ? "" : user.getUsername().trim();
            if (!username.matches("^[A-Za-z0-9_.-]{3,30}$")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Kullanıcı adı 3-30 karakter olmalı; harf, rakam, _ . - içerebilir"));
            }
            user.setUsername(username);

            if (user.getPassword() == null || user.getPassword().length() < 8) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Şifre en az 8 karakter olmalı"));
            }

            // Email kontrolü (nullable/unique var)
            if (user.getEmail() == null || !user.getEmail().trim().matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Geçerli bir e-posta adresi girin"));
            }
            user.setEmail(user.getEmail().trim().toLowerCase());

            User registeredUser = userService.register(user);

            AuthResponse response = new AuthResponse(
                    registeredUser.getUsername(),
                    registeredUser.getRole().name(),
                    jwtUtil.generateToken(registeredUser)
            );

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest loginRequest) {
        Optional<User> authenticatedUser = userService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());
        
        if (authenticatedUser.isPresent()) {
            User user = authenticatedUser.get();
            
            AuthResponse response = new AuthResponse(
                user.getUsername(),
                user.getRole().name(),
                jwtUtil.generateToken(user)
            );
            
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Hatalı kullanıcı adı veya şifre!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }
}