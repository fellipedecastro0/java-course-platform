package com.courseplatform.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseDTO {
    private Long id;
    private String title;
    private String slug;
    private BigDecimal price;
    private String category;
    private String imageUrl;
    private String description;
}