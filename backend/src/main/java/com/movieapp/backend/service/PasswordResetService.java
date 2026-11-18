package com.movieapp.backend.service;

import com.movieapp.backend.dto.ForgotPasswordRequest;

import com.movieapp.backend.dto.ResetPasswordRequest;
import com.movieapp.backend.model.PasswordResetToken;
import com.movieapp.backend.model.User;
import com.movieapp.backend.repository.PasswordResetTokenRepository;
import com.movieapp.backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;


@Service
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;

    private final BCryptPasswordEncoder passwordEncoder;

    private final long tokenExpiryMinutes = 15;

    public PasswordResetService(UserRepository userRepository,
                                 PasswordResetTokenRepository tokenRepository,
                                 EmailService emailService) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail();

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("Kullanıcı bulunamadı");
        }

        User user = userOpt.get();


        String token = UUID.randomUUID().toString().replace("-", "");
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(tokenExpiryMinutes);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(expiry);
        resetToken.setUsed(false);


        tokenRepository.save(resetToken);

        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    public void resetPassword(ResetPasswordRequest request) {
        String tokenValue = request.getToken();

        PasswordResetToken resetToken = tokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new RuntimeException("Geçersiz token"));

        if (resetToken.isUsed()) {
            throw new RuntimeException("Token zaten kullanılmış");
        }

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token süresi dolmuş");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        tokenRepository.delete(resetToken);
        userRepository.save(user);

    }
}

