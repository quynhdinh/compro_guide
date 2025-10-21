package com.quynhdv.compro_guide.chatbot;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin
public class AIController {

    @Autowired
    private AIService aiService;
    @Autowired
    private ChatClient chatClient;

    @PostMapping("/sentiment")
    public String analyzeSentiment(@RequestBody String text) {
        return aiService.analyzeSentiment(text);
    }

    @GetMapping("/bot")
    public String ping(String prompt) {
        try {
            ChatResponse response = chatClient
                    .prompt(prompt)
                    .call()
                    .chatResponse();
            return response.getResult().getOutput().getText();
        } catch (Exception e) {
            return "Internal server error try again later.";
        }
    }
}