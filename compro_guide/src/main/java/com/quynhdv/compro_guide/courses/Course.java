package com.quynhdv.compro_guide.courses;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Table(name = "courses")
@Entity
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "course_id", nullable = false, unique = true)
	private String courseId;
    @Column(name = "title", nullable = false)
	private String title;
     // 500 characters
    @Column(name = "description", nullable = false, length = 500)
	private String description;
    // credit
    @Column(name = "credits", nullable = false)
    private Integer credits;
}
