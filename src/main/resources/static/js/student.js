// ==========================================
// JS DA ÁREA DO ALUNO (BIBLIOTECA)
// ==========================================
const API_URL = "http://localhost:8081";

document.addEventListener("DOMContentLoaded", () => {
    updateUserInfo();
    setupLogout();
    fetchMyLibrary();
});

async function fetchMyLibrary() {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/auth/login.html"; return; }

    const container = document.getElementById("my-courses-grid");
    container.innerHTML = `<p class="text-gray-500 text-sm">Carregando sua biblioteca...</p>`;

    try {
        // 1. Busca TODOS os cursos do backend
        const res = await fetch(`${API_URL}/courses`, { headers: { "Authorization": `Bearer ${token}` } });
        const allCourses = await res.json();

        // 2. Lê quais eu comprei do LocalStorage
        const myCourseIds = JSON.parse(localStorage.getItem("my_courses") || "[]");

        // 3. FILTRA: Só mostro o que eu tenho ID
        // (Nota: Se for admin ou teste, podemos forçar mostrar todos descomentando a linha abaixo)
        // const myLibrary = allCourses;
        const myLibrary = allCourses.filter(c => myCourseIds.includes(c.id));

        renderLibrary(myLibrary);

    } catch (e) { console.error(e); }
}

function renderLibrary(list) {
    const container = document.getElementById("my-courses-grid");
    container.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-20 border border-dashed border-gray-700 rounded">
                <i class="fas fa-box-open text-gray-600 text-4xl mb-4"></i>
                <p class="text-gray-400 mb-4">Você ainda não tem cursos.</p>
                <a href="/aluno/catalogo.html" class="text-gold hover:underline uppercase text-xs font-bold tracking-widest">Ir para a Loja</a>
            </div>`;
        return;
    }

    list.forEach(c => {
        const imgLink = c.imageUrl || c.image_url || "";
        const hasImg = imgLink.startsWith("http");
        const cover = hasImg ? `<img src="${imgLink}" class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition duration-500">` : ``;

        const html = `
            <div class="group relative bg-[#111] border border-white/5 hover:border-gold/50 transition h-64 overflow-hidden flex flex-col justify-end">
                <div class="absolute inset-0 z-0">${cover}</div>
                <div class="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10"></div>
                
                <div class="relative z-20 p-6">
                    <h3 class="text-xl font-serif text-white mb-1 group-hover:text-gold transition">${c.title}</h3>
                    <div class="w-full bg-gray-800 h-1 mt-3 mb-4 rounded-full overflow-hidden">
                        <div class="bg-gold h-full w-0 group-hover:w-1/3 transition-all duration-1000"></div> </div>
                    <a href="/aluno/player.html?id=${c.id}&title=${encodeURIComponent(c.title)}" class="inline-flex items-center text-xs font-bold uppercase tracking-widest text-white hover:text-gold transition">
                        <i class="fas fa-play mr-2"></i> Assistir Agora
                    </a>
                </div>
            </div>`;
        container.innerHTML += html;
    });
}

function updateUserInfo() {
    const n = localStorage.getItem("userName");
    if(document.getElementById("user-name-display")) document.getElementById("user-name-display").textContent = n;
}
function setupLogout() {
    document.getElementById("btn-logout").addEventListener("click", (e) => {
        e.preventDefault(); localStorage.clear(); window.location.href="/auth/login.html";
    });
}