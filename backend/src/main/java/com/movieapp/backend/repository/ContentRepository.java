package com.movieapp.backend.repository;

import com.movieapp.backend.model.Content;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentRepository extends JpaRepository<Content, Long> {

    // Tür ve başlığa göre arama
    @Query("SELECT c FROM Content c WHERE " +
           "(:genre IS NULL OR LOWER(c.genre) LIKE LOWER(CONCAT('%', :genre, '%'))) AND " +
           "(:title IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :title, '%')))")
    List<Content> findByGenreAndTitle(@Param("genre") String genre, @Param("title") String title);

    // Sadece türe göre arama
    List<Content> findByGenreContainingIgnoreCase(String genre);

    // Sadece başlığa göre arama
    List<Content> findByTitleContainingIgnoreCase(String title);

    // Movie tipinde olanları getir
    @Query("SELECT c FROM Content c WHERE TYPE(c) = Movie")
    List<Content> findAllMovies();

    // Series tipinde olanları getir
    @Query("SELECT c FROM Content c WHERE TYPE(c) = Series")
    List<Content> findAllSeries();
}