document.addEventListener('DOMContentLoaded', () => {
    // --- ESTADO DA APLICAÇÃO ---
    let pedido = []; // Array para armazenar os itens do pedido

    // --- SELETORES DO DOM ---
    const menuLinks = document.querySelectorAll('.menu-link');
    const secoesCardapio = document.querySelectorAll('.cardapio');
    const carousels = document.querySelectorAll('.slider-container');
    const botoesAdicionar = document.querySelectorAll('.btn-add');
    const pedidoCountEl = document.getElementById('pedido-count');
    const notificacaoEl = document.getElementById('notificacao');
    const notificacaoTextoEl = document.getElementById('notificacao-texto');
    const btnEnviarWhats = document.getElementById('btn-whats-pedido');
    const menuToggle = document.querySelector('.menu-mobile');
    const menuMobile = document.querySelector('.menu-mobile ul');

    // --- FUNÇÕES ---

    // Mostra a seção correta do cardápio (Cones, Tortas, etc.)
    function mostrarSecao(id) {
        secoesCardapio.forEach(secao => {
            secao.classList.remove('ativo');
            if (secao.id === id) {
                secao.classList.add('ativo');
            }
        });
        menuLinks.forEach(link => link.classList.remove('active'));
        document.querySelector(`.menu-link[href="#${id}"]`).classList.add('active');
    }

    // Mostra a notificação de "item adicionado"
    function mostrarNotificacao(mensagem) {
        if (notificacaoEl && notificacaoTextoEl) {
            notificacaoTextoEl.textContent = mensagem;
            notificacaoEl.classList.add('mostrar');
            setTimeout(() => {
                notificacaoEl.classList.remove('mostrar');
            }, 3000);
        }
    }

    // Atualiza o número no ícone do carrinho
    function atualizarContador() {
        if (pedidoCountEl) {
            pedidoCountEl.textContent = pedido.length;
        }
    }

    // --- INICIALIZAÇÃO DOS EVENTOS ---

    // 1. Navegação do Cardápio
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const id = this.getAttribute('href').substring(1);
            mostrarSecao(id);
        });
    });

    // 2. Lógica do Carrossel de Produtos
    carousels.forEach(carousel => {
        const grid = carousel.querySelector('.produtos-grid-c');
        if (!grid) return; // Pula se o carrossel não tiver a estrutura esperada

        const items = grid.querySelectorAll('.produto');
        if (items.length === 0) return; // Pula se não houver itens

        const prev = carousel.querySelector('.prev');
        const next = carousel.querySelector('.next');
        let currentIndex = 0;

        const updateCarousel = () => {
            const itemsToShow = window.innerWidth <= 768 ? 1 : 3;
            const itemWidth = items[0].offsetWidth;
            const gap = parseInt(window.getComputedStyle(grid).gap) || 20;
            const translateValue = currentIndex * (itemWidth + gap);

            grid.style.transform = `translateX(-${translateValue}px)`;

            prev.style.visibility = currentIndex === 0 ? 'hidden' : 'visible';
            next.style.visibility = currentIndex >= items.length - itemsToShow ? 'hidden' : 'visible';
        };

        prev.addEventListener('click', () => {
            currentIndex = Math.max(currentIndex - 1, 0);
            updateCarousel();
        });

        next.addEventListener('click', () => {
            const itemsToShow = window.innerWidth <= 768 ? 1 : 3;
            currentIndex = Math.min(currentIndex + 1, items.length - itemsToShow);
            updateCarousel();
        });

        window.addEventListener('resize', updateCarousel);
        updateCarousel(); // Chama a função para configurar o estado inicial
    });

    // 3. Adicionar produto ao pedido
    botoesAdicionar.forEach(botao => {
        botao.addEventListener('click', () => {
            const produtoEl = botao.closest('.produto, .produto-queridinho');
            const nome = produtoEl.querySelector('.nome, .nome-c').textContent;
            const precoTexto = produtoEl.querySelector('.preco').textContent;
            const preco = parseFloat(precoTexto.replace('R$', '').replace(',', '.').trim());

            pedido.push({ nome, preco });

            atualizarContador();
            mostrarNotificacao(`✅ ${nome} adicionado ao pedido!`);
            renderizarPedido(); // Atualiza a lista de pedidos visível
            atualizarTotalPedido()
        });
    });

    // 4. Enviar Pedido por WhatsApp (verifica se o botão existe)
    if (btnEnviarWhats) {
        btnEnviarWhats.addEventListener('click', () => {
        
 let mensagem ='Olá! Gostaria de fazer';

        if (pedido.length > 0) {
            mensagem += ' o seguinte pedido:\n\n';

            pedido.forEach(item => {
                mensagem += `- ${item.nome}: R$ ${item.preco.toFixed(2).replace('.', ',')}\n`;
            });

            const total = pedido.reduce((sum, item) => sum + item.preco, 0);
            mensagem += `\n*Total: R$ ${total.toFixed(2).replace('.', ',')}*`;
        } else {
            mensagem += ' um pedido.';
        }

        mensagem += '\n\nAguardo confirmação, obrigado!';

        const numero = "5198097470";
        const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
    });
}

    function renderizarPedido() {
    const container = document.querySelector('.produtos-pedido');
    container.innerHTML = ''; // limpa antes de re-renderizar

    if (pedido.length === 0) {
        container.innerHTML = '<p class="descricao-pedidos">Seu pedido está vazio.</p>';
        return;
    }

    pedido.forEach((item, index) => {
        const div = document.createElement('div');
        div.classList.add('item-pedido');
        div.innerHTML = `
            <span>${item.nome}</span>
            <span>R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
            <button class="remover-item" data-index="${index}">❌</button>
        `;
        container.appendChild(div);
    });

    // Remover item do pedido
    container.querySelectorAll('.remover-item').forEach(botao => {
        botao.addEventListener('click', () => {
            const index = botao.getAttribute('data-index');
            pedido.splice(index, 1); // remove do array
            atualizarContador();
            renderizarPedido();
            atualizarTotalPedido()
        });
    });
}   
// atualiza o total do pedido
atualizarTotalPedido(); 
function atualizarTotalPedido() {
    const total = pedido.reduce((sum, item) => sum + item.preco, 0);
    const totalEl = document.getElementById('total-valor');
    if (totalEl) {
        totalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
}


    // 5. Menu mobile
    if (menuToggle && menuMobile) {
        menuToggle.addEventListener('click', () => {
            // Alterna a visibilidade do menu mobile
            const isVisible = menuMobile.style.display === 'block';
            menuMobile.style.display = isVisible ? 'none' : 'block';
        });
    }

    // --- ESTADO INICIAL DA PÁGINA ---
    mostrarSecao('cones'); // Mostra a seção "Cones" por padrão
    atualizarContador();   // Inicia o contador (começará em 0)
    renderizarPedido();
});
