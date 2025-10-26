package com.project.wara.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Favorite {

    // =============================
    // 기본 컬럼 (FAVORITE_TBL 매핑)
    // =============================
    private Long favoriteSeq;   // 즐겨찾기 고유번호 (PK)
    private Long postSeq;       // 게시글 번호 (FK)
    private Long userSeq;       // 사용자 번호 (FK)
}
