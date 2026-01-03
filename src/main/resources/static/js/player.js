// ==========================================
// PLAYER DE VÍDEO (LADO DO ALUNO)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. Segurança Básica
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/auth/login.html"; return; }

    // 2. Captura dados da URL
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');
    const courseTitle = urlParams.get('title');

    // 3. Define Título da Página
    if (courseTitle) {
        const decodedTitle = decodeURIComponent(courseTitle);
        const titleEl = document.getElementById("course-title");
        if(titleEl) titleEl.textContent = decodedTitle;
        document.title = `${decodedTitle} | Sala de Aula`;
    }

    // 4. Carrega o Conteúdo (Criado pelo Admin)
    loadCourseContent(courseId);
});

function loadCourseContent(courseId) {
    // Tenta ler do LocalStorage (onde o Admin salvou)
    const savedData = localStorage.getItem(`course_content_${courseId}`);

    if (savedData) {
        const data = JSON.parse(savedData);
        if(data.modules && data.modules.length > 0) {
            renderPlayerSidebar(data.modules);

            // Auto-play na primeira aula do primeiro módulo
            const firstLesson = data.modules[0].lessons[0];
            if(firstLesson) {
                playVideo(firstLesson.videoId, firstLesson.title);
            }
        } else {
            showEmptyState();
        }
    } else {
        showEmptyState();
    }
}

function showEmptyState() {
    const sidebar = document.querySelector("aside");
    if(sidebar) {
        // Mantém o header, limpa o resto
        const header = sidebar.firstElementChild;
        sidebar.innerHTML = "";
        sidebar.appendChild(header);
        sidebar.innerHTML += `
            <div class="p-8 text-center opacity-50">
                <i class="fas fa-clock text-2xl mb-2 text-gold"></i>
                <p class="text-xs text-gray-400">Conteúdo em breve.</p>
            </div>
        `;
    }
}

function renderPlayerSidebar(modules) {
    const sidebar = document.querySelector("aside");
    // Mantém o header (onde diz "Conteúdo")
    const header = sidebar.firstElementChild;
    sidebar.innerHTML = "";
    if(header) sidebar.appendChild(header);

    // Conta total de aulas para exibir no topo
    let totalLessons = 0;
    modules.forEach(m => totalLessons += m.lessons.length);

    // Atualiza info do header se existir
    const infoText = sidebar.querySelector("p");
    if(infoText) infoText.textContent = `${modules.length} Módulos • ${totalLessons} Aulas`;

    modules.forEach((mod, index) => {
        let lessonsHtml = "";

        mod.lessons.forEach(lesson => {
            // Cria o item da aula
            lessonsHtml += `
                <div onclick="playVideo('${lesson.videoId}', '${lesson.title}', this)" 
                     class="lesson-item p-4 flex gap-3 items-center cursor-pointer hover:bg-white/5 transition group opacity-70 hover:opacity-100 border-l-2 border-transparent hover:border-gold">
                    <i class="fas fa-play-circle text-gray-500 text-sm group-hover:text-gold transition"></i>
                    <div>
                        <p class="text-sm text-gray-400 group-hover:text-white transition font-medium leading-tight">${lesson.title}</p>
                        <p class="text-[10px] text-gray-600 mt-0.5">Vídeo HD</p>
                    </div>
                </div>
            `;
        });

        // HTML do Módulo (Accordion aberto por padrão)
        const html = `
            <div class="border-b border-white/5">
                <div class="p-4 bg-[#1a1a1a] flex justify-between items-center cursor-default">
                    <span class="font-bold text-xs text-gray-300 uppercase tracking-wider">${mod.title}</span>
                    <i class="fas fa-chevron-down text-[10px] text-gray-600"></i>
                </div>
                <div class="bg-black/20">
                    ${lessonsHtml}
                </div>
            </div>
        `;
        sidebar.innerHTML += html;
    });
}

function playVideo(videoId, title, element) {
    // Atualiza o iframe
    const iframe = document.querySelector("iframe");
    if(iframe) {
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`;
    }

    // Atualiza título da aula na tela
    const titleEl = document.querySelector("main h2");
    if(titleEl) titleEl.textContent = title;

    // Gerencia classe "Ativa" visualmente na sidebar
    document.querySelectorAll(".lesson-item").forEach(el => {
        el.classList.remove("active-lesson", "opacity-100", "bg-white/5");
        el.classList.add("opacity-70");
    });

    if(element) {
        element.classList.add("active-lesson", "opacity-100", "bg-white/5");
        element.classList.remove("opacity-70");
    }
}