package com.quynhdv.compro_guide.courses;

import java.util.List;
import org.springframework.stereotype.Service;

import com.quynhdv.compro_guide.courses.dto.CourseDTO;
import com.quynhdv.compro_guide.reviews.ReviewRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;
    private final ReviewRepository reviewRepository;

    public List<CourseDTO> getAllCourses() {
        var courses = courseRepository.findAll();
        return courses.stream().map(course -> {
            String courseId = course.getCourseId();
            long reviewCount = reviewRepository.countByCourseId(courseId);
            
            // Get aggregates, defaulting to 0 if no reviews exist
            long totalRating = reviewRepository.sumRatingByCourseId(courseId) != null ? 
                             reviewRepository.sumRatingByCourseId(courseId) : 0L;
            long totalDifficulty = reviewRepository.sumDifficultyByCourseId(courseId) != null ?
                                 reviewRepository.sumDifficultyByCourseId(courseId) : 0L;
            long totalWorkload = reviewRepository.sumWorkloadByCourseId(courseId) != null ?
                               reviewRepository.sumWorkloadByCourseId(courseId) : 0L;

            var newCourseDTO = new CourseDTO(
                    course.getCourseId(),
                    course.getTitle(),
                    course.getDescription(),
                    reviewCount,
                    reviewCount > 0 ? (float) totalRating / reviewCount : null,
                    reviewCount > 0 ? (float) totalDifficulty / reviewCount : null,
                    reviewCount > 0 ? (float) totalWorkload / reviewCount : null);
            return newCourseDTO;
        }).toList();
    }
}
