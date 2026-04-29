package com.movieapp.backend.controller;

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
            // Güvenlik: Dışarıdan biri admin olamasın diye varsayılan olarak USER atıyoruz
            user.setRole(Role.USER); 
            
            User registeredUser = userService.register(user);
            
            AuthResponse response = new AuthResponse(
                registeredUser.getUsername(),
                registeredUser.getRole().name(),
                jwtUtil.generateToken(registeredUser.getUsername())
            );
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        Optional<User> authenticatedUser = userService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());
        
        if (authenticatedUser.isPresent()) {
            User user = authenticatedUser.get();
            
            AuthResponse response = new AuthResponse(
                user.getUsername(),
                user.getRole().name(),
                jwtUtil.generateToken(user.getUsername())
            );
            
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Hatalı kullanıcı adı veya şifre!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }
}