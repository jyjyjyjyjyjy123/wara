-- USER_TBL
CREATE TABLE USER_TBL (
    user_seq BIGINT AUTO_INCREMENT PRIMARY KEY,
    id VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- POST_TBL
CREATE TABLE POST_TBL (
    post_seq BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    user_seq BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    view_count BIGINT DEFAULT 0,
    CONSTRAINT fk_post_user FOREIGN KEY (user_seq) REFERENCES USER_TBL(user_seq)
);

-- POST_CONTENT_TBL
CREATE TABLE POST_CONTENT_TBL (
    post_content_seq BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_seq BIGINT NOT NULL,
    type VARCHAR(20) NOT NULL,
    content CLOB,
    latitude DOUBLE,
    longitude DOUBLE,
    order_num BIGINT NOT NULL,
    CONSTRAINT fk_postcontent_post FOREIGN KEY (post_seq) REFERENCES POST_TBL(post_seq)
);

-- COMMENT_TBL
CREATE TABLE COMMENT_TBL (
    comment_seq BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_seq BIGINT NOT NULL,
    user_seq BIGINT NOT NULL,
    content CLOB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comment_post FOREIGN KEY (post_seq) REFERENCES POST_TBL(post_seq),
    CONSTRAINT fk_comment_user FOREIGN KEY (user_seq) REFERENCES USER_TBL(user_seq)
);

-- FAVORITE_TBL
CREATE TABLE FAVORITE_TBL (
    favorite_seq BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_seq BIGINT NOT NULL,
    user_seq BIGINT NOT NULL,
    CONSTRAINT fk_favorite_post FOREIGN KEY (post_seq) REFERENCES POST_TBL(post_seq),
    CONSTRAINT fk_favorite_user FOREIGN KEY (user_seq) REFERENCES USER_TBL(user_seq),
    CONSTRAINT uq_favorite UNIQUE (post_seq, user_seq)
);

-- LIKE_TBL
CREATE TABLE LIKE_TBL (
    like_seq BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_seq BIGINT NOT NULL,
    user_seq BIGINT NOT NULL,
    CONSTRAINT fk_like_post FOREIGN KEY (post_seq) REFERENCES POST_TBL(post_seq),
    CONSTRAINT fk_like_user FOREIGN KEY (user_seq) REFERENCES USER_TBL(user_seq),
    CONSTRAINT uq_like UNIQUE (post_seq, user_seq)
);

-- POST_VIEW_LOG
CREATE TABLE POST_VIEW_LOG (
    view_log_seq BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_seq BIGINT NOT NULL,
    user_seq BIGINT,
    client_id VARCHAR(255),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_viewlog_post FOREIGN KEY (post_seq) REFERENCES POST_TBL(post_seq),
    CONSTRAINT fk_viewlog_user FOREIGN KEY (user_seq) REFERENCES USER_TBL(user_seq)
);
