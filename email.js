emailjs.init({
    publicKey: "3Dk7zR3nHyxHLbNgW",
});

// --- Máscara para telefone ---
function mascaraTelefone(element) {
    let telefone = element.value.replace(/\D/g, ''); // só números

    if (telefone.length > 11) telefone = telefone.slice(0, 11); // máximo 11 dígitos

    if (telefone.length > 6) {
        element.value = `(${telefone.slice(0,2)}) ${telefone.slice(2,7)}-${telefone.slice(7)}`;
    } else if (telefone.length > 2) {
        element.value = `(${telefone.slice(0,2)}) ${telefone.slice(2)}`;
    } else if (telefone.length > 0) {
        element.value = `(${telefone}`;
    }
}

// aplica máscara em tempo real
document.getElementById('tel').addEventListener('input', function() {
    mascaraTelefone(this);
});

document.getElementById('form-cont').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const tel = document.getElementById('tel').value.trim();
    const name = document.getElementById('name').value.trim();
    const subject = document.getElementById('subject').value.trim();

    // --- Validação de e-mail ---
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        Toastify({
            text: "Por favor, insira um e-mail válido.",
            duration: 3000,
            backgroundColor: "red"
        }).showToast();
        return;
    }

    // --- Validação de telefone com máscara ---
    const telRegex = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/;
    if (!telRegex.test(tel)) {
        Toastify({
            text: "Por favor, insira um telefone válido no formato (XX) XXXXX-XXXX",
            duration: 3000,
            backgroundColor: "red"
        }).showToast();
        return;
    }

    const formData = {
        name,
        email,
        whats: tel,
        subject
    };

    const serviceID = "service_zjm3eos";
    const templateID = "template_h9cqdy6";

    emailjs.send(serviceID, templateID, formData)
    .then(() => {
        Toastify({
            text: "Formulário enviado com sucesso",
            duration: 3000,
            backgroundColor: "green"
        }).showToast();
        document.getElementById('form-cont').reset();
    })
    .catch((error) => {
        console.error("Erro ao enviar o e-mail:", error);
    });
});