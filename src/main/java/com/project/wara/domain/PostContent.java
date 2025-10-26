package com.project.wara.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostContent {

    // =============================
    // 기본 컬럼 (POST_CONTENT_TBL 매핑)
    // =============================
    private Long postContentSeq;  // PK
    private Long postSeq;         // 게시글 번호 (FK)
    private String type;          // TEXT / IMAGE / LOCATION
    private String content;       // 글, 이미지 URL, 장소명/설명
    private Double latitude;      // LOCATION일 때 사용
    private Double longitude;     // LOCATION일 때 사용
    private Integer orderNum;     // 게시글 내 순서
}
