package com.project.wara.security;

import com.project.wara.domain.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * JWT 토큰 생성 및 검증 유틸리티
 */
@Component
public class JwtUtil {

    // 32바이트 이상으로 안전하게 관리 필요
    private final String SECRET_KEY = "mysecretkey1234567890mysecretkey1234567890";

    /**
     * 사용자 정보를 기반으로 JWT 토큰 생성
     * @param user User 객체
     * @return 생성된 JWT 토큰
     */
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(String.valueOf(user.getUserSeq())) // JWT subject: userSeq
                .claim("userId", user.getUserId())
                .claim("nickname", user.getNickname())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1시간 유효
                .signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * JWT 토큰에서 userSeq 추출
     * @param token JWT 토큰
     * @return userSeq
     */
    public String extractUserSeq(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /*
    // 필요 시 JWT에서 userId 추출용
    public String extractUserId(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
    */
}
