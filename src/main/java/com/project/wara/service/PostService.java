package com.project.wara.service;

import com.project.wara.domain.*;
import com.project.wara.mapper.PostMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PostService {

    private final PostMapper postMapper;

    public PostService(PostMapper postMapper) {
        this.postMapper = postMapper;
    }

    // ------------------ 인기글 조회 API ------------------
    public List<Post> getPopularPosts() {
        return postMapper.selectPopularPosts();
    }

    public List<PostContent> getTopLocations() {
        return postMapper.getTopLocations();
    }

    // ------------------ 글 전체 조회 ------------------
    public PostPageResponse getAllPosts(int page, int size, String sort) {
        int offset = page * size; // page는 0-based 라고 가정
        List<Post> content = postMapper.getPosts(offset, size, sort);
        int totalElements = postMapper.countPosts();
        int totalPages = (int) Math.ceil((double) totalElements / size);

        return PostPageResponse.builder()
                .content(content)
                .page(page)
                .size(size)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .build();
    }

    // ------------------ 글 상세 조회 ------------------
    public Post getPostDetail(Long postSeq, Long userSeq, HttpServletRequest request) {
        String clientId = null;
        if (userSeq == null) {
            String ip = request.getRemoteAddr();
            String ua = request.getHeader("User-Agent");
            clientId = String.valueOf((ip + ua).hashCode());
        }

        boolean viewedRecently = postMapper.hasViewedRecently(postSeq, userSeq, clientId);
        if (!viewedRecently) {
            postMapper.incrementViewCount(postSeq);
            postMapper.insertViewLog(postSeq, userSeq, clientId);
        }

        Post post = postMapper.getPost(postSeq);
        List<PostContent> contents = postMapper.getPostContents(postSeq);
        List<Comment> comments = postMapper.getComments(postSeq);

        boolean liked = (userSeq != null) && postMapper.isLiked(postSeq, userSeq);
        boolean favorited = (userSeq != null) && postMapper.isFavorited(postSeq, userSeq);

        post.setContents(contents);
        post.setComments(comments);
        post.setLiked(liked);
        post.setFavorited(favorited);
        post.setLikeCount(postMapper.countLikes(postSeq));
        post.setFavoriteCount(postMapper.countFavorites(postSeq));

        return post;
    }

    // ------------------ 게시글 등록 ------------------
    public void createPost(Post post) {
        postMapper.insertPost(post);

        List<PostContent> contents = post.getContents();
        if (contents != null && !contents.isEmpty()) {
            for (PostContent content : contents) {
                content.setPostSeq(post.getPostSeq());
                postMapper.insertPostContent(content);
            }
        }
    }

    // ------------------ 게시글 수정 API ------------------
    public void updatePost(Long postSeq, Post updatedPost) {
        postMapper.updatePostTitle(postSeq, updatedPost.getTitle());
        postMapper.deletePostContents(postSeq);

        List<PostContent> contents = updatedPost.getContents();
        if (contents != null && !contents.isEmpty()) {
            for (PostContent content : contents) {
                content.setPostSeq(postSeq);
                postMapper.insertPostContent(content);
            }
        }
    }

    public Post getPostById(Long postSeq) {
        return postMapper.findById(postSeq);
    }

    // ------------------ 게시글 삭제 API ------------------
    public void deletePost(Long postSeq) {
        postMapper.deletePostContents(postSeq);
        postMapper.deleteLogAll(postSeq);
        postMapper.deleteCommentAll(postSeq);
        postMapper.deleteLikeAll(postSeq);
        postMapper.deleteFavoriteAll(postSeq);
        postMapper.deletePost(postSeq);
    }

    // ------------------ 조항요 (좋아요/즐겨찾기) ------------------
    public void toggleLike(Long postSeq, Long userSeq) {
        if (postMapper.isLiked(postSeq, userSeq)) {
            postMapper.deleteLike(postSeq, userSeq);
        } else {
            postMapper.insertLike(postSeq, userSeq);
        }
    }

    public void toggleFavorite(Long postSeq, Long userSeq) {
        if (postMapper.isFavorited(postSeq, userSeq)) {
            postMapper.deleteFavorite(postSeq, userSeq);
        } else {
            postMapper.insertFavorite(postSeq, userSeq);
        }
    }

    // ------------------ 댓글 ------------------
    public void insertComment(Comment comment) {
        postMapper.insertComment(comment);
    }

    public void deleteComment(Long commentSeq) {
        postMapper.deleteComment(commentSeq);
    }

    // ------------------ 이미지 등록 ------------------
    // (이미지는 컨트롤러에서 처리, Service에서는 파일 이동만 필요 없어서 생략 가능)

    // ------------------ 모든 위치 포함 게시글 조회 ------------------
    public List<PostContent> getPostsWithLocations() {
        return postMapper.getPostsWithLocations();
    }

    // ------------------ 특정 좌표 주변 게시글 조회 ------------------
    public List<Post> getPostsNearLocation(double latitude, double longitude) {
        return postMapper.getPostsNearLocation(latitude, longitude);
    }

}
