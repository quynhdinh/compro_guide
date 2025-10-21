package com.quynhdv.compro_guide.config;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import com.quynhdv.compro_guide.blogs.Blog;
import com.quynhdv.compro_guide.blogs.BlogRepository;
import com.quynhdv.compro_guide.courses.Course;
import com.quynhdv.compro_guide.courses.CourseRepository;
import com.quynhdv.compro_guide.reviews.Review;
import com.quynhdv.compro_guide.reviews.ReviewRepository;

import lombok.extern.slf4j.Slf4j;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Configuration("csvDataLoader")
@Slf4j
public class CsvDataLoader {

    @Bean
    CommandLineRunner initDatabase(CourseRepository courseRepository,
                                 ReviewRepository reviewRepository,
                                 BlogRepository blogRepository) {
        log.info("CsvDataLoader running!");
        return args -> {
            if (courseRepository.count() == 0) {
                loadCourses(courseRepository);
            }
            if (reviewRepository.count() == 0) {
                loadReviews(reviewRepository);
            }
            if (blogRepository.count() == 0) {
                loadBlogs(blogRepository);
            }
        };
    }

    private void loadCourses(CourseRepository repository) throws IOException, CsvValidationException {
        var resource = new ClassPathResource("courses.csv");
        try (var reader = new CSVReader(new InputStreamReader(resource.getInputStream()))) {
            String[] header = reader.readNext(); // skip header
            String[] line;
            List<Course> courses = new ArrayList<>();
            
            while ((line = reader.readNext()) != null) {
                Course course = new Course();
                log.info(line[0]);
                log.info(line[1]);
                log.info(line[2]);
                log.info(line[3]);
                course.setCourseId(line[0]);      // course_id
                course.setTitle(line[1]);         // title
                course.setDescription(line[2]);   // description
                course.setCredits(Integer.parseInt(line[3])); // credits
                courses.add(course);
            }
            repository.saveAll(courses);
        }
    }

    private void loadReviews(ReviewRepository repository) throws IOException, CsvValidationException {
        var resource = new ClassPathResource("reviews.csv");
        try (var reader = new CSVReader(new InputStreamReader(resource.getInputStream()))) {
            String[] header = reader.readNext(); // skip header
            String[] line;
            List<Review> reviews = new ArrayList<>();
            while ((line = reader.readNext()) != null) {
                Review review = new Review();
                review.setCourseId(line[0]);           // course_id
                review.setReviewerName(line[1]);       // reviewer_name
                review.setComment(line[2]);            // comment
                review.setRating(Integer.parseInt(line[3]));        // rating
                review.setDifficulty(Integer.parseInt(line[4]));    // difficulty
                review.setWorkload(Integer.parseInt(line[5]));      // workload
                review.setDateTaken(Integer.parseInt(line[6]));       // date_taken
                review.setCreated(Integer.parseInt(line[7]));       // created
                reviews.add(review);
            }
            
            repository.saveAll(reviews);
        }
    }

    private void loadBlogs(BlogRepository repository) throws IOException, CsvValidationException {
        var resource = new ClassPathResource("blogs.csv");
        try (var reader = new CSVReader(new InputStreamReader(resource.getInputStream()))) {
            String[] header = reader.readNext();
            String[] line;
            List<Blog> blogs = new ArrayList<>();
            
            while ((line = reader.readNext()) != null) {
                Blog blog = new Blog();
                blog.setTitle(line[0]);          // title
                blog.setContent(line[1]);        // content
                blog.setTags(line[2]);           // tags
                blog.setCreated(Integer.parseInt(line[3]));  // created
                blogs.add(blog);
            }
            
            repository.saveAll(blogs);
        }
    }
}