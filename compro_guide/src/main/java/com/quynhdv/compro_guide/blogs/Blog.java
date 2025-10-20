package com.quynhdv.compro_guide.blogs;

import jakarta.persistence.Entity;
import lombok.Data;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
@Entity
@Table(name = "blogs")
@Data
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long blogId;
    @Column(name = "title", nullable = false)
    private String title;
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;
    @Column(name = "tags", nullable = false)
    private String tags;
	@Column(name = "created", nullable = false)
	private Integer created;
}
