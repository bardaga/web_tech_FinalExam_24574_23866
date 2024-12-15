package com.smartstudenttracker.smart_student_tracker.controller;

import com.smartstudenttracker.smart_student_tracker.entity.Course;
import com.smartstudenttracker.smart_student_tracker.repository.CourseRepository;
import com.smartstudenttracker.smart_student_tracker.entity.Class;
import com.smartstudenttracker.smart_student_tracker.repository.ClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ClassRepository classRepository;

    
    @PostMapping
    public ResponseEntity<Course> addNewCourse(@RequestBody Course course) {
        Class classLevel = classRepository.findById(course.getClassLevel().getId())
                .orElseThrow(() -> new RuntimeException("Class not found"));
        course.setClassLevel(classLevel);
        return ResponseEntity.ok(courseRepository.save(course));
    }

   
    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

   
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return courseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }
}
