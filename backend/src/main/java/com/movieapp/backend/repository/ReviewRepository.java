package com.movieapp.backend.repository;

import com.movieapp.backend.model.Content;
import com.movieapp.backend.model.Review;
import com.movieapp.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByContent(Content content);

    List<Review> findByContentId(Long contentId);

    Optional<Review> findByUserAndContent(User user, Content content);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.content.id = :contentId")
    Double getAverageRatingByContentId(Long contentId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.content.id = :contentId")
    Long getReviewCountByContentId(Long contentId);
}