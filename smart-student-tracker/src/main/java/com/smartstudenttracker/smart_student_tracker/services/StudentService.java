package com.smartstudenttracker.smart_student_tracker.services;

import com.smartstudenttracker.smart_student_tracker.entity.Class;
import com.smartstudenttracker.smart_student_tracker.entity.Student;
import com.smartstudenttracker.smart_student_tracker.repository.ClassRepository;
import com.smartstudenttracker.smart_student_tracker.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class StudentService {
    
    private final StudentRepository studentRepository;
    private final ClassRepository classRepository;

    public StudentService(StudentRepository studentRepository, ClassRepository classRepository) {
        this.studentRepository = studentRepository;
        this.classRepository = classRepository;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Transactional
    public Student addStudent(Student student) {
        
        if (student.getStudentClass() != null && student.getStudentClass().getId() != null) {
            Class existingClass = classRepository.findById(student.getStudentClass().getId())
                .orElseThrow(() -> new RuntimeException("Class not found"));
            student.setStudentClass(existingClass);
        }
        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        return studentRepository.save(student);
    }

    @Transactional
    public void deleteStudent(Long id) {
        if (studentRepository.existsById(id)) {
            studentRepository.deleteById(id);
        } else {
            throw new RuntimeException("Student not found with id: " + id);
        }
    }

    @Transactional
    public Student updateStudent(Long id, Student studentDetails) {
        Student existingStudent = studentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
        
        existingStudent.setFirstName(studentDetails.getFirstName());
        existingStudent.setLastName(studentDetails.getLastName());
        existingStudent.setEmail(studentDetails.getEmail());

        // Handle class association
        if (studentDetails.getStudentClass() != null && studentDetails.getStudentClass().getId() != null) {
            Class existingClass = classRepository.findById(studentDetails.getStudentClass().getId())
                .orElseThrow(() -> new RuntimeException("Class not found"));
            existingStudent.setStudentClass(existingClass);
        } else {
            existingStudent.setStudentClass(null);
        }

        return studentRepository.save(existingStudent);
    }
    @Transactional(readOnly = true)
    public Optional<Student> findStudentByEmail(String email) {
    if (email == null || email.trim().isEmpty()) {
        throw new IllegalArgumentException("Email cannot be null or empty");
    }
    return studentRepository.findByEmailIgnoreCase(email.trim().toLowerCase());
}


    public List<Student> getStudentsByClass(Long classId) {
        Class existingClass = classRepository.findById(classId)
            .orElseThrow(() -> new RuntimeException("Class not found"));
        return studentRepository.findByStudentClass(existingClass);
    }

   
}