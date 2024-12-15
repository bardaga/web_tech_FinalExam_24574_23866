package com.smartstudenttracker.smart_student_tracker.services;

import dev.samstevens.totp.code.*;
import dev.samstevens.totp.exceptions.QrGenerationException;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;
import org.springframework.stereotype.Service;

import java.util.Base64;

@Service
public class TwoFactorService {

    public String generateSecretKey() {
        SecretGenerator secretGenerator = new DefaultSecretGenerator();
        return secretGenerator.generate();
    }

    public String generateQrCodeImageBase64(String username, String secretKey) throws QrGenerationException {
        QrData data = new QrData.Builder()
                .label(username)
                .secret(secretKey)
                .issuer("SmartStudentTracker")
                .algorithm(HashingAlgorithm.SHA1)
                .digits(6)
                .period(30)
                .build();

        QrGenerator generator = new ZxingPngQrGenerator();
        byte[] qrCodeImage = generator.generate(data);
        
        return Base64.getEncoder().encodeToString(qrCodeImage);
    }

    public boolean verifyTwoFactorCode(String secret, String code) {
        TimeProvider timeProvider = new SystemTimeProvider();
        CodeGenerator codeGenerator = new DefaultCodeGenerator();
        CodeVerifier verifier = new DefaultCodeVerifier(codeGenerator, timeProvider);
        
        return verifier.isValidCode(secret, code);
    }
}