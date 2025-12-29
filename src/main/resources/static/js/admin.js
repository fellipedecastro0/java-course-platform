document.addEventListener("DOMContentLoaded", () => {
    fetchDashboardStats();
    fetchAdminCourses();
});

// CONFIGURAÇÃO
const API_PREFIX = '';

// ==========================================
// 1. BUSCAR ESTATÍSTICAS (MOCK)
// ==========================================
async function fetchDashboardStats() {
    console.log("Iniciando dashboard...");
    const elStudents = document.getElementById("total-students");
    const elCourses = document.getElementById("total-courses");

    if(elStudents) elStudents.textContent = "1.240";
    if(elCourses) elCourses.textContent = "8";
}

// ==========================================
// 2. BUSCAR LISTA DE CURSOS
// ==========================================
async function fetchAdminCourses() {
    // Agora buscamos pelo ID específico que coloquei no HTML novo
    // Se não achar pelo ID, tenta pelo tbody genérico
    const tableBody = document.getElementById("courses-table-body") || document.querySelector("tbody");

    if (!tableBody) return;

    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("Nenhum token encontrado. Redirecionando...");
        alert("Você não está logado.");
        window.location.href = "/auth/login.html";
        return;
    }

    console.log(`[DEBUG] Tentando buscar cursos em: ${window.location.origin}${API_PREFIX}/courses`);

    try {
        const response = await fetch(`${API_PREFIX}/courses`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        console.log(`[DEBUG] Status da resposta: ${response.status}`);

        if (response.status === 401 || response.status === 403) {
            console.error("Token inválido ou expirado.");
            localStorage.removeItem("token");
            alert("Sessão expirada. Faça login novamente.");
            window.location.href = "/auth/login.html";
            return;
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro do servidor (${response.status}): ${errorText}`);
        }

        let courses;
        try {
            courses = await response.json();
        } catch (jsonError) {
            const rawText = await response.text();
            console.error("O servidor não retornou um JSON válido. Retornou:", rawText);
            throw new Error("A resposta do servidor não é um JSON válido.");
        }

        // Renderização
        tableBody.innerHTML = "";

        if (!Array.isArray(courses) || courses.length === 0) {
            // Mudei aqui para texto claro
            tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-8 text-gray-500 uppercase tracking-widest text-xs">Nenhum curso encontrado.</td></tr>`;
            return;
        }

        courses.forEach(course => {
            const price = parseFloat(course.price);

            // --- AQUI ESTÁ A MUDANÇA VISUAL (Sua lógica continua igual) ---
            const row = `
                <tr class="border-b border-gray-800 hover:bg-white/5 transition-colors group">
                    <td class="px-8 py-6 whitespace-nowrap">
                        <div class="flex items-center">
                            <div class="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold border border-yellow-500/30">
                                ${course.title ? course.title.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div class="ml-4">
                                <div class="text-sm font-bold text-yellow-500 group-hover:text-yellow-400 transition-colors">${course.title}</div>
                                <div class="text-[10px] text-green-500 uppercase tracking-wider mt-1 font-bold">Ativo</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-8 py-6 whitespace-nowrap text-sm text-gray-400">
                        ${course.category || 'Geral'}
                    </td>
                    <td class="px-8 py-6 whitespace-nowrap text-sm font-medium text-white">
                        R$ ${isNaN(price) ? '0.00' : price.toFixed(2)}
                    </td>
                    <td class="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                        <button onclick="deleteCourse(${course.id})" class="text-red-500 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-red-500/10" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error("ERRO FATAL:", error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-4 text-red-500">
                    <strong>Erro ao carregar dados:</strong><br>
                    ${error.message}
                </td>
            </tr>`;
    }
}

// ==========================================
// 3. DELETAR CURSO (LÓGICA ORIGINAL)
// ==========================================
async function deleteCourse(id) {
    if (!confirm("Tem certeza que deseja excluir este curso?")) return;
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${API_PREFIX}/courses/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            alert("Curso excluído com sucesso!");
            fetchAdminCourses(); // Recarrega a lista
        } else {
            const err = await response.text();
            alert("Erro ao excluir: " + err);
        }
    } catch (e) {
        console.error("Erro de rede ao excluir:", e);
        alert("Erro de conexão.");
    }
}