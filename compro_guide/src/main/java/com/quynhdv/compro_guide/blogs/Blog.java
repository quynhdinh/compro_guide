package com.quynhdv.compro_guide.blogs;

import jakarta.persistence.Entity;
import lombok.Data;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import java.util.HashMap;
import java.util.Map;
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
    // ignore content field in toMap
    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("blogId", blogId);
        map.put("title", title);
        // map.put("content", content);
        map.put("tags", tags);
        map.put("created", created);
        return map;
    }
}
