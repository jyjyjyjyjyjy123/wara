package com.project.wara.controller;

import com.project.wara.domain.*;
import com.project.wara.service.PostService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    // ------------------ 인기글 조회 API ------------------
    @GetMapping("/popular")
    public List<Post> getPopularPosts() {
        return postService.getPopularPosts();
    }

    @GetMapping("/popular/locations")
    public List<PostContent> getTopLocations() {
        return postService.getTopLocations();
    }

    // ------------------ 글 전체 조회 ------------------
    @GetMapping
    public ResponseEntity<PostPageResponse> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "latest") String sort
    ) {
        PostPageResponse res = postService.getAllPosts(page, size, sort);
        return ResponseEntity.ok(res);
    }

    // ------------------ 글 상세 조회 ------------------
    @GetMapping("/{postSeq}")
    public ResponseEntity<Post> getPost(@PathVariable Long postSeq, Authentication authentication, HttpServletRequest request) {
        Long userSeq = null;
        if (authentication != null) {
            userSeq = Long.parseLong(authentication.getName());
        }

        Post post = postService.getPostDetail(postSeq, userSeq, request);
        if (post == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(post);
    }

    // ------------------ 게시글 등록 ------------------
    @PostMapping
    public ResponseEntity<String> createPost(@RequestBody Post post, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        Long userSeq = Long.parseLong(authentication.getName());
        User user = new User();
        user.setUserSeq(userSeq);
        post.setUser(user);

        postService.createPost(post);
        return ResponseEntity.ok("게시글이 등록되었습니다.");
    }

    // ------------------ 게시글 수정 API ------------------
    @PutMapping("/{postSeq}")
    public ResponseEntity<String> updatePost(@PathVariable Long postSeq,
                                             @RequestBody Post post,
                                             Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        Post existingPost = postService.getPostById(postSeq);
        if (existingPost == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("게시글을 찾을 수 없습니다.");
        }

        Long userSeq = Long.parseLong(authentication.getName());
        if (!existingPost.getUser().getUserSeq().equals(userSeq)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("게시글 작성자만 수정할 수 있습니다.");
        }

        postService.updatePost(postSeq, post);
        return ResponseEntity.ok("게시글이 수정되었습니다.");
    }


    // ------------------ 게시글 삭제 API ------------------
    @DeleteMapping("/{postSeq}")
    public ResponseEntity<String> deletePost(@PathVariable Long postSeq, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        Post existingPost = postService.getPostById(postSeq);
        if (existingPost == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("게시글을 찾을 수 없습니다.");
        }

        Long userSeq = Long.parseLong(authentication.getName());
        if (!existingPost.getUser().getUserSeq().equals(userSeq)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("게시글 작성자만 삭제할 수 있습니다.");
        }

        postService.deletePost(postSeq);
        return ResponseEntity.ok("게시글이 삭제되었습니다.");
    }

    // ------------------ 조항요 (좋아요/즐겨찾기) ------------------
    @PostMapping("/{postSeq}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long postSeq, @RequestParam Long userSeq) {
        postService.toggleLike(postSeq, userSeq);
        return ResponseEntity.ok("좋아요 상태 변경 완료");
    }

    @PostMapping("/{postSeq}/favorite")
    public ResponseEntity<?> toggleFavorite(@PathVariable Long postSeq, @RequestParam Long userSeq) {
        postService.toggleFavorite(postSeq, userSeq);
        return ResponseEntity.ok("즐겨찾기 상태 변경 완료");
    }

    // ------------------ 댓글 ------------------
    @PostMapping("/{postSeq}/comment")
    public ResponseEntity<Comment> insertComment(@RequestBody Comment comment) {
        postService.insertComment(comment);
        return ResponseEntity.ok(comment);  // PK가 세팅된 comment 반환
    }

    @DeleteMapping("/comments/{commentSeq}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentSeq) {
        postService.deleteComment(commentSeq);
        return ResponseEntity.noContent().build();
    }

    // ------------------ 이미지 등록 ------------------
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String uploadDir = System.getProperty("user.dir") + "/uploads/";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String originalName = file.getOriginalFilename();

            if (originalName != null) {
                originalName = originalName.replaceAll("\\s+", "_");

                originalName = originalName.replaceAll("[^a-zA-Z0-9._()-]", "");
            }

            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            File destination = new File(uploadDir + filename);
            file.transferTo(destination);

            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", "/uploads/" + filename);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ------------------ 모든 위치 포함 게시글 조회 ------------------
    @GetMapping("/map/locations")
    public List<PostContent> getAllLocations() {
        return postService.getPostsWithLocations();
    }

    // ------------------ 특정 좌표 주변 게시글 조회 ------------------
    @GetMapping("/map/posts")
    public List<Post> getPostsNearLocation(@RequestParam double latitude, @RequestParam double longitude) {
        return postService.getPostsNearLocation(latitude, longitude);
    }
}
