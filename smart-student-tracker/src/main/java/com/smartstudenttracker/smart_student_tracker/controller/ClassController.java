package com.smartstudenttracker.smart_student_tracker.controller;

import com.smartstudenttracker.smart_student_tracker.dto.ClassDTO;
import com.smartstudenttracker.smart_student_tracker.entity.Class;
import com.smartstudenttracker.smart_student_tracker.services.ClassService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class ClassController {
    
    private final ClassService classService;

    public ClassController(ClassService classService) {
        this.classService = classService;
    }
    

    @GetMapping
    public ResponseEntity<List<Class>> getAllClasses() {
        List<Class> classes = classService.getAllClasses();
        return ResponseEntity.ok(classes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Class> getClassById(@PathVariable Long id) {
        return classService.getClassById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Class> addClass(@RequestBody Class classObj) {
        Class newClass = classService.addClass(classObj);
        return ResponseEntity.status(HttpStatus.CREATED).body(newClass);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Class> updateClass(@PathVariable Long id, @RequestBody Class classDetails) {
        Class updatedClass = classService.updateClass(id, classDetails);
        return ResponseEntity.ok(updatedClass);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClass(@PathVariable Long id) {
        classService.deleteClass(id);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalClassCount() {
        Long totalClasses = classService.getTotalClassCount();
        return ResponseEntity.ok(totalClasses);
    }
}