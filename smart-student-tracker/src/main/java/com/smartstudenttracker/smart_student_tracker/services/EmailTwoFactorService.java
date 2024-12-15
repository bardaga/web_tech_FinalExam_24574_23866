package com.smartstudenttracker.smart_student_tracker.services;

import com.smartstudenttracker.smart_student_tracker.dto.TwoFactorDto;
import com.smartstudenttracker.smart_student_tracker.entity.User;
import com.smartstudenttracker.smart_student_tracker.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class EmailTwoFactorService {
    private static final Logger logger = LoggerFactory.getLogger(EmailTwoFactorService.class);
    private static final int CODE_LENGTH = 6;
    private static final long CODE_EXPIRATION_MINUTES = 15;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserRepository userRepository;

    
    private Map<String, TwoFactorCodeInfo> twofactorCodes = new ConcurrentHashMap<>();

   
    private static class TwoFactorCodeInfo {
        String code;
        LocalDateTime expirationTime;

        TwoFactorCodeInfo(String code) {
            this.code = code;
            this.expirationTime = LocalDateTime.now().plusMinutes(CODE_EXPIRATION_MINUTES);
        }

        boolean isExpired() {
            return LocalDateTime.now().isAfter(expirationTime);
        }
    }

    /**
     * Generate and send 2FA code via email
     * @param username 
     * @return 
     */
    public boolean generateAndSendTwoFactorCode(String username) {
        try {
           
            User user = userRepository.findByUsername(username)
                    .orElseGet(() -> userRepository.findByEmail(username)
                            .orElseThrow(() -> new RuntimeException("User not found")));

            
            String twoFactorCode = String.format("%06d", new Random().nextInt(999999));

            
            twofactorCodes.put(user.getEmail(), new TwoFactorCodeInfo(twoFactorCode));

            
            sendTwoFactorCodeEmail(user.getEmail(), twoFactorCode);

            return true;
        } catch (Exception e) {
            logger.error("Error generating 2FA code", e);
            return false;
        }
    }

    /**
     * Verify the 2FA code
     * @param twoFactorDto 
     * @return 
     */
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

    /**
     * Send 2FA code via email
     * @param to Recipient email
     * @param twoFactorCode Generated 2FA code
     */
    private void sendTwoFactorCodeEmail(String to, String twoFactorCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage(); 
            message.setFrom("noreply@smartstudenttracker.com");
            message.setTo(to);
            message.setSubject("Your Two-Factor Authentication Code");
            message.setText("Your two-factor authentication code is: " + twoFactorCode + 
                            "\n\nThis code will expire in " + CODE_EXPIRATION_MINUTES + " minutes.");
            
            mailSender.send(message);
            
            logger.info("2FA code sent to email: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send 2FA email", e);
        }
    }
}