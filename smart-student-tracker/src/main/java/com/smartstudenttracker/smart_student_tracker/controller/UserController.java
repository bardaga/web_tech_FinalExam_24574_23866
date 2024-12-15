package com.smartstudenttracker.smart_student_tracker.controller;

import com.smartstudenttracker.smart_student_tracker.entity.User;
import com.smartstudenttracker.smart_student_tracker.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/role")
    public ResponseEntity<String> getUserRoleByEmail(@RequestParam String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            String role = userOptional.get().getRoles();
            return ResponseEntity.ok(role);
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }
}
