// Attendance Repository
package com.smartstudenttracker.smart_student_tracker.repository;

import com.smartstudenttracker.smart_student_tracker.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
}