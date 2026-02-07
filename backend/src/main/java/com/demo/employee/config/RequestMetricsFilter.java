package com.demo.employee.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class RequestMetricsFilter
        extends OncePerRequestFilter {

    private static final Logger log =
            LoggerFactory.getLogger(RequestMetricsFilter.class);

    @Override
    protected void doFilterInternal(
            HttpServletRequest req,
            HttpServletResponse res,
            FilterChain chain)
            throws ServletException, IOException {

        log.info(">>> RequestMetricsFilter HIT <<<");

        long start = System.currentTimeMillis();

        chain.doFilter(req, res);

        long time = System.currentTimeMillis() - start;

        if(req.getRequestURI().startsWith("/api")){
            log.info("api={} method={} status={} latency={}",
                    req.getRequestURI(),
                    req.getMethod(),
                    res.getStatus(),
                    time);
        }
    }
}
