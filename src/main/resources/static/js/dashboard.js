// ==========================================
// LÓGICA DO ALUNO (MEUS CURSOS) - LUXURY IMAGE EDITION
// ==========================================
const API_URL = "http://localhost:8081";

document.addEventListener("DOMContentLoaded", () => {
    fetchStudentCourses();
    updateUserInfo();
});

function updateUserInfo() {
    const userName = localStorage.getItem("userName");
    const nameElement = document.getElementById("user-name-display");
    if (nameElement && userName) {
        nameElement.textContent = userName;
    }
}

async function fetchStudentCourses() {
    const container = document.getElementById("courses-grid");
    if (!container) return;

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/auth/login.html";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/courses`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.status === 403 || response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/auth/login.html";
            return;
        }

        const courses = await response.json();
        container.innerHTML = "";

        if (!Array.isArray(courses) || courses.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-20 border border-white/10 rounded-lg bg-white/5">
                    <p class="text-yellow-500 uppercase tracking-widest text-sm">Nenhum curso disponível</p>
                </div>`;
            return;
        }

        // --- RENDERIZAÇÃO DOS CARDS COM IMAGEM ---
        courses.forEach(course => {
            const price = course.price ? parseFloat(course.price) : 0.00;

            // Lógica do Botão
            const actionButton = course.purchased
                ? `<a href="#" class="px-6 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold uppercase tracking-widest transition-colors rounded-sm">Assistir</a>`
                : `<a href="#" onclick="alert('Checkout em breve')" class="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold uppercase tracking-widest transition-colors shadow-[0_0_15px_rgba(212,175,55,0.4)] rounded-sm">
                    Comprar
                  </a>`;

            // --- LÓGICA DA IMAGEM DE CAPA ---
            // Se tiver URL, usa a imagem com efeito de brilho no hover.
            // Se não tiver, usa o gradiente padrão com o ícone de dente.
            const coverContent = course.imageUrl
                ? `<img src="${course.imageUrl}" alt="${course.title}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0">`
                : `<div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
                   <i class="fas fa-tooth absolute -bottom-8 -left-8 text-9xl text-yellow-500 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition duration-700"></i>`;


            const card = `
                <div class="bg-[#111] border border-gray-800 hover:border-yellow-500/50 flex flex-col h-full transition-all duration-300 group relative hover:-translate-y-2 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,1)]">
                    
                    <div class="h-52 bg-neutral-900 relative overflow-hidden shrink-0 border-b border-white/5">
                        ${coverContent}
                        
                        <span class="absolute top-4 right-4 bg-black/80 backdrop-blur-sm border border-yellow-500/50 text-yellow-500 text-[10px] font-bold px-3 py-1 uppercase tracking-widest z-10 shadow-lg">
                            ${course.category || 'Odonto'}
                        </span>
                    </div>

                    <div class="p-8 flex flex-col flex-1 relative">
                        <h3 class="text-xl font-serif text-yellow-500 mb-3 leading-tight line-clamp-2 group-hover:text-white transition-colors cursor-default" title="${course.title}">
                            ${course.title}
                        </h3>
                        
                        <div class="w-12 h-0.5 bg-yellow-500/50 mb-4"></div>

                        <p class="text-gray-400 text-sm font-light leading-relaxed mb-8 flex-1 line-clamp-3">
                           ${course.description || 'Conteúdo exclusivo OdontoPro. Domine a técnica e eleve seu faturamento.'}
                        </p>
                        
                        <div class="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                            <div>
                                <p class="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Investimento</p>
                                <p class="text-2xl font-serif text-white group-hover:text-yellow-500 transition-colors">
                                    R$ ${price.toFixed(2)}
                                </p>
                            </div>

                            <div>
                                ${actionButton}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += card;
        });

    } catch (error) {
        console.error("Erro:", error);
        container.innerHTML = '<p class="text-red-500 col-span-full text-center">Erro de conexão.</p>';
    }
}