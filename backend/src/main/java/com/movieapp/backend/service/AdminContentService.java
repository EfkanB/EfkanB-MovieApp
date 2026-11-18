package com.movieapp.backend.service;

import com.movieapp.backend.model.Content;
import com.movieapp.backend.model.Movie;
import com.movieapp.backend.model.Series;
import com.movieapp.backend.repository.ContentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminContentService {

    private final ContentRepository contentRepository;

    public AdminContentService(ContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    // ---------------------- MOVIES ----------------------
    public Movie createMovie(Movie movie) {
        validateMovie(movie);
        movie.setId(null); // yeni kayıt: mevcut bir içeriğin üzerine yazılmasın
        return (Movie) contentRepository.save(movie);
    }

    public List<Content> listMovies() {
        return contentRepository.findAllMovies();
    }

    public Content getMovie(Long id) {
        return contentRepository.findById(id)
                .filter(c -> c instanceof Movie)
                .orElseThrow(() -> new ContentNotFoundException("Film bulunamadı", HttpStatus.NOT_FOUND));
    }

    public Content updateMovie(Long id, Movie movie) {
        if (!contentRepository.existsById(id)) {
            throw new ContentNotFoundException("Film bulunamadı", HttpStatus.NOT_FOUND);
        }

        Content existing = contentRepository.findById(id)
                .orElseThrow(() -> new ContentNotFoundException("Film bulunamadı", HttpStatus.NOT_FOUND));

        if (!(existing instanceof Movie)) {
            throw new IllegalArgumentException("Bu ID film değil");
        }

        validateMovie(movie);
        movie.setId(id);
        return contentRepository.save(movie);
    }

    public void deleteMovie(Long id) {
        if (!contentRepository.existsById(id)) {
            throw new ContentNotFoundException("Film bulunamadı", HttpStatus.NOT_FOUND);
        }
        contentRepository.deleteById(id);
    }

    // ---------------------- SERIES ----------------------
    public Series createSeries(Series series) {
        validateSeries(series);
        series.setId(null);
        return (Series) contentRepository.save(series);
    }

    public List<Content> listSeries() {
        return contentRepository.findAllSeries();
    }

    public Content getSeries(Long id) {
        return contentRepository.findById(id)
                .filter(c -> c instanceof Series)
                .orElseThrow(() -> new ContentNotFoundException("Dizi bulunamadı", HttpStatus.NOT_FOUND));
    }

    public Content updateSeries(Long id, Series series) {
        if (!contentRepository.existsById(id)) {
            throw new ContentNotFoundException("Dizi bulunamadı", HttpStatus.NOT_FOUND);
        }

        Content existing = contentRepository.findById(id)
                .orElseThrow(() -> new ContentNotFoundException("Dizi bulunamadı", HttpStatus.NOT_FOUND));

        if (!(existing instanceof Series)) {
            throw new IllegalArgumentException("Bu ID dizi değil");
        }

        validateSeries(series);
        series.setId(id);
        return contentRepository.save(series);
    }

    public void deleteSeries(Long id) {
        if (!contentRepository.existsById(id)) {
            throw new ContentNotFoundException("Dizi bulunamadı", HttpStatus.NOT_FOUND);
        }
        contentRepository.deleteById(id);
    }

    // ---------------------- Validation ----------------------
    private void validateMovie(Movie movie) {
        if (movie == null) {
            throw new IllegalArgumentException("Film zorunludur");
        }
        if (isBlank(movie.getTitle())) {
            throw new IllegalArgumentException("Film başlığı zorunludur");
        }
        if (isBlank(movie.getGenre())) {
            throw new IllegalArgumentException("Film türü zorunludur");
        }
        if (movie.getReleaseYear() == null || movie.getReleaseYear() <= 0) {
            throw new IllegalArgumentException("Geçerli bir çıkış yılı zorunludur");
        }
        if (isBlank(movie.getDirector())) {
            throw new IllegalArgumentException("Film yönetmeni zorunludur");
        }
        if (movie.getDurationMinutes() == null || movie.getDurationMinutes() <= 0) {
            throw new IllegalArgumentException("Geçerli bir süre zorunludur");
        }
    }

    private void validateSeries(Series series) {
        if (series == null) {
            throw new IllegalArgumentException("Dizi zorunludur");
        }
        if (isBlank(series.getTitle())) {
            throw new IllegalArgumentException("Dizi başlığı zorunludur");
        }
        if (isBlank(series.getGenre())) {
            throw new IllegalArgumentException("Dizi türü zorunludur");
        }
        if (series.getReleaseYear() == null || series.getReleaseYear() <= 0) {
            throw new IllegalArgumentException("Geçerli bir çıkış yılı zorunludur");
        }
        if (series.getSeasonCount() == null || series.getSeasonCount() <= 0) {
            throw new IllegalArgumentException("Geçerli bir sezon sayısı zorunludur");
        }
        if (series.getEpisodeCount() == null || series.getEpisodeCount() <= 0) {
            throw new IllegalArgumentException("Geçerli bir bölüm sayısı zorunludur");
        }
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    // ---------------------- Exception ----------------------
    public static class ContentNotFoundException extends RuntimeException {
        private final HttpStatus status;

        public ContentNotFoundException(String message, HttpStatus status) {
            super(message);
            this.status = status;
        }

        public HttpStatus getStatus() {
            return status;
        }
    }
}

