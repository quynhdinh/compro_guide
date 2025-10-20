package com.quynhdv.compro_guide.blogs;

import jakarta.persistence.Entity;
import lombok.Data;
import jakarta.persistence.Table;
@Entity
@Table(name = "blogs")
@Data
public class Blog {
    @jakarta.persistence.Id
    @jakarta.persistence.GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long blogId;
    @jakarta.persistence.Column(name = "title", nullable = false)
    private String title;
    @jakarta.persistence.Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;
}
