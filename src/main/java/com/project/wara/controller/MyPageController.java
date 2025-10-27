package com.project.wara.controller;

import com.project.wara.domain.Post;
import com.project.wara.domain.Comment;
import com.project.wara.domain.User;
import com.project.wara.service.MyPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * 마이페이지 관련 API 컨트롤러
 * - 내 정보 수정
 * - 내 글/댓글/즐겨찾기/좋아요 조회
 * - 통계
 */
@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class MyPageController {

    private final MyPageService myPageService;

    private final String uploadDir = System.getProperty("user.dir") + "/uploads/profileImage";

    /**
     * 내 정보 수정
     */
    @PutMapping("/{userSeq}/myinfo")
    public ResponseEntity<User> updateUserInfo(
            @PathVariable Long userSeq,
            @RequestPart("user") User user,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) throws IOException {

        // 프로필 이미지 업로드 처리
        if (profileImage != null && !profileImage.isEmpty()) {
            // 디렉토리가 존재하지 않으면 생성
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = UUID.randomUUID() + "_" + profileImage.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(profileImage.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 저장 후 DB에 저장될 URL 설정
            user.setProfileImage("/uploads/profileImage/" + fileName);
        }

        User updatedUser = myPageService.updateUserInfo(user);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * 통계 조회
     */
    @GetMapping("/{userSeq}/stats")
    public ResponseEntity<?> getStats(@PathVariable Long userSeq) {
        return ResponseEntity.ok(myPageService.getStats(userSeq));
    }

    /**
     * 내가 작성한 글 조회 (페이징)
     */
    @GetMapping("/{userSeq}/posts")
    public ResponseEntity<?> getMyPosts(
            @PathVariable Long userSeq,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) boolean preview
    ) {
        if (preview) {
            return ResponseEntity.ok(myPageService.getMyPostsPreview(userSeq, 5));
        } else {
            List<Post> post = myPageService.getMyPostsPaged(userSeq, page, limit);
            int totalCount = myPageService.countPosts(userSeq);

            Map<String, Object> response = new HashMap<>();
            response.put("post", post);
            response.put("totalCount", totalCount);

            return ResponseEntity.ok(response);
        }
    }

    /**
     * 내가 작성한 댓글 조회 (페이징)
     */
    @GetMapping("/{userSeq}/comments")
    public ResponseEntity<?> getMyComments(
            @PathVariable Long userSeq,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) boolean preview
    ) {
        if (preview) {
            return ResponseEntity.ok(myPageService.getMyCommentsPreview(userSeq, 5));
        }

        List<Comment> comments = myPageService.getMyCommentsPaged(userSeq, page, limit);
        int totalCount = myPageService.countComments(userSeq);

        Map<String, Object> response = new HashMap<>();
        response.put("comments", comments);
        response.put("totalCount", totalCount);

        return ResponseEntity.ok(response);
    }

    /**
     * 즐겨찾기 조회 (페이징)
     */
    @GetMapping("/{userSeq}/favorites")
    public ResponseEntity<?> getMyFavorites(
            @PathVariable Long userSeq,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) boolean preview
    ) {
        if (preview) {
            return ResponseEntity.ok(myPageService.getMyFavoritesPreview(userSeq, 5));
        }

        List<Post> favorite = myPageService.getMyFavoritesPaged(userSeq, page, limit);
        int totalCount = myPageService.countFavorites(userSeq);

        Map<String, Object> response = new HashMap<>();
        response.put("favorite", favorite);
        response.put("totalCount", totalCount);

        return ResponseEntity.ok(response);
    }

    /**
     * 좋아요 조회 (페이징)
     */
    @GetMapping("/{userSeq}/likes")
    public ResponseEntity<?> getMyLikes(
            @PathVariable Long userSeq,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) boolean preview
    ) {
        if (preview) {
            return ResponseEntity.ok(myPageService.getMyLikesPreview(userSeq, 5));
        }

        List<Post> like = myPageService.getMyLikesPaged(userSeq, page, limit);
        int totalCount = myPageService.countLikes(userSeq);

        Map<String, Object> response = new HashMap<>();
        response.put("like", like);
        response.put("totalCount", totalCount);

        return ResponseEntity.ok(response);
    }

}
