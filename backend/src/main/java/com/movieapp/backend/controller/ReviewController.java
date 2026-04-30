package com.movieapp.backend.controller;

import com.movieapp.backend.model.Review;
import com.movieapp.backend.service.ReviewService;
import com.movieapp.backend.service.UserService;
import com.movieapp.backend.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // Bir content için tüm yorumları getir
    @GetMapping("/content/{contentId}")
    public ResponseEntity<List<Review>> getReviewsForContent(@PathVariable Long contentId) {
        try {
            List<Review> reviews = reviewService.getReviewsForContent(contentId);
            return ResponseEntity.ok(reviews);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Yeni yorum ekle
    @PostMapping
    public ResponseEntity<?> addReview(HttpServletRequest request,
                                       @RequestBody Map<String, Object> reviewRequest) {
        String username = extractUsername(request);
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentication required"));
        }

        try {
            Long contentId = Long.valueOf(reviewRequest.get("contentId").toString());
            Integer rating = Integer.valueOf(reviewRequest.get("rating").toString());
            String comment = (String) reviewRequest.get("comment");

            Review review = reviewService.addReview(username, contentId, rating, comment);
            return ResponseEntity.ok(review);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid rating or contentId"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // Yorum sil (kullanıcı kendi yorumunu silebilir veya admin tümünü)
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(HttpServletRequest request, @PathVariable Long reviewId) {
        String username = extractUsername(request);
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentication required"));
        }

        try {
            Review review = reviewService.getReviewById(reviewId)
                    .orElseThrow(() -> new RuntimeException("Review not found"));

            boolean isOwner = review.getUser().getUsername().equals(username);
            boolean isAdmin = userService.isAdmin(username);

            if (!isOwner && !isAdmin) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "You can only delete your own reviews"));
            }

            reviewService.deleteReview(reviewId);
            return ResponseEntity.ok(Map.of("message", "Review deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    private String extractUsername(HttpServletRequest request) {
        String username = request.getHeader("X-Username");
        if (username != null && !username.isBlank()) {
            return username;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.validateToken(token)) {
                return jwtUtil.getUsernameFromToken(token);
            }
        }

        return null;
    }
}