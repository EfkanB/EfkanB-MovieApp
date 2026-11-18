package com.movieapp.backend.controller;

import com.movieapp.backend.model.Review;
import com.movieapp.backend.service.ReviewService;
import com.movieapp.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private UserService userService;

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

    // Bir content'in puan istatistiklerini getir
    @GetMapping("/stats/{contentId}")
    public ResponseEntity<?> getRatingStats(@PathVariable Long contentId) {
        try {
            Map<String, Object> stats = reviewService.getRatingStats(contentId);
            return ResponseEntity.ok(stats);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Yeni yorum ekle
    @PostMapping
    public ResponseEntity<?> addReview(Principal principal,
                                       @RequestBody Map<String, Object> reviewRequest) {
        String username = principal.getName();

        try {
            Object contentIdRaw = reviewRequest.get("contentId");
            Object ratingRaw = reviewRequest.get("rating");
            if (contentIdRaw == null || ratingRaw == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "contentId ve rating zorunludur"));
            }
            Long contentId = Long.valueOf(contentIdRaw.toString());
            Integer rating = Integer.valueOf(ratingRaw.toString());
            Object commentRaw = reviewRequest.get("comment");
            String comment = commentRaw == null ? null : commentRaw.toString().trim();
            if (comment != null && comment.length() > 500) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Yorum en fazla 500 karakter olabilir"));
            }

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
    public ResponseEntity<?> deleteReview(Principal principal, @PathVariable Long reviewId) {
        String username = principal.getName();

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
}
