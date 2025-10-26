package com.project.wara.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Post {

    // =============================
    // 기본 컬럼 (POST_TBL과 직접 매핑)
    // =============================
    private Long postSeq;               // 게시글 고유번호
    private String title;               // 제목
    private LocalDateTime createdAt;    // 생성일시
    private LocalDateTime updatedAt;    // 수정일시
    private int viewCount;              // 조회수

    // =============================
    // 연관 관계 객체
    // =============================
    private User user;                   // 작성자 정보
    private List<PostContent> contents;  // 게시글 내용
    private List<Comment> comments;      // 댓글 리스트

    // =============================
    // 상태 정보 및 추가 데이터
    // =============================
    private boolean liked;              // 현재 로그인 유저가 좋아요 했는지
    private boolean favorited;          // 현재 로그인 유저가 즐겨찾기 했는지

    private int likeCount;              // 좋아요 수
    private int favoriteCount;          // 즐겨찾기 수

    private String thumbnail;           // 썸네일
}
