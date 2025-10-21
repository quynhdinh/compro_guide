package com.quynhdv.compro_guide.reviews;

public record ReviewDTO(
    String courseId,
    String reviewerName,
    String comment,
    Integer date_taken,
    int rating,
    int difficulty,
    int workload
) {}

