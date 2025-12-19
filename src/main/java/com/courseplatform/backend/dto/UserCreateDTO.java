package com.courseplatform.backend.dto;
import lombok.Data;

@Data
public class UserCreateDTO {
    private String name;
    private String email;
    private String password;
}

