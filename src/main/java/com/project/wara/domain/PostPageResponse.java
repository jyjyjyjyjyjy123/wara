package com.project.wara.domain;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * 게시글 페이지 응답 DTO
 * - 페이징된 Post 리스트 및 페이지 정보 포함
 */
@Data
@Builder
public class PostPageResponse {
    private List<Post> content;      // 게시글 리스트
    private int page;                // 현재 페이지 번호 (0부터 시작)
    private int size;                // 페이지당 데이터 수
    private int totalElements;       // 전체 게시글 수
    private int totalPages;          // 전체 페이지 수
}
