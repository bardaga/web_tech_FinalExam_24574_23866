
package com.smartstudenttracker.smart_student_tracker.repository;

import com.smartstudenttracker.smart_student_tracker.dto.ClassDTO;
import com.smartstudenttracker.smart_student_tracker.entity.Class;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassRepository extends JpaRepository<Class, Long> {
    // Existing method to find class by name
    Class findByClassName(String className);

    // New method to count total classes
    @Query("SELECT COUNT(c) FROM Class c")
    Long countTotalClasses();

   
}