package com.smartstudenttracker.smart_student_tracker.controller;

import com.smartstudenttracker.smart_student_tracker.dto.GlobalSearchDTO;
import com.smartstudenttracker.smart_student_tracker.repository.GlobalSearchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/global-search")
public class GlobalSearchController {

    @Autowired
    private GlobalSearchRepository globalSearchRepository;

    @GetMapping
    public ResponseEntity<List<GlobalSearchDTO>> globalSearch(
        @RequestParam String query, 
        @RequestParam(required = false) List<String> types
    ) {
        List<GlobalSearchDTO> results = globalSearchRepository.performGlobalSearch(query, types);
        return ResponseEntity.ok(results);
    }
}