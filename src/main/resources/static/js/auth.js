// ==========================================
// CONFIGURAÇÃO CENTRAL
// ==========================================
const BASE_URL = "http://localhost:8081";

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. LÓGICA DE LOGIN
    // ==========================================
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // Impede o reload da página

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            const errorContainer = document.getElementById("error-container");
            const errorMessage = document.getElementById("error-message");

            // Limpa erros visuais anteriores
            if (errorContainer) errorContainer.classList.add("hidden");

            try {
                console.log(`Tentando login em: ${BASE_URL}/auth/login`);

                const response = await fetch(`${BASE_URL}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                if (!response.ok) {
                    throw new Error("Credenciais inválidas");
                }

                const data = await response.json();

                // --- 🕵️‍♂️ ÁREA DE INVESTIGAÇÃO (DEBUG) ---
                console.log("====================================");
                console.log("1. O QUE O JAVA RESPONDEU (JSON COMPLETO):", data);
                console.log("2. CAMPO 'ROLE' VEIO COMO:", data.role);
                // ------------------------------------------------

                // Salva Token e Dados no Navegador
                localStorage.setItem("token", data.token);
                // Se a role vier nula, salva string vazia para não quebrar
                localStorage.setItem("userRole", data.role || "");
                localStorage.setItem("userName", data.name);

                // Lógica de Redirecionamento (Aceita ADMIN ou ROLE_ADMIN)
                const role = data.role ? data.role.toUpperCase().trim() : "";

                console.log("3. ROLE PROCESSADA PELO JS:", `"${role}"`); // Aspas para ver se tem espaço

                if (role === 'ADMIN' || role === 'ROLE_ADMIN') {
                    console.log("👉 DECISÃO: Indo para ADMIN");
                    window.location.href = "/admin/dashboard.html";
                } else {
                    console.log("👉 DECISÃO: Indo para ALUNO (Caiu no else)");
                    window.location.href = "/aluno/meus-cursos.html";
                }
                console.log("====================================");

            } catch (error) {
                console.error("Erro no login:", error);
                if (errorMessage) errorMessage.textContent = "Email ou senha incorretos.";
                if (errorContainer) errorContainer.classList.remove("hidden");
            }
        });
    }

    // ==========================================
    // 2. LÓGICA DE CADASTRO
    // ==========================================
    const cadastroForm = document.getElementById("cadastro-form");

    if (cadastroForm) {
        cadastroForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nomeInput = document.getElementById("nome").value.trim();
            const emailInput = document.getElementById("email").value.trim();
            const senhaInput = document.getElementById("senha").value;
            const confirmaSenhaInput = document.getElementById("confirma_senha").value;

            if (senhaInput !== confirmaSenhaInput) {
                alert("As senhas não coincidem!");
                return;
            }

            const payload = {
                name: nomeInput,
                email: emailInput,
                password: senhaInput,
                role: "USER"
            };

            try {
                console.log("Enviando cadastro para:", `${BASE_URL}/users`);

                const response = await fetch(`${BASE_URL}/users`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    alert("Conta criada com sucesso! 🎉\nVocê será redirecionado para o login.");
                    window.location.href = "/auth/login.html";
                } else {
                    const errorText = await response.text();
                    console.error("Erro do servidor:", errorText);
                    alert("Erro ao cadastrar: " + errorText);
                }

            } catch (error) {
                console.error("Erro de conexão:", error);
                alert("Não foi possível conectar ao servidor.");
            }
        });
    }
});