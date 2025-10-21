package com.quynhdv.compro_guide.config;

import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;

import com.quynhdv.compro_guide.blogs.Blog;
import com.quynhdv.compro_guide.blogs.BlogRepository;
import com.quynhdv.compro_guide.courses.Course;
import com.quynhdv.compro_guide.courses.CourseRepository;
import com.quynhdv.compro_guide.reviews.Review;
import com.quynhdv.compro_guide.reviews.ReviewRepository;

import lombok.extern.slf4j.Slf4j;
import java.util.*;

@DependsOn("csvDataLoader")
@Component("embeddingRunner")
@Slf4j
public class EmbeddingRunner implements CommandLineRunner {

    @Autowired
    private VectorStore vectorStore;
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private BlogRepository blogRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @Override
    public void run(String... args) throws Exception {
        log.info("Initializing embeddings...");
        // read the table courses, blogs and reviews and add them to vector store
        List<Document> docs = new ArrayList<>();
        for (Course course : courseRepository.findAll()) {
            // log.info(course.toMap().toString());
            Document doc = Document.builder()
                    // .id(String.valueOf(course.getId()))
                    .metadata(course.toMap())
                    .text(course.getDescription())
                    .build();
            docs.add(doc);
        }
        for (Blog blog : blogRepository.findAll()) {
            // log.info(blog.toMap().toString());
            Document doc = Document.builder()
                    // .id(String.valueOf(blog.getBlogId()))
                    .metadata(blog.toMap())
                    .text(blog.getContent())
                    .build();
            docs.add(doc);
        }
        for (Review review : reviewRepository.findAll()) {
            Document doc = Document.builder()
                    // .id(String.valueOf(review.getReviewId()))
                    .metadata(review.toMap())
                    .text(review.getComment())
                    .build();
            docs.add(doc);
        }
        log.info("Adding {} documents to vector store", docs.size());
        vectorStore.add(docs);
        // get number of documents in vector store
        log.info("Done adding documents to vector store");
        // log.info("vectorStore.toString(): {}", vectorStore.toString());
    }

}
