package com.smartstudenttracker.smart_student_tracker.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private Long totalStudents;
    private Long allClasses;
    private Long coursesOffered;
    private String recentActivities;
}