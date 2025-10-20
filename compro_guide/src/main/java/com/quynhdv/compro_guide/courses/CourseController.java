package com.quynhdv.compro_guide.courses;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.*;


@RestController
@RequestMapping("/api/courses")
public class CourseController {
    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // rewrite get all courses endpoint here
    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }
}
