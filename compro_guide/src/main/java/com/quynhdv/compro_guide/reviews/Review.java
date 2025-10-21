package com.quynhdv.compro_guide.reviews;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "reviews")
public class Review {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long reviewId;
	// Foreign key to Course entity
	@Column(name = "course_id", nullable = false) 
	private String courseId;
	@Column(name = "reviewer_name", nullable = false)
	private String reviewerName;
	@Column(name = "comment", nullable = false, length = 1000)
	private String comment;
	@Column(name = "rating", nullable = false)
	private Integer rating;
	@Column(name = "date_taken", nullable = true)
	private Integer dateTaken;
	@Column(name = "difficulty", nullable = false)
	private Integer difficulty;
	@Column(name = "workload", nullable = false)
	private Integer workload;
	@Column(name = "created", nullable = false)
	private Integer created;
}
