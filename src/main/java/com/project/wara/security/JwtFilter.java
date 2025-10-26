package com.project.wara.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * JWT 인증 필터
 * - 모든 요청마다 JWT 토큰을 검사
 * - 유효한 토큰이면 SecurityContext에 인증 정보 세팅
 */
@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // 1. OPTIONS 요청은 인증 없이 바로 통과
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        // 2. Authorization 헤더가 존재하고 Bearer 토큰이면 JWT 검증
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String userSeq = jwtUtil.extractUserSeq(token);

                // 인증 객체 생성 후 SecurityContext에 세팅
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(userSeq, null, Collections.emptyList());
                SecurityContextHolder.getContext().setAuthentication(auth);

            } catch (Exception e) {
                // 토큰 검증 실패 시 403 응답
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                return;
            }
        }

        // 3. 필터 체인 계속 진행
        filterChain.doFilter(request, response);
    }
}
