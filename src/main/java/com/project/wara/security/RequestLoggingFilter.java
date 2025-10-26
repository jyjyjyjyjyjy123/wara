package com.project.wara.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * 모든 요청 URI를 로그로 남기는 필터
 * - 개발 중 디버깅용
 * - 운영 환경에서는 Logger 사용 권장
 */
@Component
public class RequestLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // 요청 URI 로그 출력
        /* System.out.println("Request URI: " + request.getRequestURI()); */

        // 다음 필터 체인 실행
        filterChain.doFilter(request, response);
    }
}
