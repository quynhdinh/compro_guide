package com.quynhdv.compro_guide.blogs;


import java.util.*;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class BlogService {
    private final BlogRepository blogRepository;
    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }
    public Blog createBlog(Blog blog) {
        return blogRepository.save(blog);
    }
    public Map<String, Integer> getAllTags() {
        return blogRepository.findAll().stream()
                .map(Blog::getTags)
                .flatMap(tags -> List.of(tags.split(",")).stream())
                .map(String::trim)
                .collect(HashMap<String, Integer>::new,
                        (map, tag) -> map.put(tag, map.getOrDefault(tag, 0) + 1),
                        HashMap::putAll);
    }
}
