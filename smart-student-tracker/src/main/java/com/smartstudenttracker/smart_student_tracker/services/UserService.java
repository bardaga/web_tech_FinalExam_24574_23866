package com.smartstudenttracker.smart_student_tracker.services;

import com.smartstudenttracker.smart_student_tracker.entity.User;
import com.smartstudenttracker.smart_student_tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

   
    private String hashPassword(String password) {
       
        return String.valueOf(password.hashCode());
    }

    public User registerNewUser(User user) {
       
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        user.setRoles("student");
       
        user.setPassword(hashPassword(user.getPassword()));
        return userRepository.save(user);


    }

    public boolean authenticateUser(String username, String password) {
        return userRepository.findByUsername(username)
                .map(user -> user.getPassword().equals(hashPassword(password)))
                .orElse(false);
    }
}