package com.movieapp.backend.service;

import com.movieapp.backend.model.Content;
import com.movieapp.backend.model.Review;
import com.movieapp.backend.model.User;
import com.movieapp.backend.repository.ContentRepository;
import com.movieapp.backend.repository.ReviewRepository;
import com.movieapp.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ContentRepository contentRepository;

    public Review addReview(String username, Long contentId, Integer rating, String comment) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));

        if (rating < 1 || rating > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        // Check if user already reviewed this content
        Optional<Review> existingReview = reviewRepository.findByUserAndContent(user, content);
        
        Review review;
        if (existingReview.isPresent()) {
            // Update existing review
            review = existingReview.get();
            review.setRating(rating);
            review.setComment(comment);
        } else {
            // Create new review
            review = new Review();
            review.setUser(user);
            review.setContent(content);
            review.setRating(rating);
            review.setComment(comment);
        }

        return reviewRepository.save(review);
    }

    public List<Review> getReviewsForContent(Long contentId) {
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));

        return reviewRepository.findByContent(content);
    }

    public Map<String, Object> getRatingStats(Long contentId) {
        Double averageRating = reviewRepository.getAverageRatingByContentId(contentId);
        Long reviewCount = reviewRepository.getReviewCountByContentId(contentId);

        // Map.of null kabul etmez; yorumu olmayan içerikte ortalama null olduğu için HashMap kullanılıyor
        Map<String, Object> stats = new HashMap<>();
        stats.put("averageRating", averageRating != null ? Math.round(averageRating * 10.0) / 10.0 : null);
        stats.put("reviewCount", reviewCount != null ? reviewCount : 0L);
        return stats;
    }

    public Optional<Review> getReviewById(Long reviewId) {
        return reviewRepository.findById(reviewId);
    }

    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }
}