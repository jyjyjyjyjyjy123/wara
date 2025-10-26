package com.project.wara.service;

import com.project.wara.domain.User;
import com.project.wara.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 사용자 관련 비즈니스 로직 처리 서비스
 */
@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    /**
     * 로그인 처리
     * @param id 사용자 아이디
     * @param password 비밀번호
     * @return 로그인 성공 시 User 객체, 실패 시 null
     */
    public User login(String id, String password) {
        User user = userMapper.findById(id);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }

    /**
     * 회원가입 처리
     * @param user 회원가입 정보가 담긴 User 객체
     */
    public void signup(User user) {

        // 아이디 중복 체크
        if (userMapper.findById(user.getUserId()) != null) {
            throw new RuntimeException("이미 사용 중인 아이디입니다.");
        }

        // 비밀번호 암호화가 필요하면 여기서 처리 가능
        // 예: user.setPassword(passwordEncoder.encode(user.getPassword()));

        // DB에 사용자 등록
        userMapper.insertUser(user);
    }
}
