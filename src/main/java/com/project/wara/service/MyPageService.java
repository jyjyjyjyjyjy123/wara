package com.project.wara.service;

import com.project.wara.domain.Post;
import com.project.wara.domain.Comment;
import com.project.wara.domain.Stats;
import com.project.wara.domain.User;
import com.project.wara.mapper.MyPageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 마이페이지 관련 서비스
 * - 내 정보 수정
 * - 통계
 * - 내 글/댓글/즐겨찾기/좋아요 조회
 */
@Service
@RequiredArgsConstructor
public class MyPageService {

    private final MyPageMapper myPageMapper;

    // ============================== //
    // 내 정보 수정
    // ============================== //
    public User updateUserInfo(User user) {
        int match = myPageMapper.checkPassword(user.getUserSeq(), user.getCurrentPassword());
        if (match == 0) {
            throw new RuntimeException("현재 비밀번호가 일치하지 않습니다.");
        }
        myPageMapper.updateUserInfo(user);
        return myPageMapper.selectUserSeq(user.getUserSeq());
    }

    // ============================== //
    // 통계
    // ============================== //
    public Stats getStats(Long userSeq) {
        int postCount = myPageMapper.countPosts(userSeq);
        int commentCount = myPageMapper.countComments(userSeq);
        int favoriteCount = myPageMapper.countFavorites(userSeq);
        int likeCount = myPageMapper.countLikes(userSeq);

        return new Stats(postCount, commentCount, favoriteCount, likeCount);
    }

    // ============================== //
    // 페이징 계산
    // ============================== //
    private int calculateOffset(int page, int limit) {
        return (page - 1) * limit;
    }

    // ============================== //
    // 내 글
    // ============================== //
    public int countPosts(Long userSeq) {
        return myPageMapper.countPosts(userSeq);
    }

    public List<Post> getMyPostsPreview(Long userSeq, int limit) {
        return myPageMapper.selectMyPosts(userSeq, 0, limit);
    }

    public List<Post> getMyPostsPaged(Long userSeq, int page, int limit) {
        int offset = calculateOffset(page, limit);
        return myPageMapper.selectMyPosts(userSeq, offset, limit);
    }

    // ============================== //
    // 내 댓글
    // ============================== //
    public int countComments(Long userSeq) {
        return myPageMapper.countComments(userSeq);
    }

    public List<Comment> getMyCommentsPreview(Long userSeq, int limit) {
        return myPageMapper.selectMyComments(userSeq, 0, limit);
    }

    public List<Comment> getMyCommentsPaged(Long userSeq, int page, int limit) {
        int offset = calculateOffset(page, limit);
        return myPageMapper.selectMyComments(userSeq, offset, limit);
    }

    // ============================== //
    // 즐겨찾기
    // ============================== //
    public int countFavorites(Long userSeq) {
        return myPageMapper.countFavorites(userSeq);
    }

    public List<Post> getMyFavoritesPreview(Long userSeq, int limit) {
        return myPageMapper.selectMyFavorites(userSeq, 0, limit);
    }

    public List<Post> getMyFavoritesPaged(Long userSeq, int page, int limit) {
        int offset = calculateOffset(page, limit);
        return myPageMapper.selectMyFavorites(userSeq, offset, limit);
    }

    // ============================== //
    // 좋아요
    // ============================== //
    public int countLikes(Long userSeq) {
        return myPageMapper.countLikes(userSeq);
    }

    public List<Post> getMyLikesPreview(Long userSeq, int limit) {
        return myPageMapper.selectMyLikes(userSeq, 0, limit);
    }

    public List<Post> getMyLikesPaged(Long userSeq, int page, int limit) {
        int offset = calculateOffset(page, limit);
        return myPageMapper.selectMyLikes(userSeq, offset, limit);
    }
}
