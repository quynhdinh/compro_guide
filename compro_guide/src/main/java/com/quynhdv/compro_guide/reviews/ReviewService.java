package com.quynhdv.compro_guide.reviews;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import java.util.List;

@Service
@AllArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }
    public List<Review> getReviewsByCourseId(String courseId) {
        return reviewRepository.findAll().stream()
                .filter(review -> review.getCourseId().equals(courseId))
                .toList();
    }
    public Review createReview(Review review) {
        return reviewRepository.save(review);
    }
}
