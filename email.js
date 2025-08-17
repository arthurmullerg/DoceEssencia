 emailjs.init({
        publicKey: "3Dk7zR3nHyxHLbNgW",
      });

document.getElementById('form-cont').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        whats: document.getElementById('tel').value,
        subject: document.getElementById('subject').value
    };
     
    const serviceID = "service_zjm3eos";
    const templateID = "template_h9cqdy6";

    emailjs.send(serviceID, templateID, formData)
    .then(() => {
        Toastify({
            text: "Formulário enviado com sucesso",
            duration: 3000
        }).showToast();
    })
    .catch((error) => {
      console.error("Erro ao enviar o e-mail:", error);
    });
});

 

    