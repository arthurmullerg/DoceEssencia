const filtrosMenu = document.getElementById('filtrosMenu');
const filtroAtual = document.getElementById('filtroAtual');
const opcoes = filtrosMenu.querySelectorAll('.filtros-option');
const produtos = document.querySelectorAll('.produto');

// Abre/fecha dropdown
filtroAtual.addEventListener('click', () => {
    filtrosMenu.classList.toggle('active');
});

// Aplica filtro ao clicar
opcoes.forEach(opcao => {
    opcao.addEventListener('click', () => {
        const valor = opcao.dataset.filtro;

        // Atualiza botão
        filtroAtual.textContent = `${opcao.textContent} `;

        // Fecha dropdown
        filtrosMenu.classList.remove('active');

        // Mostra/esconde produtos
        produtos.forEach(produto => {
            if (valor === "todos" || produto.dataset.categoria === valor) {
                produto.style.display = "block";
            } else {
                produto.style.display = "none";
            }
        });
    });
});
document.addEventListener('click', (event) => {
  // Se o clique NÃO for dentro do filtroMenu e NÃO for no botão filtroAtual
  if (!filtrosMenu.contains(event.target) && event.target !== filtroAtual) {
    filtrosMenu.classList.remove('active');
  }
}); 