package com.project.wara.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 게시글, 댓글, 즐겨찾기, 좋아요 통계 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Stats {
    private int posts;      // 게시글 수
    private int comments;   // 댓글 수
    private int favorites;  // 즐겨찾기 수
    private int likes;      // 좋아요 수
}
