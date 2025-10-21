package com.quynhdv.compro_guide.chatbot;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin
public class AIController {
    private final AIService aiService;
    @Autowired
    public AIController(AIService aiService) {
        this.aiService = aiService;
    }
    @PostMapping("/sentiment")
    public String analyzeSentiment(@RequestBody String text) {
        return aiService.analyzeSentiment(text);
    }
}
