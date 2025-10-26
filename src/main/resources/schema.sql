-- ============================================
-- USER 테이블
-- ============================================
CREATE TABLE USER_TBL (
    user_seq      NUMBER PRIMARY KEY,
    id            VARCHAR2(50) NOT NULL UNIQUE,
    password      VARCHAR2(100) NOT NULL,
    nickname      VARCHAR2(50) NOT NULL,
    profile_image VARCHAR2(255),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE user_seq_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE OR REPLACE TRIGGER user_seq_trg
BEFORE INSERT ON USER_TBL
FOR EACH ROW
BEGIN
  :NEW.user_seq := user_seq_seq.NEXTVAL;
END;
/

-- ============================================
-- POST 테이블
-- ============================================
CREATE TABLE POST_TBL (
    post_seq    NUMBER PRIMARY KEY,
    title       VARCHAR2(200) NOT NULL,
    user_seq    NUMBER NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    view_count  NUMBER DEFAULT 0,
    CONSTRAINT fk_post_user FOREIGN KEY (user_seq) REFERENCES USER_TBL(user_seq)
);

CREATE SEQUENCE post_seq_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE OR REPLACE TRIGGER post_seq_trg
BEFORE INSERT ON POST_TBL
FOR EACH ROW
BEGIN
  :NEW.post_seq := post_seq_seq.NEXTVAL;
END;
/

-- ============================================
-- POST_CONTENT 테이블
-- ============================================
CREATE TABLE POST_CONTENT_TBL (
    post_content_seq NUMBER PRIMARY KEY,
    post_seq         NUMBER NOT NULL,
    type             VARCHAR2(20) NOT NULL, -- TEXT, IMAGE, LOCATION
    content          CLOB,
    latitude         NUMBER,
    longitude        NUMBER,
    order_num        NUMBER NOT NULL,
    CONSTRAINT fk_postcontent_post FOREIGN KEY (post_seq) REFERENCES POST_TBL(post_seq)
);

CREATE SEQUENCE post_content_seq_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE OR REPLACE TRIGGER post_content_seq_trg
BEFORE INSERT ON POST_CONTENT_TBL
FOR EACH ROW
BEGIN
  :NEW.post_content_seq := post_content_seq_seq.NEXTVAL;
END;
/

-- ============================================
-- COMMENT 테이블
-- ============================================
CREATE TABLE COMMENT_TBL (
    comment_seq NUMBER PRIMARY KEY,
    post_seq    NUMBER NOT NULL,
    user_seq    NUMBER NOT NULL,
    content     CLOB NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comment_post FOREIGN KEY (post_seq) REFERENCES POST_TBL(post_seq),
    CONSTRAINT fk_comment_user FOREIGN KEY (user_seq) REFERENCES USER_TBL(user_seq)
);

CREATE SEQUENCE comment_seq_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE OR REPLACE TRIGGER comment_seq_trg
BEFORE INSERT ON COMMENT_TBL
FOR EACH ROW
BEGIN
  :NEW.comment_seq := comment_seq_seq.NEXTVAL;
END;
/

-- ============================================
-- FAVORITE 테이블
-- ============================================
CREATE TABLE FAVORITE_TBL (
    favorite_seq NUMBER PRIMARY KEY,
    post_seq     NUMBER NOT NULL,
    user_seq     NUMBER NOT NULL,
    CONSTRAINT fk_favorite_post FOREIGN KEY (post_seq) REFERENCES POST_TBL(post_seq),
    CONSTRAINT fk_favorite_user FOREIGN KEY (user_seq) REFERENCES USER_TBL(user_seq),
    CONSTRAINT uq_favorite UNIQUE (post_seq, user_seq)
);

CREATE SEQUENCE favorite_seq_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE OR REPLACE TRIGGER favorite_seq_trg
BEFORE INSERT ON FAVORITE_TBL
FOR EACH ROW
BEGIN
  :NEW.favorite_seq := favorite_seq_seq.NEXTVAL;
END;
/

-- ============================================
-- LIKE 테이블
-- ============================================
CREATE TABLE LIKE_TBL (
    like_seq NUMBER PRIMARY KEY,
    post_seq NUMBER NOT NULL,
    user_seq NUMBER NOT NULL,
    CONSTRAINT fk_like_post FOREIGN KEY (post_seq) REFERENCES POST_TBL(post_seq),
    CONSTRAINT fk_like_user FOREIGN KEY (user_seq) REFERENCES USER_TBL(user_seq),
    CONSTRAINT uq_like UNIQUE (post_seq, user_seq)
);

CREATE SEQUENCE like_seq_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE OR REPLACE TRIGGER like_seq_trg
BEFORE INSERT ON LIKE_TBL
FOR EACH ROW
BEGIN
  :NEW.like_seq := like_seq_seq.NEXTVAL;
END;
/

-- ============================================
-- POST_VIEW_LOG 테이블
-- ============================================
CREATE TABLE POST_VIEW_LOG (
    view_log_seq NUMBER PRIMARY KEY,
    post_seq     NUMBER NOT NULL,
    user_seq     NUMBER NULL,
    client_id    VARCHAR2(255),
    viewed_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_viewlog_post FOREIGN KEY (post_seq) REFERENCES POST_TBL(post_seq),
    CONSTRAINT fk_viewlog_user FOREIGN KEY (user_seq) REFERENCES USER_TBL(user_seq)
);

CREATE SEQUENCE view_log_seq_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE OR REPLACE TRIGGER view_log_seq_trg
BEFORE INSERT ON POST_VIEW_LOG
FOR EACH ROW
BEGIN
  :NEW.view_log_seq := view_log_seq_seq.NEXTVAL;
END;
/

COMMIT;
