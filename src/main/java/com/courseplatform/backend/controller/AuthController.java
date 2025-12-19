package com.courseplatform.backend.controller;


import com.courseplatform.backend.dto.LoginDTO;
import com.courseplatform.backend.dto.LoginResponseDTO;
import com.courseplatform.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth") // Prefixo da rota
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    @PostMapping("/login") // Rota final: /auth/login
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginDTO dto) {
        LoginResponseDTO response = authService.login(dto);
        return ResponseEntity.ok(response);
    }
}
