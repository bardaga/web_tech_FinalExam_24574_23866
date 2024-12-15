package com.smartstudenttracker.smart_student_tracker.services;

import com.smartstudenttracker.smart_student_tracker.dto.LoginDto;
import com.smartstudenttracker.smart_student_tracker.dto.PasswordResetDto;
import com.smartstudenttracker.smart_student_tracker.dto.TwoFactorDto;
import com.smartstudenttracker.smart_student_tracker.entity.User;
import com.smartstudenttracker.smart_student_tracker.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthenticationService {
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);
    private static final long TWO_FACTOR_CODE_EXPIRATION_MINUTES = 15;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    // Store 2FA codes with expiration
    private Map<String, TwoFactorCodeInfo> twofactorCodes = new ConcurrentHashMap<>();
    private Map<String, ResetCodeInfo> resetCodes = new ConcurrentHashMap<>();

    
    private static class TwoFactorCodeInfo {
        String code;
        LocalDateTime expirationTime;
        String username;

        TwoFactorCodeInfo(String code, String username) {
            this.code = code;
            this.username = username;
            this.expirationTime = LocalDateTime.now().plusMinutes(TWO_FACTOR_CODE_EXPIRATION_MINUTES);
        }

        boolean isExpired() {
            return LocalDateTime.now().isAfter(expirationTime);
        }
    }

   
    private String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashedBytes = md.digest(password.getBytes());
            
            StringBuilder sb = new StringBuilder();
            for (byte b : hashedBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            logger.error("Password hashing failed", e);
            throw new RuntimeException("Password hashing failed", e);
        }
    }

   
    public boolean authenticateUser(LoginDto loginDto) {
        try {
          
            logger.info("Login attempt - Username/Email: {}", loginDto.getUsernameOrEmail());
    
            
            System.out.println("Login Attempt Details:");
            System.out.println("Username/Email: " + loginDto.getUsernameOrEmail());
            System.out.println("Password Length: " + 
                (loginDto.getPassword() != null ? loginDto.getPassword().length() : "null"));
    
           
            if (loginDto.getUsernameOrEmail() == null || 
                loginDto.getUsernameOrEmail().trim().isEmpty()) {
                logger.warn("Login attempt with empty username/email");
                return false;
            }
    
            if (loginDto.getPassword() == null || 
                loginDto.getPassword().trim().isEmpty()) {
                logger.warn("Login attempt with empty password");
                return false;
            }
    
            
            Optional<User> userOptional = userRepository.findByUsername(loginDto.getUsernameOrEmail())
                    .or(() -> userRepository.findByEmail(loginDto.getUsernameOrEmail()));
    
            if (userOptional.isEmpty()) {
                logger.warn("No user found with username/email: {}", loginDto.getUsernameOrEmail());
                return false;
            }
    
            User user = userOptional.get();
            
           
            String hashedInputPassword = hashPassword(loginDto.getPassword());
            System.out.println("Input Password Hash: " + hashedInputPassword);
            System.out.println("Stored Password Hash: " + user.getPassword());
    
            boolean isAuthenticated = hashedInputPassword.equals(user.getPassword());
            
            if (!isAuthenticated) {
                logger.warn("Password mismatch for user: {}", loginDto.getUsernameOrEmail());
                return false;
            }
    
         
            String twoFactorCode = generateAndSendTwoFactorCode(user);
            
            return true;
        } catch (Exception e) {
           
            logger.error("Authentication error", e);
            e.printStackTrace(); 
            return false; 
        }
    }

    
    private String generateAndSendTwoFactorCode(User user) {
       
        String twoFactorCode = String.format("%06d", new Random().nextInt(999999));
        
        
        twofactorCodes.put(user.getEmail(), new TwoFactorCodeInfo(twoFactorCode, user.getUsername()));

        
        sendTwoFactorCodeEmail(user.getEmail(), twoFactorCode);

        return twoFactorCode;
    }

  
    private void sendTwoFactorCodeEmail(String to, String twoFactorCode) {
        SimpleMailMessage message = new SimpleMailMessage(); 
        message.setFrom("noreply@smartstudenttracker.com");
        message.setTo(to);
        message.setSubject("Your Two-Factor Authentication Code");
        message.setText("Your two-factor authentication code is: " + twoFactorCode + 
                        "\n\nThis code will expire in " + TWO_FACTOR_CODE_EXPIRATION_MINUTES + " minutes.");
        
        mailSender.send(message);
        
        logger.info("2FA code sent to email: {}", to);
    }

   
    public boolean verifyTwoFactorCode(TwoFactorDto twoFactorDto) {
        try {
           
            User user = userRepository.findByUsername(twoFactorDto.getUsername())
                    .orElseGet(() -> userRepository.findByEmail(twoFactorDto.getUsername())
                            .orElseThrow(() -> new RuntimeException("User not found")));

            
            TwoFactorCodeInfo codeInfo = twofactorCodes.get(user.getEmail());

            
            if (codeInfo == null || 
                codeInfo.isExpired() || 
                !codeInfo.code.equals(twoFactorDto.getCode())) {
                return false;
            }

            
            twofactorCodes.remove(user.getEmail());

            return true;
        } catch (Exception e) {
            logger.error("Error verifying 2FA code", e);
            return false;
        }
    }


    public User signUp(User newUser) {
        try {
            
            if (userRepository.existsByUsername(newUser.getUsername())) {
                logger.warn("Username already taken: {}", newUser.getUsername());
                throw new RuntimeException("Username is already taken");
            }

           
            if (userRepository.existsByEmail(newUser.getEmail())) {
                logger.warn("Email already in use: {}", newUser.getEmail());
                throw new RuntimeException("Email is already in use");
            }

            
            newUser.setPassword(hashPassword(newUser.getPassword()));

          
            User savedUser = userRepository.save(newUser);
            logger.info("User signed up successfully: {}", savedUser.getUsername());
            return savedUser;
        } catch (Exception e) {
            logger.error("Signup error", e);
            throw e;
        }
    }
    
        private static class ResetCodeInfo {
        String code;
        LocalDateTime expirationTime;

        ResetCodeInfo(String code) {
            this.code = code;
            this.expirationTime = LocalDateTime.now().plusMinutes(15); 
        }

        boolean isExpired() {
            return LocalDateTime.now().isAfter(expirationTime);
        }
    }

    public void initiatePasswordReset(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
    
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Email not found");
        }

      
        String resetCode = String.format("%06d", new Random().nextInt(999999));
    
        
        resetCodes.put(email, new ResetCodeInfo(resetCode));

       
        sendResetCodeEmail(email, resetCode);
    }

private void sendResetCodeEmail(String to, String resetCode) {
    SimpleMailMessage message = new SimpleMailMessage(); 
    message.setFrom("your-email@example.com");
    message.setTo(to);
    message.setSubject("Password Reset Code");
    message.setText("Your password reset code is: " + resetCode);
    
    mailSender.send(message);
}


public boolean resetPassword(PasswordResetDto resetDto) {
    ResetCodeInfo resetCodeInfo = resetCodes.get(resetDto.getEmail());

    if (resetCodeInfo == null || 
        resetCodeInfo.isExpired() || 
        !resetCodeInfo.code.equals(resetDto.getResetCode())) {
        return false;
    }

    Optional<User> userOptional = userRepository.findByEmail(resetDto.getEmail());

    if (userOptional.isEmpty()) {
        return false;
    }

    User user = userOptional.get();
    user.setPassword(hashPassword(resetDto.getNewPassword()));
    userRepository.save(user);

    // Remove used reset code
    resetCodes.remove(resetDto.getEmail());

    return true;
}
    
}