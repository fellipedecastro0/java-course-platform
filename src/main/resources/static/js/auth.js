const API_URL = "http://localhost:8080";
document.addEventListener("DOMContentLoaded", () => {
    // LÓGICA DE LOGIN

    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault(); 

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const errorContainer = document.getElementById("error-container");
            const errorMessage = document.getElementById("error-message");

            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Sucesso! 🟢
                    console.log("Token recebido:", data.token);
                    
                    // Salva o crachá no navegador
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("userRole", data.role);
                    localStorage.setItem("userName", data.name);

                    alert(`Bem-vindo, ${data.name}! Login realizado.`);
                    // window.location.href = "/index.html"; // Redirecionar depois
                } else {
                    // Erro! 🔴
                    errorMessage.textContent = "Email ou senha incorretos.";
                    errorContainer.classList.remove("hidden");
                }
            } catch (error) {
                console.error("Erro:", error);
                alert("Não foi possível conectar ao servidor.");
            }
        });
    }

    // ==========================================
    // LÓGICA DE CADASTRO
    // ==========================================
    const cadastroForm = document.getElementById("cadastro-form");

    if (cadastroForm) {
        cadastroForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const nome = document.getElementById("nome").value;
            const email = document.getElementById("email").value;
            const senha = document.getElementById("senha").value;
            const confirmaSenha = document.getElementById("confirma_senha").value;

            if (senha !== confirmaSenha) {
                alert("As senhas não coincidem!");
                return;
            }

            try {
                const response = await fetch(`${API_URL}/users`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: nome,
                        email: email,
                        password: senha
                    })
                });

                if (response.ok) {
                    alert("Conta criada com sucesso! 🎉 Redirecionando para o login...");
                    window.location.href = "login.html";
                } else {
                    alert("Erro ao cadastrar. Verifique os dados.");
                }
            } catch (error) {
                console.error("Erro:", error);
                alert("Erro de conexão.");
            }
        });
    }
});