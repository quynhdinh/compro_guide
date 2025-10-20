package com.quynhdv.compro_guide.blogs;


import java.util.List;
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
}
