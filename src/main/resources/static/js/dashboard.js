// ==========================================
// DASHBOARD ALUNO - ODONTOPRO LUXURY (COM MOCK DE PAGAMENTO)
// ==========================================

const API_URL = "http://localhost:8081";
let globalCourses = [];

document.addEventListener("DOMContentLoaded", () => {
    // 1. Mostra Skeletons
    renderSkeletons();

    // 2. Busca dados (com delay pequeno para ver a animação)
    setTimeout(() => {
        fetchStudentCourses();
    }, 1000);

    updateUserInfo();
    setupSearch();
    setupLogout();
});

function updateUserInfo() {
    const userName = localStorage.getItem("userName");
    const nameElement = document.getElementById("user-name-display");
    if (nameElement && userName) {
        nameElement.textContent = userName;
    }
}

// --- SIMULAÇÃO DE CHECKOUT (MERCADO PAGO) ---
async function startCheckout(courseId, courseTitle, price) {
    // 1. Feedback Visual (Loading)
    if (typeof UI !== 'undefined') {
        UI.toast.info("A conectar ao Mercado Pago...");
    } else {
        alert("A conectar ao Mercado Pago...");
    }

    // Simula o tempo de resposta do servidor (1.5s)
    await new Promise(r => setTimeout(r, 1500));

    // 2. Aqui entraria o fetch real para o backend do Felipe no futuro:
    /*
    const response = await fetch(`${API_URL}/payments/checkout`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: courseId })
    });
    const data = await response.json();
    window.location.href = data.paymentUrl; // Redireciona para o MP
    */

    // 3. MOCK: Redireciona para a página de sucesso fake
    console.log(`[MOCK] A iniciar pagamento para: ${courseTitle} (R$ ${price})`);

    // Redireciona passando o nome do curso na URL para exibir na tela de sucesso
    window.location.href = `/aluno/pagamento-sucesso.html?course=${encodeURIComponent(courseTitle)}`;
}

function renderSkeletons() {
    const container = document.getElementById("courses-grid");
    if (!container) return;

    container.innerHTML = "";

    const skeletonCard = `
        <div class="bg-[#111] border border-gray-800 flex flex-col h-full rounded-sm overflow-hidden">
            <div class="h-52 w-full skeleton border-b border-white/5"></div>
            <div class="p-8 flex flex-col flex-1 gap-4">
                <div class="h-8 w-3/4 skeleton rounded"></div>
                <div class="h-1 w-12 skeleton rounded my-2"></div>
                <div class="h-3 w-full skeleton rounded"></div>
                <div class="h-3 w-5/6 skeleton rounded"></div>
                <div class="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                    <div class="h-8 w-24 skeleton rounded"></div>
                    <div class="h-10 w-28 skeleton rounded"></div>
                </div>
            </div>
        </div>`;

    container.innerHTML = skeletonCard.repeat(3);
}

function setupLogout() {
    const btnLogout = document.getElementById("btn-logout");
    if (btnLogout) {
        btnLogout.addEventListener("click", (e) => {
            e.preventDefault();
            if (typeof UI !== 'undefined') UI.toast.info("A sair do sistema...");
            localStorage.removeItem("token");
            localStorage.removeItem("userRole");
            localStorage.removeItem("userName");
            setTimeout(() => window.location.href = "/auth/login.html", 1000);
        });
    }
}

function setupSearch() {
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const termo = e.target.value.toLowerCase();
            const cursosFiltrados = globalCourses.filter(course =>
                course.title.toLowerCase().includes(termo) ||
                (course.category && course.category.toLowerCase().includes(termo))
            );
            renderCourses(cursosFiltrados);
        });
    }
}

async function fetchStudentCourses() {
    const container = document.getElementById("courses-grid");
    if (!container) return;

    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/auth/login.html"; return; }

    try {
        const response = await fetch(`${API_URL}/courses`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.status === 403 || response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/auth/login.html";
            return;
        }

        globalCourses = await response.json();
        renderCourses(globalCourses);

    } catch (error) {
        console.error("Erro:", error);
        container.innerHTML = '<p class="text-red-500 col-span-full text-center">Erro de conexão.</p>';
    }
}

function renderCourses(coursesList) {
    const container = document.getElementById("courses-grid");
    container.innerHTML = "";

    if (!Array.isArray(coursesList) || coursesList.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-20 bg-white/5 rounded-lg border border-white/10 animate-fade-in">
                <i class="fas fa-search text-gray-600 text-4xl mb-4"></i>
                <p class="text-yellow-500 uppercase tracking-widest text-sm">Nenhum curso encontrado</p>
            </div>`;
        return;
    }

    coursesList.forEach(course => {
        const price = course.price ? parseFloat(course.price) : 0.00;

        // --- LÓGICA DO BOTÃO ---
        // Se já comprou (purchased=true), mostra "Assistir".
        // Se não, mostra "Comprar" que chama o startCheckout.
        const playerLink = `/aluno/player.html?id=${course.id}&title=${encodeURIComponent(course.title)}`;

        const actionButton = course.purchased
            ? `<a href="${playerLink}" class="px-6 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold uppercase tracking-widest transition-colors rounded-sm">Assistir</a>`
            : `<button onclick="startCheckout(${course.id}, '${course.title.replace(/'/g, "\\'")}', ${price})" class="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold uppercase tracking-widest transition-colors shadow-[0_0_15px_rgba(212,175,55,0.4)] rounded-sm">
                Comprar
              </button>`;

        const imgLink = course.imageUrl || course.image_url || course.imgUrl || "";
        const hasValidImage = imgLink && imgLink.startsWith("http");

        const coverContent = hasValidImage
            ? `<img src="${imgLink}" alt="${course.title}" 
                   class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0"
                   onerror="this.onerror=null; this.src='https://via.placeholder.com/400x200/333/fff?text=Imagem+Indispon%C3%ADvel';">`
            : `<div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
               <i class="fas fa-tooth absolute -bottom-8 -left-8 text-9xl text-yellow-500 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition duration-700"></i>`;

        const card = `
            <div class="bg-[#111] border border-gray-800 hover:border-yellow-500/50 flex flex-col h-full transition-all duration-300 group relative hover:-translate-y-2 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,1)] animate-fade-in">
                <div class="h-52 bg-neutral-900 relative overflow-hidden shrink-0 border-b border-white/5">
                    ${coverContent}
                    <span class="absolute top-4 right-4 bg-black/80 backdrop-blur-sm border border-yellow-500/50 text-yellow-500 text-[10px] font-bold px-3 py-1 uppercase tracking-widest z-10 shadow-lg">
                        ${course.category || 'Odonto'}
                    </span>
                </div>
                <div class="p-8 flex flex-col flex-1 relative">
                    <h3 class="text-xl font-serif text-yellow-500 mb-3 leading-tight line-clamp-2 cursor-default" title="${course.title}">
                        ${course.title}
                    </h3>
                    <div class="w-12 h-0.5 bg-yellow-500/50 mb-4"></div>
                    <p class="text-gray-400 text-sm font-light leading-relaxed mb-8 flex-1 line-clamp-3">
                       ${course.description || 'Conteúdo exclusivo OdontoPro.'}
                    </p>
                    <div class="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                        <div>
                            <p class="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Investimento</p>
                            <p class="text-2xl font-serif text-white group-hover:text-yellow-500 transition-colors">
                                R$ ${price.toFixed(2)}
                            </p>
                        </div>
                        <div>${actionButton}</div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}