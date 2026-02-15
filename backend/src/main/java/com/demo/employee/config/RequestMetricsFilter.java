package com.demo.employee.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.time.Instant;


@Component
public class RequestMetricsFilter extends OncePerRequestFilter {

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String SPLUNK_URL =
            "http://3.111.144.128:8088/services/collector";

    private static final String TOKEN =
            "87725304-9b2f-43f3-b1c3-e3f94f9fc514";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("Inside splunk metrics logger");
        long start = System.currentTimeMillis();

        try {
            filterChain.doFilter(request, response);
        } finally {

            long duration = System.currentTimeMillis() - start;

            String event = """
            {
              "method": "%s",
              "path": "%s",
              "status": %d,
              "duration_ms": %d,
              "timestamp": "%s"
            }
            """.formatted(
                    request.getMethod(),
                    request.getRequestURI(),
                    response.getStatus(),
                    duration,
                    Instant.now()
            );

            sendToSplunk(event);
        }
    }

    private void sendToSplunk(String eventJson) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Splunk " + TOKEN);

        String payload = """
        { "event": %s }
        """.formatted(eventJson);

        try {
            restTemplate.postForObject(
                    SPLUNK_URL,
                    new HttpEntity<>(payload, headers),
                    String.class
            );
        } catch (Exception e) {
            e.printStackTrace();   // IMPORTANT: don't ignore errors now
        }
    }
}
