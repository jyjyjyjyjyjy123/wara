package com.project.wara.mapper;

import com.project.wara.domain.User;
import org.apache.ibatis.annotations.Mapper;

/**
 * 사용자 관련 DB 연산 Mapper
 */
@Mapper
public interface UserMapper {

    /**
     * 사용자 등록
     * @param user 등록할 User 객체
     * @return 삽입된 행 수
     */
    int insertUser(User user);

    /**
     * 아이디로 사용자 조회
     * @param id 조회할 사용자 아이디
     * @return User 객체 (없으면 null)
     */
    User findById(String id);
}
