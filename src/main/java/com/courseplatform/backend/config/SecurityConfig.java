package com.courseplatform.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Habilita o CORS configurado abaixo
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        // ====================================================
                        // 1. ZONA VERDE (ARQUIVOS PÚBLICOS & FRONTEND)
                        // ====================================================
                        // Libera geral para arquivos estáticos e páginas HTML
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/error",         // IMPORTANTE: Libera a página de erro do Spring
                                "/favicon.ico",
                                "/auth/**",       // Páginas de Login/Cadastro
                                "/aluno/**",      // Páginas do Aluno (HTML)
                                "/admin/**",      // Páginas do Admin (HTML)
                                "/js/**",         // Scripts
                                "/css/**",        // Estilos
                                "/images/**",     // Imagens
                                "/assets/**"
                        ).permitAll()

                        // ====================================================
                        // 2. API PÚBLICA (ENDPOINTS DE AÇÃO)
                        // ====================================================
                        // Permite Login e Cadastro sem token
                        .requestMatchers(HttpMethod.POST, "/auth/login", "/auth/register", "/users").permitAll()

                        // ====================================================
                        // 3. ZONA RESTRITA (DADOS DO SISTEMA)
                        // ====================================================
                        // Todo o resto (ex: GET /courses, POST /courses) exige Token
                        .anyRequest().authenticated()
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    // Configuração Global de CORS (Evita erros de conexão entre Front e Back)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*")); // Permite qualquer origem (localhost, ip, etc)
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*")); // Permite todos os headers (Authorization, Content-Type)
        configuration.setAllowCredentials(false); // false quando allowedOrigins é *

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}