package com.quynhdv.compro_guide;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.quynhdv.compro_guide.courses.CourseRepository;
import com.quynhdv.compro_guide.reviews.ReviewRepository;
import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class HomeController {

    private final CourseRepository courseRepository;
    private final ReviewRepository reviewRepository;

    @GetMapping({"/", "/index"})
    public String index(Model model) {
        return "index";
    }

    @GetMapping("/fragment/courses")
    public String coursesFragment(Model model) {
        model.addAttribute("courses", courseRepository.findAll());
        return "fragments/_courses :: content";
    }

    @GetMapping("/fragment/reviews")
    public String reviewsFragment(Model model) {
        model.addAttribute("reviews", reviewRepository.findAll());
        return "fragments/_reviews :: content";
    }

    @GetMapping("/fragment/blogs")
    public String blogsFragment() {
        // no blog repo yet; return static fragment
        return "fragments/_blogs :: content";
    }
}
