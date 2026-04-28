package com.movieapp.backend.model;

import jakarta.persistence.Entity;

@Entity
public class Series extends Content {

    private Integer seasonCount;
    private Integer episodeCount;

    // GETTERS & SETTERS
    public Integer getSeasonCount() { return seasonCount; }
    public void setSeasonCount(Integer seasonCount) { this.seasonCount = seasonCount; }

    public Integer getEpisodeCount() { return episodeCount; }
    public void setEpisodeCount(Integer episodeCount) { this.episodeCount = episodeCount; }
}