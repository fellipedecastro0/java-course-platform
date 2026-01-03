// ==========================================
// ADMIN DASHBOARD - ODONTOPRO LUXURY
// ==========================================

const API_URL = "http://localhost:8081";

document.addEventListener("DOMContentLoaded", () => {
    fetchDashboardStats();
    fetchAdminCourses();
    setupLogout();
});

function setupLogout() {
    const btn = document.getElementById("btn-logout"); // Adicione um ID no botão de sair do admin se não tiver
    if(btn) {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = "/auth/login.html";
        });
    }
}

async function fetchDashboardStats() {
    // Mock de estatísticas (futuramente virá do back)
    const elS = document.getElementById("total-students");
    const elC = document.getElementById("total-courses");
    if(elS) elS.textContent = "1.240";
    if(elC) elC.textContent = "8";
}

async function fetchAdminCourses() {
    const tbody = document.getElementById("courses-table-body");
    if (!tbody) return;

    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/auth/login.html"; return; }

    try {
        const res = await fetch(`${API_URL}/courses`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.status === 403 || res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/auth/login.html";
            return;
        }

        const courses = await res.json();
        tbody.innerHTML = "";

        if (!courses.length) {
            tbody.innerHTML = `<tr><td colspan="4" class="text-center py-8 text-gray-500 text-xs uppercase">Nenhum curso cadastrado.</td></tr>`;
            return;
        }

        courses.forEach(c => {
            tbody.innerHTML += `
                <tr class="border-b border-gray-800 hover:bg-white/5 transition-colors group">
                    <td class="px-8 py-6 whitespace-nowrap">
                        <div class="flex items-center">
                            <div class="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold border border-yellow-500/30">
                                ${c.title.charAt(0)}
                            </div>
                            <div class="ml-4">
                                <div class="text-sm font-bold text-yellow-500">${c.title}</div>
                                <div class="text-[10px] text-green-500 uppercase font-bold mt-1">Ativo</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-8 py-6 whitespace-nowrap text-sm text-gray-400">${c.category || 'Geral'}</td>
                    <td class="px-8 py-6 whitespace-nowrap text-sm font-medium text-white">R$ ${(c.price || 0).toFixed(2)}</td>
                    <td class="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                        <a href="/admin/gerenciar-aulas.html?id=${c.id}&title=${encodeURIComponent(c.title)}" 
                           class="text-gold hover:text-white mr-4 transition-colors inline-flex items-center gap-2 border border-gold/30 px-3 py-1 rounded hover:bg-gold hover:text-black" 
                           title="Adicionar Aulas">
                           <i class="fas fa-layer-group"></i> Aulas
                        </a>
                        
                        <button onclick="deleteCourse(${c.id})" class="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-red-500/10 transition-colors">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>`;
        });
    } catch (e) {
        console.error(e);
        tbody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-red-500">Erro de conexão com o servidor.</td></tr>`;
    }
}

async function deleteCourse(id) {
    if (!confirm("Tem certeza que deseja excluir este curso permanentemente?")) return;

    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${API_URL}/courses/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
            // UX: Feedback Visual
            if(typeof UI !== 'undefined') UI.toast.success("Curso excluído com sucesso!");
            fetchAdminCourses();
        } else {
            alert("Erro ao excluir. Verifique se o curso possui alunos matriculados.");
        }
    } catch (e) {
        alert("Erro de conexão.");
    }
}