package com.movieapp.backend.repository;

import com.movieapp.backend.model.Content;
import com.movieapp.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByContent(Content content);

    List<Review> findByContentId(Long contentId);
}