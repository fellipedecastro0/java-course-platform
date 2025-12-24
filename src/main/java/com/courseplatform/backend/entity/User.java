package com.courseplatform.backend.entity;

import com.courseplatform.backend.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tb_users")
public class User implements UserDetails { // <--- 1. AQUI: Assinamos o contrato!

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // --- 2. O QUE O SPRING OBRIGA A GENTE A COLOCAR  ---
    // Isso aqui é só pro Spring saber ler seus dados

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Traduz o seu ENUM para o que o Spring entende
        if (this.role == Role.ADMIN) return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("ROLE_USER"));
        else return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return passwordHash; // Ensina pro Spring que a senha tá nesse campo
    }

    @Override
    public String getUsername() {
        return email; // Ensina pro Spring que o login é o email
    }

    @Override
    public boolean isAccountNonExpired() { return true; } // Conta nunca expira

    @Override
    public boolean isAccountNonLocked() { return true; } // Conta nunca bloqueia

    @Override
    public boolean isCredentialsNonExpired() { return true; } // Senha nunca vence

    @Override
    public boolean isEnabled() {
        return isActive != null ? isActive : true; // Usa o seu campo isActive!
    }
}