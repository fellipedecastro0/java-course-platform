package com.courseplatform.backend.controller;

import com.courseplatform.backend.dto.CourseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {

    // Lista temporária para simular banco de dados
    private List<CourseDTO> cursosMock = new ArrayList<>();

    public CourseController() {
        // Popula com um dado de teste pro John ver na tela
        // Usando o construtor gerado pelo Lombok @AllArgsConstructor
        cursosMock.add(new CourseDTO(
                1L,
                "Implantodontia Básica",
                "implanto-basica",
                new BigDecimal("1500.00"),
                "Implante",
                "https://via.placeholder.com/150",
                "Curso introdutório"
        ));
    }

    // GET /courses - Listar
    @GetMapping
    public ResponseEntity<List<CourseDTO>> listarCursos() {
        return ResponseEntity.ok(cursosMock);
    }

    // POST /courses - Criar
    @PostMapping
    public ResponseEntity<CourseDTO> criarCurso(@RequestBody CourseDTO novoCurso) {
        // CORREÇÃO AQUI: Usar .getTitle() em vez de .title()
        System.out.println("Recebido curso: " + novoCurso.getTitle());

        // Simula salvar no banco (adiciona na lista)
        cursosMock.add(novoCurso);

        return ResponseEntity.ok(novoCurso);
    }

    // DELETE /courses/{id} - Deletar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCurso(@PathVariable Long id) {
        System.out.println("Deletando curso ID: " + id);

        // CORREÇÃO AQUI: Usar .getId() em vez de .id()
        cursosMock.removeIf(c -> c.getId().equals(id));

        return ResponseEntity.noContent().build();
    }
}