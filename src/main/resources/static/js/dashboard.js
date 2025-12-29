// ==========================================
// LÓGICA DO ALUNO (MEUS CURSOS)
// ==========================================
const API_URL = "http://localhost:8081"; // Ou apenas "" se estiver na mesma porta

document.addEventListener("DOMContentLoaded", () => {
    fetchStudentCourses();
    updateUserInfo();
});

// Atualiza o nome do aluno na Navbar (se existir o elemento)
function updateUserInfo() {
    const userName = localStorage.getItem("userName");
    const nameElement = document.getElementById("user-name-display");
    if (nameElement && userName) {
        nameElement.textContent = userName;
    }
}

async function fetchStudentCourses() {
    const container = document.getElementById("courses-grid");

    // Se não achar o grid, não faz nada (pode estar em outra página)
    if (!container) return;

    const token = localStorage.getItem("token");

    // 1. Sem token? Tchau! 👋
    if (!token) {
        alert("Você precisa estar logado.");
        window.location.href = "/auth/login.html";
        return;
    }

    try {
        console.log("Buscando cursos para o aluno...");

        // 2. A Chamada Protegida (Com Token) 🛡️
        const response = await fetch(`${API_URL}/courses`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // <--- OBRIGATÓRIO PARA NÃO DAR 403
                "Content-Type": "application/json"
            }
        });

        // 3. Tratamento de Erro de Segurança
        if (response.status === 403 || response.status === 401) {
            console.error("Token rejeitado pelo Backend (403/401).");
            localStorage.removeItem("token"); // Limpa o token podre
            alert("Sessão expirada. Por favor, faça login novamente.");
            window.location.href = "/auth/login.html";
            return;
        }

        const courses = await response.json();

        // Limpa o "Carregando..."
        container.innerHTML = "";

        if (!Array.isArray(courses) || courses.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-10">
                    <i class="fas fa-box-open text-gray-300 text-5xl mb-4"></i>
                    <p class="text-gray-500">Nenhum curso disponível no momento.</p>
                </div>`;
            return;
        }

        // 4. Renderiza os Cards (Visual do Aluno)
        courses.forEach(course => {
            // Garante que o preço seja número
            const price = course.price ? parseFloat(course.price) : 0.00;

            const card = `
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden hover:-translate-y-1 transition-transform duration-300 border border-gray-100">
                    <div class="h-40 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center relative">
                        <i class="fas fa-graduation-cap text-white text-5xl opacity-40"></i>
                        <span class="absolute bottom-2 right-2 bg-white/20 text-white text-xs px-2 py-1 rounded">
                            ${course.category || 'Geral'}
                        </span>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-gray-900 mb-2">${course.title}</h3>
                        <p class="text-sm text-gray-500 mb-4 line-clamp-2">
                           Um curso excelente para sua especialização em ${course.category || 'Odontologia'}.
                        </p>
                        
                        <div class="flex justify-between items-center mt-4">
                            <span class="text-blue-600 font-bold">R$ ${price.toFixed(2)}</span>
                            <a href="#" onclick="alert('Funcionalidade de Assistir em breve!')" class="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition">
                                <i class="fas fa-play mr-2"></i> Ver Detalhes
                            </a>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += card;
        });

    } catch (error) {
        console.error("Erro ao carregar cursos:", error);
        container.innerHTML = '<p class="text-red-500 col-span-full text-center">Erro de conexão com o servidor.</p>';
    }
}