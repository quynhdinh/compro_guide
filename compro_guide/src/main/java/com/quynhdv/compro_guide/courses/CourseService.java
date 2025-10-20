package com.quynhdv.compro_guide.courses;

import java.util.List;
import org.springframework.stereotype.Service;

import com.quynhdv.compro_guide.courses.dto.CourseSummary;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
}
