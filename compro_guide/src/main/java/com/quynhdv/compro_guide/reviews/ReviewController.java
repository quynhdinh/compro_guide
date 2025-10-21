package com.quynhdv.compro_guide.reviews;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/reviews")
@CrossOrigin
public class ReviewController {
    private final ReviewService reviewService;

    @GetMapping
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

    @GetMapping("/{courseId}")
    public List<Review> getReviewsByCourseId(@PathVariable String courseId) {
        return reviewService.getReviewsByCourseId(courseId);
    }

    @PostMapping
    public Review createReview(@RequestBody ReviewDTO review) {
        var r = new Review();
        r.setCourseId(review.courseId());
        r.setReviewerName(review.reviewerName());
        r.setComment(review.comment());
        r.setRating(review.rating());
        r.setDifficulty(review.difficulty());
        r.setWorkload(review.workload());
        r.setCreated((int)(System.currentTimeMillis() / 1000L));
        return reviewService.createReview(r);
    }
}
record ReviewDTO(
    String courseId,
    String reviewerName,
    String comment,
    int rating,
    int difficulty,
    int workload
) {}
