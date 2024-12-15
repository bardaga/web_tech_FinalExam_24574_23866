package com.smartstudenttracker.smart_student_tracker.services;


import com.smartstudenttracker.smart_student_tracker.dto.DashboardStatsDTO;
import com.smartstudenttracker.smart_student_tracker.repository.StudentRepository;
import com.smartstudenttracker.smart_student_tracker.repository.ClassRepository;
import com.smartstudenttracker.smart_student_tracker.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private CourseRepository courseRepository;

    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        
        stats.setTotalStudents(studentRepository.countTotalStudents());
        stats.setAllClasses(classRepository.countTotalClasses());
        stats.setCoursesOffered(courseRepository.countTotalCourses());
        stats.setRecentActivities("Recent system updates and activities");
        
        return stats;
    }
}
