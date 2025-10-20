package com.quynhdv.compro_guide.reviews;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    // count reviews by courseId
    @Query("SELECT COUNT(r) FROM Review r WHERE r.courseId = :courseId")
    long countByCourseId(String courseId);
    
    // count total rating for a courseId    
    @Query("SELECT SUM(r.rating) FROM Review r WHERE r.courseId = :courseId")
    Long sumRatingByCourseId(String courseId);
    
    // count total difficulty for a courseId
    @Query("SELECT SUM(r.difficulty) FROM Review r WHERE r.courseId = :courseId")
    Long sumDifficultyByCourseId(String courseId);
    
    // count total workload for a courseId
    @Query("SELECT SUM(r.workload) FROM Review r WHERE r.courseId = :courseId")
    Long sumWorkloadByCourseId(String courseId);
}