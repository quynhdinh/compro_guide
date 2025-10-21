package com.quynhdv.compro_guide.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.context.annotation.Lazy;

import lombok.extern.slf4j.Slf4j;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.api.Advisor;
import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import java.util.List;

@DependsOn("embeddingRunner")
@Configuration
@Slf4j
public class AIConfig { // make sure this one run after EmbeddingRunner
	@Bean
    @Lazy
    public ChatClient chatClient(ChatModel chatModel, VectorStore vectorStore) {
        // log.info("vectorStore.toString(): {}", vectorStore.toString());
		ChatMemory chatMemory = MessageWindowChatMemory.builder().build();
		Advisor memory = MessageChatMemoryAdvisor.builder(chatMemory).build();
		
		// Advisor retrieval = new QuestionAnswerAdvisor(vectorStore);
		Advisor retrieval = QuestionAnswerAdvisor
			.builder(vectorStore)
			.searchRequest(
				SearchRequest.builder()
				.similarityThreshold(0.5)
				.topK(5).build())
			.build();

		ChatClient.Builder builder = ChatClient.builder(chatModel);
		builder.defaultAdvisors(List.of(retrieval, memory));
		return builder.build();
    }
}
