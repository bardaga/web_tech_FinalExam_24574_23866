package com.smartstudenttracker.smart_student_tracker.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CustomErrorController implements ErrorController {

    @GetMapping("/error")
    public String handleError(HttpServletRequest request, Model model) {
        
        Object status = request.getAttribute("jakarta.servlet.error.status_code");
        Object message = request.getAttribute("jakarta.servlet.error.message");
        Object exception = request.getAttribute("jakarta.servlet.error.exception");

       
        if (status != null) {
            model.addAttribute("statusCode", status.toString());
        }
        if (message != null) {
            model.addAttribute("errorMessage", message.toString());
        }
        if (exception != null) {
            model.addAttribute("exception", exception.toString());
        }

        return "error"; 
    }
}