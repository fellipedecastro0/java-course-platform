package com.courseplatform.backend.service;


import com.courseplatform.backend.dto.LoginDTO;
import com.courseplatform.backend.dto.LoginResponseDTO;
import com.courseplatform.backend.entity.User;
import com.courseplatform.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService; // <--- Injetamos o novo serviço

    public LoginResponseDTO login(LoginDTO dto) {
        User user = repository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Senha Incorreta!");
        }

        // AGORA SIM: Gera o token real
        String token = tokenService.generateToken(user);

        return new LoginResponseDTO(
                token,
                user.getName(),
                user.getRole().toString()
        );
    }
}