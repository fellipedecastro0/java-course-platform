// ==========================================
// UTILITÁRIOS DE UX - ODONTOPRO LUXURY
// ==========================================

const UI = {
    // 1. Notificações Flutuantes (Toasts)
    toast: {
        success: (message) => UI.showToast(message, "linear-gradient(to right, #10B981, #059669)"), // Verde
        error: (message) => UI.showToast(message, "linear-gradient(to right, #DC2626, #B91C1C)"),   // Vermelho
        info: (message) => UI.showToast(message, "linear-gradient(to right, #D4AF37, #B45309)", "#000") // Dourado Luxury
    },

    showToast: (text, background, color = "#fff") => {
        Toastify({
            text: text,
            duration: 3000,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: background,
                color: color,
                borderRadius: "4px",
                fontWeight: "600",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.1)"
            }
        }).showToast();
    },

    // 2. Estado de Carregamento nos Botões
    buttonLoading: (btn, isLoading, loadingText = "Processando...") => {
        if (!btn) return;

        if (isLoading) {
            btn.dataset.originalText = btn.innerHTML;
            btn.disabled = true;
            btn.style.opacity = "0.7";
            btn.style.cursor = "not-allowed";
            btn.innerHTML = `<i class="fas fa-circle-notch fa-spin mr-2"></i> ${loadingText}`;
        } else {
            btn.disabled = false;
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
            btn.innerHTML = btn.dataset.originalText || "Enviar";
        }
    }
};