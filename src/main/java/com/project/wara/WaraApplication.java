package com.project.wara;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.project.wara.mapper")  // <- 꼭 추가
public class WaraApplication {
    public static void main(String[] args) {
        SpringApplication.run(WaraApplication.class, args);
    }
}