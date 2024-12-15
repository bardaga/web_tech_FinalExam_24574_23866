package com.smartstudenttracker.smart_student_tracker.controller;

import com.smartstudenttracker.smart_student_tracker.entity.User;
import com.smartstudenttracker.smart_student_tracker.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class HomeController {

    @Autowired
    private UserService userService;

    @GetMapping("/")
    public String home() {
        return "index";
    }

    @PostMapping("/signup")
    public String signup(@RequestParam String username, 
                         @RequestParam String email, 
                         @RequestParam String password,
                         RedirectAttributes redirectAttributes) {
        try {
            User newUser = new User(username, email, password);
            userService.registerNewUser(newUser);
            redirectAttributes.addFlashAttribute("successMessage", "Account created successfully!");
            return "redirect:/";
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
            return "redirect:/";
        }
    }

    @PostMapping("/login")
    public String login(@RequestParam String username, 
                        @RequestParam String password,
                        RedirectAttributes redirectAttributes) {
        if (userService.authenticateUser(username, password)) {
            
            redirectAttributes.addFlashAttribute("successMessage", "Login successful!");
            return "redirect:/dashboard"; 
        } else {
            redirectAttributes.addFlashAttribute("errorMessage", "Invalid username or password");
            return "redirect:/";
        }
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        model.addAttribute("welcomeMessage", "Welcome to your dashboard!");
        return "dashboard"; 
    }
    

    @GetMapping("/login")
    public String loginPage() {
    return "login"; 
}

}