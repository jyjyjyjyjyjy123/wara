package com.project.wara.mapper;

import com.project.wara.domain.Post;
import com.project.wara.domain.PostContent;
import com.project.wara.domain.Comment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PostMapper {

    // ------------------ 글 전체 조회 ------------------
    List<Post> getPosts(@Param("offset") int offset, @Param("limit") int limit, @Param("sort") String sort);
    int countPosts();

    // ------------------ 인기글 조회 API ------------------
    List<Post> selectPopularPosts();
    List<PostContent> getTopLocations();

    // ------------------ 글 상세 조회 ------------------
    Post getPost(@Param("postSeq") Long postSeq);
    List<PostContent> getPostContents(Long postSeq);

    // ------------------ 조회수 관련 ------------------
    void incrementViewCount(Long postSeq);
    boolean hasViewedRecently(@Param("postSeq") Long postSeq,
                              @Param("userSeq") Long userSeq,
                              @Param("clientId") String clientId);
    void insertViewLog(@Param("postSeq") Long postSeq,
                       @Param("userSeq") Long userSeq,
                       @Param("clientId") String clientId);

    // ------------------ 게시글 등록 ------------------
    void insertPost(Post post);
    void insertPostContent(PostContent content);

    // ------------------ 게시글 수정 API ------------------
    void updatePostTitle(Long postSeq, String title);
    Post findById(Long postSeq);

    // ------------------ 게시글 삭제 API ------------------
    void deletePostContents(Long postSeq);
    void deleteCommentAll(Long postSeq);
    void deleteLikeAll(Long postSeq);
    void deleteFavoriteAll(Long postSeq);
    void deletePost(Long postSeq);

    // ------------------ 댓글 ------------------
    List<Comment> getComments(Long postSeq);
    void insertComment(Comment comment);
    void deleteComment(Long commentSeq);

    // ------------------ 조항요 (좋아요/즐겨찾기) ------------------
    boolean isLiked(@Param("postSeq") Long postSeq, @Param("userSeq") Long userSeq);
    int countLikes(Long postSeq);
    void insertLike(@Param("postSeq") Long postSeq, @Param("userSeq") Long userSeq);
    void deleteLike(@Param("postSeq") Long postSeq, @Param("userSeq") Long userSeq);

    boolean isFavorited(@Param("postSeq") Long postSeq, @Param("userSeq") Long userSeq);
    int countFavorites(Long postSeq);
    void insertFavorite(@Param("postSeq") Long postSeq, @Param("userSeq") Long userSeq);
    void deleteFavorite(@Param("postSeq") Long postSeq, @Param("userSeq") Long userSeq);

    // ------------------ 데이트맵 ------------------
    List<PostContent> getPostsWithLocations();
    List<Post> getPostsNearLocation(@Param("latitude") double latitude, @Param("longitude") double longitude);
}
