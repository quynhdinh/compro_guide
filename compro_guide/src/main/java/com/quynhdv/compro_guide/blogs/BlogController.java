package com.quynhdv.compro_guide.blogs;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

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
    @PostMapping
    public Blog createBlog(@RequestBody BlogDTO blog) {
        var b = new Blog();
        b.setTitle(blog.title());
        b.setContent(blog.content());
        b.setTags(blog.tags());
        b.setCreated((int)(System.currentTimeMillis() / 1000L));
        return blogService.createBlog(b);
    }
}
record BlogDTO(
    String title,
    String content,
    String tags
) {}
