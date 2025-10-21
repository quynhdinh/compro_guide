package com.quynhdv.compro_guide.courses;
import org.springframework.web.bind.annotation.RestController;

import com.quynhdv.compro_guide.courses.dto.CourseDTO;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@AllArgsConstructor
public class CourseController {
    private final CourseService courseService;

    @GetMapping
    public List<CourseDTO> getAllCourses() {
        return courseService.getAllCourses();
    }

}