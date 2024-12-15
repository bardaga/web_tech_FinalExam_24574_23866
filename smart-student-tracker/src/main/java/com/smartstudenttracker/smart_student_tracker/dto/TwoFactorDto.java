package com.smartstudenttracker.smart_student_tracker.dto;

public class TwoFactorDto {
    private String username;
    private String code;

    // Constructors
    public TwoFactorDto() {}

    public TwoFactorDto(String username, String code) {
        this.username = username;
        this.code = code;
    }

    // Getters and setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}