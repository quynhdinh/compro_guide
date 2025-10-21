package com.quynhdv.compro_guide.chatbot;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.List;
import java.util.Map;
import java.util.Collections;

@Service
public class AIService {
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public String analyzeSentiment(String text) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;

        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", "Analyze the sentiment of this text and return only 'positive', 'neutral', or 'negative': " + text);
        Map<String, Object> parts = new HashMap<>();
        parts.put("parts", Collections.singletonList(textPart));
        List<Object> contents = new ArrayList<>();
        contents.add(parts);
        Map<String, Object> body = new HashMap<>();
        body.put("contents", contents);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            entity,
            Map.class
        );
        // Extract the response text
        Map respBody = response.getBody();
        if (respBody != null && respBody.containsKey("candidates")) {
            List candidates = (List) respBody.get("candidates");
            if (!candidates.isEmpty()) {
                Map first = (Map) candidates.get(0);
                Map content = (Map) first.get("content");
                List contentParts = (List) content.get("parts");
                if (!contentParts.isEmpty()) {
                    Map contentPart = (Map) contentParts.get(0);
                    return contentPart.get("text").toString();
                }
            }
        }
        return "No sentiment found";
    }
}
