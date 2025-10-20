package com.quynhdv.compro_guide.courses;
import org.springframework.web.bind.annotation.RestController;

import com.quynhdv.compro_guide.courses.dto.CourseSummary;

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

    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }
}
