package com.movieapp.backend;

import com.movieapp.backend.model.Movie;
import com.movieapp.backend.repository.MovieRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    CommandLineRunner initMovies(MovieRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(new Movie("Inception", "A thief who steals corporate secrets through dream-sharing technology.", "Sci-Fi", 2010));
                repository.save(new Movie("The Dark Knight", "Batman faces the Joker in Gotham City.", "Action", 2008));
                repository.save(new Movie("Interstellar", "A team travels through a wormhole in space.", "Adventure", 2014));
            }
        };
    }
}