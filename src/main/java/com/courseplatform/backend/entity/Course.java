package com.courseplatform.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity(name = "tb_courses")
@Table(name = "tb_courses")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String slug; // Ex: implanto-basica (bom para URL)
    private BigDecimal price;
    private String category;

    @Column(name = "image_url")
    private String imageUrl; // Link da imagem da capa

    @Column(columnDefinition = "TEXT")
    private String description; // Texto longo
}