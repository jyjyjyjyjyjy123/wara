package com.project.wara.mapper;

import com.project.wara.domain.Post;
import com.project.wara.domain.Comment;
import com.project.wara.domain.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 마이페이지 관련 Mapper
 * - 내 정보 수정
 * - 통계
 * - 내 글/댓글/즐겨찾기/좋아요 조회
 */
@Mapper
public interface MyPageMapper {

    // ============================== //
    // 내 정보 수정
    // ============================== //
    void updateUserInfo(User user);
    User selectUserSeq(Long userSeq);
    int checkPassword(Long userSeq, String currentPassword);

    // ============================== //
    // 통계
    // ============================== //
    int countPosts(Long userSeq);       // 게시물 수
    int countComments(Long userSeq);    // 댓글 수
    int countFavorites(Long userSeq);   // 즐겨찾기 수
    int countLikes(Long userSeq);       // 좋아요 수

    // ============================== //
    // 내 글
    // ============================== //
    List<Post> selectMyPosts(@Param("userSeq") Long userSeq,
                             @Param("offset") int offset,
                             @Param("limit") int limit);

    // ============================== //
    // 내 댓글
    // ============================== //
    List<Comment> selectMyComments(@Param("userSeq") Long userSeq,
                                   @Param("offset") int offset,
                                   @Param("limit") int limit);

    // ============================== //
    // 즐겨찾기
    // ============================== //
    List<Post> selectMyFavorites(@Param("userSeq") Long userSeq,
                                 @Param("offset") int offset,
                                 @Param("limit") int limit);

    // ============================== //
    // 좋아요
    // ============================== //
    List<Post> selectMyLikes(@Param("userSeq") Long userSeq,
                             @Param("offset") int offset,
                             @Param("limit") int limit);

}
