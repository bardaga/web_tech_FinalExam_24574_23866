package com.smartstudenttracker.smart_student_tracker.dto;

public class LoginResponseDTO {
    private String token;
    private boolean requireTwoFactor;
    private String username;

    // Constructors
    public LoginResponseDTO() {}

    public LoginResponseDTO(String token, boolean requireTwoFactor, String username) {
        this.token = token;
        this.requireTwoFactor = requireTwoFactor;
        this.username = username;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public boolean isRequireTwoFactor() {
        return requireTwoFactor;
    }

    public void setRequireTwoFactor(boolean requireTwoFactor) {
        this.requireTwoFactor = requireTwoFactor;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
