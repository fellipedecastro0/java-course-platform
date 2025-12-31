package com.courseplatform.backend.controller;

import com.courseplatform.backend.dto.CourseDTO;
import com.courseplatform.backend.entity.Course;
import com.courseplatform.backend.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
@RequiredArgsConstructor // Isso aqui injeta o repository automaticamente
public class CourseController {

    private final CourseRepository repository;

    // GET - Agora busca no Banco de Dados
    @GetMapping
    public ResponseEntity<List<Course>> listarCursos() {
        List<Course> cursos = repository.findAll();
        return ResponseEntity.ok(cursos);
    }

    // POST - Agora salva no Banco de Dados
    @PostMapping
    public ResponseEntity<Course> criarCurso(@RequestBody CourseDTO dados) {
        System.out.println("Salvando no banco: " + dados.getTitle());

        // Passando os dados do DTO (JSON) para a Entidade (Banco)
        Course novoCurso = new Course();
        novoCurso.setTitle(dados.getTitle());
        novoCurso.setSlug(dados.getSlug());
        novoCurso.setPrice(dados.getPrice());
        novoCurso.setCategory(dados.getCategory());
        novoCurso.setImageUrl(dados.getImageUrl());
        novoCurso.setDescription(dados.getDescription());

        // O comando mágico que grava no Postgres
        Course cursoSalvo = repository.save(novoCurso);

        return ResponseEntity.ok(cursoSalvo);
    }

    // DELETE - Agora apaga do Banco de Dados
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCurso(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}