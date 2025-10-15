// Espera até que o HTML todo carregue
document.addEventListener("DOMContentLoaded", () => {
    // Seleciona os elementos do HTML
    const sendButton = document.getElementById("sendButton");
    const messageInput = document.getElementById("messageInput");
    const chatArea = document.querySelector(".chat-container");

    // 🔗 Teu Webhook no n8n (modo "Respond to Webhook")
    const N8N_WEBHOOK_URL = "https://kauafelixxz.app.n8n.cloud/webhook/01639ea2-a7dc-4a17-926d-c0941eeaf064";

    // Função para adicionar mensagens no chat
    function addMessage(text, sender = "user") {
        const message = document.createElement("div");
        message.classList.add("message", sender === "user" ? "user-message" : "ai-message");
        message.textContent = text;
        chatArea.appendChild(message);
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    // Função principal para enviar a mensagem ao n8n
    async function sendMessage() {
        const text = messageInput.value.trim();
        if (!text) return;

        addMessage(text, "user");
        messageInput.value = "";

        // Mostra a mensagem de "digitando..."
        const loadingMessage = document.createElement("div");
        loadingMessage.classList.add("message", "ai-message");
        loadingMessage.textContent = "Servo de Maria está refletindo...";
        chatArea.appendChild(loadingMessage);
        chatArea.scrollTop = chatArea.scrollHeight;

        try {
            // 📤 Envia a mensagem para o webhook do n8n
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text }),
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            // 📥 Pega o texto puro da resposta (já que o n8n retorna Text)
            const aiReply = await response.text();

            loadingMessage.remove();
            addMessage(aiReply || "Desculpe, não consegui entender no momento.", "ai");

        } catch (error) {
            loadingMessage.remove();
            console.error("Erro ao enviar para o n8n:", error);
            addMessage("Ocorreu um erro ao conectar com o servidor. Tente novamente mais tarde.", "ai");
        }
    }

    // Enviar com o botão
    sendButton.addEventListener("click", sendMessage);

    // Enviar com Enter
    messageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });
});
