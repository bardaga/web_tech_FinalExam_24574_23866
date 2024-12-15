package com.smartstudenttracker.smart_student_tracker.controller;

import com.smartstudenttracker.smart_student_tracker.dto.LoginDto;
import com.smartstudenttracker.smart_student_tracker.dto.PasswordResetDto;
import com.smartstudenttracker.smart_student_tracker.dto.TwoFactorDto;
import com.smartstudenttracker.smart_student_tracker.entity.User;
import com.smartstudenttracker.smart_student_tracker.services.AuthenticationService;

import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        try {
           
            if (loginDto == null) {
                return ResponseEntity.badRequest().body("Login details cannot be null");
            }
    
            if (loginDto.getUsernameOrEmail() == null || 
                loginDto.getUsernameOrEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Username/Email is required");
            }
    
            if (loginDto.getPassword() == null || 
                loginDto.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Password is required");
            }
    
            boolean isAuthenticated = authenticationService.authenticateUser(loginDto);
            
            if (isAuthenticated) {
                return ResponseEntity.ok(Map.of(
                    "message", "Two-factor authentication code sent to email",
                    "username", loginDto.getUsernameOrEmail()
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid credentials");
            }
        } catch (Exception e) {
           
            logger.error("Login process error", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An error occurred during login: " + e.getMessage());
        }
    }

    @PostMapping("/verify-2fa")
    public ResponseEntity<?> verifyTwoFactor(@RequestBody TwoFactorDto twoFactorDto) {
        try {
            boolean isValidCode = authenticationService.verifyTwoFactorCode(twoFactorDto);
            
            if (isValidCode) {
                return ResponseEntity.ok(Map.of("message", "Authentication successful"));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or expired two-factor authentication code"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An error occurred during two-factor authentication"));
        }
    }

    
    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody User user) {
        try {
           
            User registeredUser = authenticationService.signUp(user);
            
           
            registeredUser.setPassword(null);
            return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
        } catch (RuntimeException e) {
          
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        try {
            authenticationService.initiatePasswordReset(email);
            return ResponseEntity.ok().body(Map.of("message", "Reset code sent to your email"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetDto resetDto) {
        try {
            boolean resetSuccessful = authenticationService.resetPassword(resetDto);
            if (resetSuccessful) {
                return ResponseEntity.ok().body(Map.of("message", "Password reset successful"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid reset code"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password reset failed"));
        }
    }
}