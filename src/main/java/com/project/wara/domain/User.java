package com.project.wara.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Long userSeq;        // 사용자 고유번호 (PK)
    private String userId;       // 아이디
    private String password;     // 비밀번호
    private String nickname;     // 닉네임
    private String profileImage; // 프로필 이미지 URL

    // 비밀번호 변경용 필드
    private String currentPassword;
    private String newPassword;
}
