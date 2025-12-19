package com.courseplatform.backend.controller;

import com.courseplatform.backend.dto.UserCreateDTO;
import com.courseplatform.backend.entity.User;
import com.courseplatform.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService service;

    @PostMapping
    public ResponseEntity<User> createUser (@RequestBody UserCreateDTO dto) {

        User newUser = service.registerUser(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }
}
