package com.digipay.gateway.filter;

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
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final Logger log =
            LoggerFactory.getLogger(RequestLoggingFilter.class);

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        log.info("Incoming request: method={}, uri={}, origin={}",
                request.getMethod(),
                request.getRequestURI(),
                request.getHeader("Origin"));

        try {
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            log.error("REQUEST FAILED: method={}, uri={}",
                    request.getMethod(),
                    request.getRequestURI(),
                    e);
            throw e;
        } finally {
            log.info("Response: method={}, uri={}, status={}",
                    request.getMethod(),
                    request.getRequestURI(),
                    response.getStatus());
        }
    }
}