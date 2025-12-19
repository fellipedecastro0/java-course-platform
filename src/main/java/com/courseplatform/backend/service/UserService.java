package com.courseplatform.backend.service;

import com.courseplatform.backend.Role;
import com.courseplatform.backend.dto.UserCreateDTO;
import com.courseplatform.backend.entity.User;
import com.courseplatform.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public User registerUser(UserCreateDTO dto) {
        if (repository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Erro: Email já cadastrado no sistema!");
        }

        User newUser = new User();
        newUser.setName(dto.getName());
        newUser.setEmail(dto.getEmail());
        String senhaCriptografada = passwordEncoder.encode(dto.getPassword());

        newUser.setPasswordHash(senhaCriptografada);

        newUser.setRole(Role.STUDENT);

        return repository.save(newUser);
    }
}