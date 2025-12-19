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

    public LoginResponseDTO login(LoginDTO dto) {
        User user = repository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Senha Incorreta!");
        }

        return new LoginResponseDTO(
                "TOKEN_FALSO_POR_ENQUANTO",
                user.getName(),
                user.getRole().toString()
        );    }
}
