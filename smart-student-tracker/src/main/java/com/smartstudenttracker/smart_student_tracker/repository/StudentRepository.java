package com.smartstudenttracker.smart_student_tracker.repository;

import com.smartstudenttracker.smart_student_tracker.entity.Class;
import com.smartstudenttracker.smart_student_tracker.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    
    List<Student> findByStudentClass(Class studentClass);

    @Query("SELECT COUNT(s) FROM Student s")
    Long countTotalStudents();

    
    boolean existsByEmail(String email);

   
    @Query("SELECT COUNT(s) FROM Student s WHERE s.studentClass.id = :classId")
    Long countByStudentClassId(@Param("classId") Long classId);

    Optional<Student> findByEmailIgnoreCase(String email);
}
