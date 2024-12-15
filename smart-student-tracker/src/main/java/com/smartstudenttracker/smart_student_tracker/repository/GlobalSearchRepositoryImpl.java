package com.smartstudenttracker.smart_student_tracker.repository;

import com.smartstudenttracker.smart_student_tracker.dto.GlobalSearchDTO;
import com.smartstudenttracker.smart_student_tracker.entity.Student;
import com.smartstudenttracker.smart_student_tracker.entity.Class;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class GlobalSearchRepositoryImpl implements GlobalSearchRepository {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ClassRepository classRepository;

    @Override
    public List<GlobalSearchDTO> performGlobalSearch(String query, List<String> types) {
        List<GlobalSearchDTO> results = new ArrayList<>();

        // Search Students
        if (types == null || types.contains("STUDENT")) {
            // Search by first name, last name, or email
            List<Student> students = studentRepository.findAll().stream()
                .filter(s -> 
                    s.getFirstName().toLowerCase().contains(query.toLowerCase()) ||
                    s.getLastName().toLowerCase().contains(query.toLowerCase()) ||
                    s.getEmail().toLowerCase().contains(query.toLowerCase())
                )
                .collect(Collectors.toList());

            results.addAll(students.stream()
                .map(s -> createSearchDTO("STUDENT", 
                    s.getId().toString(), 
                    s.getFirstName() + " " + s.getLastName(), 
                    "Email: " + s.getEmail() + 
                    (s.getStudentClass() != null ? ", Class: " + s.getStudentClass().getClassName() : "")))
                .collect(Collectors.toList()));
        }

        // Search Classes
        if (types == null || types.contains("CLASS")) {
            // Search by class name, subject, or teacher name
            List<Class> classes = classRepository.findAll().stream()
                .filter(c -> 
                    c.getClassName().toLowerCase().contains(query.toLowerCase()) ||
                    c.getSubject().toLowerCase().contains(query.toLowerCase()) ||
                    c.getTeacherName().toLowerCase().contains(query.toLowerCase())
                )
                .collect(Collectors.toList());

            results.addAll(classes.stream()
                .map(c -> {
                    // Retrieve the count of students in this class
                    long studentCount = studentRepository.countByStudentClassId(c.getId());

                    return createSearchDTO("CLASS", 
                        c.getId().toString(), 
                        c.getClassName(), 
                        "Subject: " + c.getSubject() + 
                        ", Teacher: " + c.getTeacherName() + 
                        ", Students: " + studentCount);
                })
                .collect(Collectors.toList()));
        }

        return results;
    }

    private GlobalSearchDTO createSearchDTO(String type, String id, String name, String additionalInfo) {
        GlobalSearchDTO dto = new GlobalSearchDTO();
        dto.setType(type);
        dto.setId(id);
        dto.setName(name);
        dto.setAdditionalInfo(additionalInfo);
        return dto;
    }
}
