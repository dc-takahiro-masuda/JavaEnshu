package com.example.demo;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*") // すべてのオリジンを許可（必要に応じて変更）
                .allowedMethods("GET", "POST", "PUT", "DELETE","PATCH") // 許可するHTTPメソッド
                .allowedHeaders("*"); // 許可するヘッダー
    }
}
