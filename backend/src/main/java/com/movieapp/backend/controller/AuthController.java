package com.movieapp.backend.controller;

import com.movieapp.backend.dto.AuthRequest;
import com.movieapp.backend.dto.AuthResponse;
import com.movieapp.backend.model.User;
import com.movieapp.backend.service.UserService;
import com.movieapp.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        try {
            User user = new User(request.getUsername(), request.getPassword());
            User registered = userService.register(user);
            String token = jwtUtil.generateToken(registered.getUsername());
            return ResponseEntity.ok(new AuthResponse(registered.getUsername(), token));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        Optional<User> user = userService.authenticate(request.getUsername(), request.getPassword());
        if (user.isPresent()) {
            String token = jwtUtil.generateToken(user.get().getUsername());
            return ResponseEntity.ok(new AuthResponse(user.get().getUsername(), token));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
    }
}