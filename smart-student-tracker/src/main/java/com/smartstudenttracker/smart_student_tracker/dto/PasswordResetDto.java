package com.smartstudenttracker.smart_student_tracker.dto;

public class PasswordResetDto {
    private String email;
    private String resetCode;
    private String newPassword;

   
    public String getEmail() {
        return email;
    }

   
    public void setEmail(String email) {
        this.email = email;
    }

    
    public String getResetCode() {
        return resetCode;
    }

    
    public void setResetCode(String resetCode) {
        this.resetCode = resetCode;
    }

    
    public String getNewPassword() {
        return newPassword;
    }

   
    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
