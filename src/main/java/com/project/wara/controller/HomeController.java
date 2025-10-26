package com.project.wara.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {

    // React SPA 라우팅 처리
    @RequestMapping(value = "/{[path:[^\\.]*}")
    public String redirect() {
        return "forward:/index.html";
    }
}
