package com.smartstudenttracker.smart_student_tracker.dto;

import lombok.Data;

@Data
public class GlobalSearchDTO {
    private String type;  // "STUDENT", "CLASS"
    private String id;
    private String name;
    private String additionalInfo;
}