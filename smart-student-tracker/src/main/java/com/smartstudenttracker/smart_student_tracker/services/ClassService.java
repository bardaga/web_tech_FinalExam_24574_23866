package com.smartstudenttracker.smart_student_tracker.services;

import com.smartstudenttracker.smart_student_tracker.dto.ClassDTO;
import com.smartstudenttracker.smart_student_tracker.entity.Class;
import com.smartstudenttracker.smart_student_tracker.repository.ClassRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ClassService {
    
    private final ClassRepository classRepository;

    public ClassService(ClassRepository classRepository) {
        this.classRepository = classRepository;
    }

    public List<Class> getAllClasses() {
        return classRepository.findAll();
    }

    public Optional<Class> getClassById(Long id) {
        return classRepository.findById(id);
    }

    @Transactional
    public Class addClass(Class classObj) {
        return classRepository.save(classObj);
    }

    @Transactional
    public void deleteClass(Long id) {
        if (classRepository.existsById(id)) {
            classRepository.deleteById(id);
        } else {
            throw new RuntimeException("Class not found with id: " + id);
        }
    }

    @Transactional
    public Class updateClass(Long id, Class classDetails) {
        Class existingClass = classRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Class not found with id: " + id));
        
        existingClass.setClassName(classDetails.getClassName());
        existingClass.setSubject(classDetails.getSubject());
        existingClass.setTeacherName(classDetails.getTeacherName());
        existingClass.setDescription(classDetails.getDescription());

        return classRepository.save(existingClass);
    }
    public Long getTotalClassCount() {
        return classRepository.countTotalClasses();
    }
}