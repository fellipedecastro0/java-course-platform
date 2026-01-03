// ==========================================
// GERENCIADOR DE CONTEÚDO (FRONTEND MOCK)
// ==========================================

const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('id');
const courseTitle = urlParams.get('title');

let courseData = {
    modules: []
};

// --- INICIALIZAÇÃO ---
document.addEventListener("DOMContentLoaded", () => {
    // Validação básica de acesso
    if (!courseId) {
        window.location.href = "/admin/dashboard.html";
        return;
    }

    // Atualiza título na tela
    const displayTitle = document.getElementById("course-title-display");
    if(displayTitle && courseTitle) {
        displayTitle.textContent = decodeURIComponent(courseTitle);
    }

    // Tenta carregar dados salvos anteriormente (LocalStorage)
    loadFromStorage();

    // Configura o formulário
    setupForm();
});

let activeModuleIndex = null;

// --- FUNÇÕES DE DADOS ---

function loadFromStorage() {
    const savedData = localStorage.getItem(`course_content_${courseId}`);
    if (savedData) {
        try {
            courseData = JSON.parse(savedData);
        } catch (e) {
            console.error("Erro ao ler dados salvos", e);
            courseData = { modules: [] };
        }
    }
    renderModules();
}

function addModule() {
    const title = prompt("Digite o nome do novo Módulo:");
    if (title && title.trim() !== "") {
        courseData.modules.push({
            title: title.trim(),
            lessons: []
        });
        renderModules();

        // Seleciona automaticamente o módulo criado
        selectModule(courseData.modules.length - 1);

        UI.toast.success("Módulo criado com sucesso!");
    }
}

function removeModule(e, index) {
    e.stopPropagation(); // Impede que o clique abra o módulo ao mesmo tempo que deleta
    if(confirm("Tem certeza? Isso apagará todas as aulas deste módulo.")) {
        courseData.modules.splice(index, 1);

        // Se apagou o módulo ativo, reseta a tela
        if (activeModuleIndex === index) {
            activeModuleIndex = null;
            document.getElementById("empty-state").classList.remove("hidden");
            document.getElementById("editor-area").classList.add("hidden");
        }

        renderModules();
    }
}

function removeLesson(modIndex, lessonIndex) {
    if(confirm("Remover esta aula?")) {
        courseData.modules[modIndex].lessons.splice(lessonIndex, 1);
        renderModules();
    }
}

// --- FUNÇÕES DE RENDERIZAÇÃO (UI) ---

function renderModules() {
    const container = document.getElementById("modules-list");
    container.innerHTML = "";

    if (courseData.modules.length === 0) {
        container.innerHTML = `
            <div class="text-center py-10 opacity-50">
                <i class="fas fa-box-open text-2xl mb-2"></i>
                <p class="text-xs">Nenhum módulo criado.</p>
            </div>`;
        return;
    }

    courseData.modules.forEach((mod, index) => {
        const isActive = index === activeModuleIndex;

        let lessonsHtml = "";
        if (mod.lessons && mod.lessons.length > 0) {
            mod.lessons.forEach((lesson, lIndex) => {
                lessonsHtml += `
                    <div class="flex justify-between items-center text-xs text-gray-400 py-2 pl-4 border-l border-gray-800 ml-2 hover:text-white hover:border-gold transition group">
                        <span class="truncate pr-2"><i class="fas fa-play-circle mr-2 text-[10px] text-gray-600 group-hover:text-gold"></i> ${lesson.title}</span>
                        <i onclick="removeLesson(${index}, ${lIndex})" class="fas fa-times text-red-500 opacity-0 group-hover:opacity-100 cursor-pointer p-1"></i>
                    </div>
                `;
            });
        } else {
            lessonsHtml = `<p class="text-[10px] text-gray-600 italic pl-6 py-2">Nenhuma aula adicionada.</p>`;
        }

        const activeClass = isActive ? 'bg-white/5 border-l-2 border-gold shadow-lg' : 'border-l-2 border-transparent opacity-70 hover:opacity-100';

        const html = `
            <div class="bg-panel rounded mb-2 overflow-hidden transition-all duration-300">
                <div onclick="selectModule(${index})" class="p-4 cursor-pointer flex justify-between items-center ${activeClass}">
                    <span class="font-bold text-sm text-gray-200 truncate w-3/4">${mod.title}</span>
                    <div class="flex items-center gap-3">
                        <span class="text-[10px] bg-black px-2 py-0.5 rounded text-gray-500 font-mono">${mod.lessons.length}</span>
                        <i onclick="removeModule(event, ${index})" class="fas fa-trash text-xs text-gray-700 hover:text-red-500 transition"></i>
                    </div>
                </div>
                
                <div class="bg-black/40 border-t border-white/5 ${isActive ? 'block' : 'hidden'} p-2 animation-fade-in">
                    ${lessonsHtml}
                </div>
            </div>
        `;
        container.innerHTML += html;
    });
}

function selectModule(index) {
    activeModuleIndex = index;
    renderModules(); // Re-renderiza para atualizar estilos de ativo/inativo

    // Mostra a área de edição
    document.getElementById("empty-state").classList.add("hidden");
    document.getElementById("editor-area").classList.remove("hidden");

    // Atualiza nome no formulário
    document.getElementById("current-module-name").textContent = courseData.modules[index].title;
}

// --- FORMULÁRIO E SAVE ---

function setupForm() {
    document.getElementById("add-lesson-form").addEventListener("submit", (e) => {
        e.preventDefault();

        if (activeModuleIndex === null) {
            UI.toast.error("Selecione um módulo primeiro.");
            return;
        }

        const titleInput = document.getElementById("lesson-title");
        const urlInput = document.getElementById("lesson-url");

        const title = titleInput.value.trim();
        const url = urlInput.value.trim();

        if (!title || !url) {
            UI.toast.error("Preencha todos os campos.");
            return;
        }

        // Extração Robusta do ID do YouTube
        let videoId = null;
        try {
            if (url.includes("v=")) {
                videoId = url.split("v=")[1].split("&")[0];
            } else if (url.includes("youtu.be/")) {
                videoId = url.split("youtu.be/")[1].split("?")[0];
            } else if (url.length === 11) {
                // Caso o usuário cole só o ID
                videoId = url;
            }
        } catch(err) {
            console.error(err);
        }

        if (!videoId) {
            UI.toast.error("Link do YouTube inválido.");
            return;
        }

        // Adiciona ao array na memória
        courseData.modules[activeModuleIndex].lessons.push({
            title: title,
            videoId: videoId,
            duration: "Aula" // Mock
        });

        // Limpa form e foca no título para a próxima adição rápida
        titleInput.value = "";
        urlInput.value = "";
        titleInput.focus();

        renderModules();
        UI.toast.success("Aula adicionada à lista!");
    });
}

function saveChanges() {
    // Salva no LocalStorage (Persistência)
    const key = `course_content_${courseId}`;
    localStorage.setItem(key, JSON.stringify(courseData));

    UI.toast.success("Conteúdo salvo e publicado para os alunos!");
}