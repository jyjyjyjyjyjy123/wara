package com.project.wara.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comment {

    // =============================
    // 기본 컬럼 (COMMENT_TBL 매핑)
    // =============================
    private Long commentSeq;       // 댓글 고유번호
    private Long postSeq;          // 게시글 번호 (FK)
    private Long userSeq;          // 작성자 번호 (FK)
    private String content;        // 댓글 내용
    private LocalDateTime createdAt; // 작성일시

    // =============================
    // 연관 객체
    // =============================
    private User user;             // 댓글 작성자 정보
}
