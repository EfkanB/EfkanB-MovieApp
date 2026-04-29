package com.movieapp.backend.dto;

public class AddContentRequest {
    private Long contentId;

    public AddContentRequest() {
    }

    public AddContentRequest(Long contentId) {
        this.contentId = contentId;
    }

    public Long getContentId() {
        return contentId;
    }

    public void setContentId(Long contentId) {
        this.contentId = contentId;
    }
}