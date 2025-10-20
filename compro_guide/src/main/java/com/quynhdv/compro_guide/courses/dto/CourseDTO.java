package com.quynhdv.compro_guide.courses.dto;

public record CourseDTO(
    String courseId,
    String title,
    String description,
    long reviewCount,
    Float averageRating,
    Float averageDifficulty,
    Float averageWorkload
) {}
