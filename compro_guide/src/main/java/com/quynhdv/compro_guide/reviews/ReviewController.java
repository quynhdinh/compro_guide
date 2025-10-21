package com.quynhdv.compro_guide.reviews;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.quynhdv.compro_guide.chatbot.AIService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/reviews")
@CrossOrigin
@Slf4j
public class ReviewController {
    private final ReviewService reviewService;
    private final AIService aiService;

    @GetMapping
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

    @GetMapping("/{courseId}")
    public List<Review> getReviewsByCourseId(@PathVariable String courseId) {
        return reviewService.getReviewsByCourseId(courseId);
    }

    @PostMapping
    public Optional<Review> createReview(@RequestBody ReviewDTO review) {
        var r = new Review();
        r.setCourseId(review.courseId());
        r.setReviewerName(review.reviewerName());
        r.setComment(review.comment());
        r.setRating(review.rating());
        r.setDifficulty(review.difficulty());
        r.setWorkload(review.workload());
        r.setDateTaken(review.date_taken());
        r.setCreated((int)(System.currentTimeMillis() / 1000L));
        String verdict = aiService.analyzeSentiment(review.comment());
        if(verdict.equals("negative")){
            log.info("Reject with verdict " + verdict);
            return Optional.empty();
        }
        log.info("Passed " + review.comment() + " with sentiment " + verdict);
        return Optional.ofNullable(reviewService.createReview(r));

    }
}