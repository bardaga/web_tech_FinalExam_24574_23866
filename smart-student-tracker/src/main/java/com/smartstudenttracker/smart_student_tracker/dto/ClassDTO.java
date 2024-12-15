package com.smartstudenttracker.smart_student_tracker.dto;

public class ClassDTO {
    private Long id;
    private String className;
    private String subject;
    private String teacherName;
    private String description;
    private Long studentCount;

    // Constructor
    public ClassDTO(Long id, String className, String subject, String teacherName, String description, Long studentCount) {
        this.id = id;
        this.className = className;
        this.subject = subject;
        this.teacherName = teacherName;
        this.description = description;
        this.studentCount = studentCount;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getTeacherName() { return teacherName; }
    public void setTeacherName(String teacherName) { this.teacherName = teacherName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getStudentCount() { return studentCount; }
    public void setStudentCount(Long studentCount) { this.studentCount = studentCount; }
}
