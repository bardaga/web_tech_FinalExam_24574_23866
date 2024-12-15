// package com.smartstudenttracker.smart_student_tracker.services;

// import java.time.LocalDateTime;
// import java.util.Random;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.mail.SimpleMailMessage;
// import org.springframework.mail.javamail.JavaMailSender;
// import org.springframework.stereotype.Service;

// import com.smartstudenttracker.smart_student_tracker.entity.User;
// import com.smartstudenttracker.smart_student_tracker.repository.UserRepository;

// @Service
// public class TwoFactorAuthenticationService {
//     private static final int VERIFICATION_CODE_LENGTH = 6;
//     private static final int VERIFICATION_CODE_EXPIRATION_MINUTES = 10;

//     @Autowired
//     private UserRepository userRepository;

//     @Autowired
//     private JavaMailSender mailSender;

//     public String generateVerificationCode() {
//         return String.format("%06d", new Random().nextInt(999999));
//     }

//     public void sendVerificationCode(User user) {
//         String verificationCode = generateVerificationCode();
        
//         user.setTwoFactorVerificationCode(verificationCode);
//         user.setTwoFactorCodeExpiration(LocalDateTime.now().plusMinutes(VERIFICATION_CODE_EXPIRATION_MINUTES));
//         userRepository.save(user);

//         sendEmailVerificationCode(user.getEmail(), verificationCode);
//     }

//     private void sendEmailVerificationCode(String email, String code) {
//         SimpleMailMessage message = new SimpleMailMessage();
//         message.setTo(email);
//         message.setSubject("Your Two-Factor Authentication Code");
//         message.setText("Your verification code is: " + code + 
//                         "\nThis code will expire in " + VERIFICATION_CODE_EXPIRATION_MINUTES + " minutes.");
        
//         mailSender.send(message);
//     }

//     public boolean verifyCode(User user, String inputCode) {
//         // Check if code matches and is not expired
//         return user.getTwoFactorVerificationCode() != null &&
//                user.getTwoFactorVerificationCode().equals(inputCode) &&
//                user.getTwoFactorCodeExpiration() != null &&
//                user.getTwoFactorCodeExpiration().isAfter(LocalDateTime.now());
//     }

//     public void clearVerificationCode(User user) {
//         user.setTwoFactorVerificationCode(null);
//         user.setTwoFactorCodeExpiration(null);
//         userRepository.save(user);
//     }
// }