package com.smartstudenttracker.smart_student_tracker.controller;

import com.smartstudenttracker.smart_student_tracker.entity.Attendance;
import com.smartstudenttracker.smart_student_tracker.entity.Course;
import com.smartstudenttracker.smart_student_tracker.entity.Student;
import com.smartstudenttracker.smart_student_tracker.repository.AttendanceRepository;
import com.smartstudenttracker.smart_student_tracker.repository.CourseRepository;
import com.smartstudenttracker.smart_student_tracker.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    
    @PostMapping
    public ResponseEntity<Attendance> addAttendance(@RequestBody Attendance attendance) {
       
        Student student = studentRepository.findById(attendance.getStudent().getId())
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + attendance.getStudent().getId()));
        
        
        Course course = courseRepository.findById(attendance.getCourse().getId())
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + attendance.getCourse().getId()));

       
        attendance.setStudent(student);
        attendance.setCourse(course);
        attendance.setAttendanceDate(new Date());

        
        Attendance savedAttendance = attendanceRepository.save(attendance);
        return ResponseEntity.ok(savedAttendance);
    }

   
    @GetMapping
public List<Attendance> getAllAttendance() {
    return attendanceRepository.findAll();
}
}
