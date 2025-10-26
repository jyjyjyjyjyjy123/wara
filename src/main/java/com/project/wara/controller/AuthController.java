package com.project.wara.controller;

import com.project.wara.domain.User;
import com.project.wara.mapper.UserMapper;
import com.project.wara.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 🔐 AuthController
 * - 로그인 / 회원가입 / 인증 테스트용 엔드포인트 제공
 */
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * 로그인
     * - 사용자 아이디, 비밀번호 검증
     * - JWT 토큰 발급
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        System.out.println("[AuthController] 로그인 요청 데이터: " + body);

        String id = body.get("id");
        String password = body.get("password");

        // 사용자 조회
        User user = userMapper.findById(id);
        if (user == null) {
            return ResponseEntity.status(401).body("존재하지 않는 아이디입니다.");
        }

        // 비밀번호 검증 (현재는 평문 비교)
        if (!user.getPassword().equals(password)) {
            return ResponseEntity.status(401).body("아이디 또는 비밀번호가 잘못되었습니다.");
        }

        // JWT 토큰 생성
        String token = jwtUtil.generateToken(user);

        // 응답 데이터 구성
        Map<String, Object> res = new HashMap<>();
        res.put("token", token);
        res.put("userId", user.getUserId());
        res.put("nickname", user.getNickname());
        res.put("profileImage", user.getProfileImage());
        res.put("userSeq", user.getUserSeq());

        System.out.println("[AuthController] 로그인 성공: " + user.getUserId());

        return ResponseEntity.ok(res);
    }

    /**
     * 회원가입
     * - 아이디 중복 검사
     * - 사용자 정보 저장
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        System.out.println("[AuthController] 회원가입 요청 데이터: " + user);

        // 아이디 중복 확인
        if (userMapper.findById(user.getUserId()) != null) {
            return ResponseEntity
                    .badRequest()
                    .body("이미 사용 중인 아이디입니다.");
        }

        // TODO: 비밀번호 암호화 추가 (예: BCryptPasswordEncoder)
        // user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 사용자 등록
        userMapper.insertUser(user);

        System.out.println("[AuthController] 회원가입 성공: " + user.getUserId());

        return ResponseEntity.ok("회원가입이 완료되었습니다.");
    }

    /**
     * JWT 인증 확인용 테스트 엔드포인트
     */
    @GetMapping("/protected")
    public ResponseEntity<String> protectedEndpoint() {
        return ResponseEntity.ok("JWT 인증 성공!");
    }
}
