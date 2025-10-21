package com.quynhdv.compro_guide;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
@SpringBootApplication
@Slf4j
public class ComproGuideApplication {
	public static void main(String[] args) {
		SpringApplication.run(ComproGuideApplication.class, args);
	}
}

@RestController
class HomeController {

    @GetMapping({"/", "/index"})
    public String index() {
        return "welcome to Compro Guide!";
    }

}
