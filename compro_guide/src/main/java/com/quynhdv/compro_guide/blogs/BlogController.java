package com.quynhdv.compro_guide.blogs;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.*;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {
    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    // rewrite get all blogs endpoint here
    @GetMapping
    public List<Blog> getAllBlogs() {
        return blogService.getAllBlogs();
    }
}
