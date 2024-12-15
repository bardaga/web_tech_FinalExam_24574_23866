// Course Entity
package com.smartstudenttracker.smart_student_tracker.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String courseName;

    @Column(nullable = false)
    private String teacherName;

    @ManyToOne
    @JoinColumn(name = "class_id", nullable = false)
    private Class classLevel;

    // Constructors
    public Course() {}

    public Course(String courseName, String teacherName, Class classLevel) {
        this.courseName = courseName;
        this.teacherName = teacherName;
        this.classLevel = classLevel;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public Class getClassLevel() {
        return classLevel;
    }

    public void setClassLevel(Class classLevel) {
        this.classLevel = classLevel;
    }
}