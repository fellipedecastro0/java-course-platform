// ==========================================
// JS DA LOJA (CATÁLOGO)
// ==========================================
const API_URL = "http://localhost:8081";
let globalCourses = [];

document.addEventListener("DOMContentLoaded", () => {
    renderSkeletons();
    updateUserInfo();
    setupLogout();
    fetchCatalog();
    setupSearch();
});

// Busca TODOS os cursos do Backend
async function fetchCatalog() {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/auth/login.html"; return; }

    try {
        const res = await fetch(`${API_URL}/courses`, { headers: { "Authorization": `Bearer ${token}` } });
        globalCourses = await res.json();

        // Pega lista de cursos JÁ COMPRADOS do LocalStorage
        const myCourses = JSON.parse(localStorage.getItem("my_courses") || "[]");

        renderCatalog(globalCourses, myCourses);
    } catch (e) { console.error(e); }
}

function renderCatalog(list, myCourses) {
    const container = document.getElementById("courses-grid");
    container.innerHTML = "";

    list.forEach(c => {
        // Verifica se eu já tenho esse curso
        const iOwnIt = myCourses.includes(c.id);

        const imgLink = c.imageUrl || c.image_url || "";
        const hasImg = imgLink.startsWith("http");
        const cover = hasImg ? `<img src="${imgLink}" class="w-full h-full object-cover">` : `<div class="w-full h-full bg-gray-800 flex items-center justify-center"><i class="fas fa-tooth text-4xl text-gray-700"></i></div>`;

        // Se já tenho: Botão Cinza "Adquirido". Se não: Botão Dourado "Comprar"
        const btn = iOwnIt
            ? `<button disabled class="w-full py-3 bg-gray-800 text-gray-400 text-xs font-bold uppercase tracking-widest cursor-not-allowed">Já Adquirido</button>`
            : `<button onclick="buyCourse(${c.id}, '${c.title}')" class="w-full py-3 bg-gold hover:bg-yellow-500 text-black text-xs font-bold uppercase tracking-widest transition shadow-lg">Comprar - R$ ${c.price}</button>`;

        const html = `
            <div class="bg-dark-800 border border-white/5 hover:border-gold/30 transition group flex flex-col h-full">
                <div class="h-48 relative overflow-hidden">${cover}</div>
                <div class="p-6 flex flex-col flex-1">
                    <div class="text-[10px] text-gold uppercase tracking-widest mb-2">${c.category || 'Curso'}</div>
                    <h3 class="text-lg font-serif text-white mb-2">${c.title}</h3>
                    <p class="text-gray-500 text-xs line-clamp-3 mb-6 flex-1">${c.description || 'Sem descrição.'}</p>
                    <div class="mt-auto">${btn}</div>
                </div>
            </div>`;
        container.innerHTML += html;
    });
}

// Simula a Compra e SALVA a posse do curso
async function buyCourse(id, title) {
    UI.toast.info("Processando pagamento...");
    await new Promise(r => setTimeout(r, 1500)); // Delay fake

    // 1. Salva que comprei o ID X
    const myCourses = JSON.parse(localStorage.getItem("my_courses") || "[]");
    if(!myCourses.includes(id)) {
        myCourses.push(id);
        localStorage.setItem("my_courses", JSON.stringify(myCourses));
    }

    // 2. Redireciona
    window.location.href = `/aluno/pagamento-sucesso.html?course=${encodeURIComponent(title)}`;
}

// ... (Inclua aqui as funções setupSearch, updateUserInfo, setupLogout e renderSkeletons iguais ao dashboard.js anterior) ...
function updateUserInfo() {
    const n = localStorage.getItem("userName");
    if(document.getElementById("user-name-display")) document.getElementById("user-name-display").textContent = n;
}
function setupLogout() {
    document.getElementById("btn-logout").addEventListener("click", (e) => {
        e.preventDefault(); localStorage.clear(); window.location.href="/auth/login.html";
    });
}
function renderSkeletons() { /* ... código skeleton ... */ }
function setupSearch() {
    document.getElementById("search-input").addEventListener("input", (e) => {
        const term = e.target.value.toLowerCase();
        const myCourses = JSON.parse(localStorage.getItem("my_courses") || "[]");
        const filtered = globalCourses.filter(c => c.title.toLowerCase().includes(term));
        renderCatalog(filtered, myCourses);
    });
}