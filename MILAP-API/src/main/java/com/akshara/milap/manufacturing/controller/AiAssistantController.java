package com.akshara.milap.manufacturing.controller;

import com.akshara.milap.manufacturing.service.AiAssistantService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiAssistantController {

    private final AiAssistantService aiAssistantService;

    public AiAssistantController(AiAssistantService aiAssistantService) {
        this.aiAssistantService = aiAssistantService;
    }

    public static class AskRequest {
        public String question;
    }

    @PostMapping("/ask")
    public Map<String, String> ask(@RequestBody AskRequest request) {
        return Map.of("answer", aiAssistantService.ask(request.question));
    }
}
