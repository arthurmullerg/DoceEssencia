document.addEventListener('DOMContentLoaded', () => {
    // --- ESTADO DA APLICAÇÃO ---
    let pedido = []; // Array para armazenar os itens do pedido
    let tamanhoTortaRedondaSelecionado = null;

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
    configurarMenuBrownie();
      configurarBrownies(); 

    document.querySelectorAll('.btn-opcao-redonda').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-opcao-redonda').forEach(b => b.removeAttribute('data-selecionado'));
        btn.setAttribute('data-selecionado', true);
        tamanhoTortaRedondaSelecionado = {
            tamanho: btn.dataset.tamanho,
            preco: parseFloat(btn.dataset.preco)
        };
        mostrarNotificacao(`✅ Tamanho ${btn.dataset.tamanho} fatias selecionado! Agora escolha o sabor.`);
    });
});

document.querySelectorAll('.btn-opcao-retangular').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-opcao-retangular').forEach(b => b.removeAttribute('data-selecionado'));
        btn.setAttribute('data-selecionado', true);
        mostrarNotificacao(`✅ Tamanho ${btn.dataset.tamanho} fatias selecionado! Agora escolha o sabor.`);
    });
});

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

            if (prev) {
    prev.style.visibility = currentIndex === 0 ? 'hidden' : 'visible';
}

if (next) {
    next.style.visibility = currentIndex >= items.length - itemsToShow ? 'hidden' : 'visible';
}
        };

       if (prev) {
    prev.addEventListener('click', () => {
        currentIndex = Math.max(currentIndex - 1, 0);
        updateCarousel();
    });
}

if (next) {
    next.addEventListener('click', () => {
        const itemsToShow = window.innerWidth <= 768 ? 1 : 3;
        currentIndex = Math.min(currentIndex + 1, items.length - itemsToShow);
        updateCarousel();
    });
}

        window.addEventListener('resize', updateCarousel);
        updateCarousel(); // Chama a função para configurar o estado inicial
    });

    // 3. Adicionar produto ao pedido
    botoesAdicionar.forEach(botao => {
    botao.addEventListener('click', function () {
        const produto = this.closest('.produto');
        const nomeBase = produto.querySelector('.nome-c')?.textContent?.trim() || 'Produto sem nome';

        let nomeCompleto = nomeBase;
        let preco;

        const temOpcoes = produto.querySelector('.btn-opcao');

        if (temOpcoes) {
            // --- Produtos com opções (ex: Tortas ou Bolos) ---
            const tamanhoEl = produto.querySelector('.btn-opcao[data-selecionado]');
            if (!tamanhoEl) {
                mostrarNotificacao('⚠️ Por favor, selecione um tamanho!');
                return;
            }

            const tamanho = tamanhoEl.dataset.tamanho;
            const precos = JSON.parse(produto.dataset.precos || '{}');
            preco = precos[tamanho];

            const secaoTorta = produto.closest('.secao-tortas');
            if (secaoTorta) {
                const formato = secaoTorta.id === 'Redonda' ? 'Redonda' : 'Retangular';
                nomeCompleto = `${nomeBase} (${formato}, ${tamanho} fatias)`;
            } else {
                nomeCompleto = `${nomeBase} (${tamanho})`;
            }

        } else {
            // --- Produtos simples (ex: Cones) ---
            const precoEl = produto.querySelector('.preco');
            if (precoEl) {
                const precoTexto = precoEl.textContent || '';
                preco = parseFloat(precoTexto.replace('R$', '').replace(',', '.').trim());
            }
        }

        // Adicionar ao pedido se o preço for válido
        if (typeof preco === 'number' && !isNaN(preco)) {
            pedido.push({ nome: nomeCompleto, preco });
            atualizarContador();
            mostrarNotificacao(`✅ ${nomeCompleto} adicionado ao pedido!`);
            renderizarPedido();
            atualizarTotalPedido();
        } else {
            console.error("❌ Preço inválido ou não encontrado para:", produto);
            mostrarNotificacao('❌ Erro ao adicionar o item. Preço não encontrado.');
        }
    });
});

// Adicionar sabor ao pedido
document.querySelectorAll('.btn-add-sabor').forEach(botao => {
    botao.addEventListener('click', function () {
        const cardSabor = botao.closest('.card-sabor');
        const secaoPai = botao.closest('.secao-tortas');

        let tamanhoSelecionado = null;
        let formato = '';
        let nomeCompleto = '';
        let preco = 0;

        if (secaoPai && secaoPai.id === 'Redonda') {
            const botaoSelecionado = document.querySelector('.secao-tortas#Redonda .btn-opcao-redonda[data-selecionado]');
            if (!botaoSelecionado) {
                mostrarNotificacao('⚠️ Por favor, selecione o tamanho da torta redonda!');
                return;
            }

            formato = 'Torta Redonda';
            tamanhoSelecionado = botaoSelecionado.dataset.tamanho;
            preco = parseFloat(botaoSelecionado.dataset.preco);
        } 
        else if (secaoPai && secaoPai.id === 'retangular') {
            const botaoSelecionado = document.querySelector('.secao-tortas#retangular .btn-opcao-retangular[data-selecionado]');
            if (!botaoSelecionado) {
                mostrarNotificacao('⚠️ Por favor, selecione o tamanho da torta retangular!');
                return;
            }

            formato = 'Torta Retangular';
            tamanhoSelecionado = botaoSelecionado.dataset.tamanho;
            preco = parseFloat(botaoSelecionado.dataset.preco);
        } 
        else {
            mostrarNotificacao('⚠️ Formato da torta não identificado!');
            return;
        }

        const nomeSabor = this.dataset.sabor || 'Sabor personalizado';
        nomeCompleto = `${formato} (${tamanhoSelecionado} fatias) - Sabor: ${nomeSabor}`;

        pedido.push({ nome: nomeCompleto, preco });
        atualizarContador();
        mostrarNotificacao(`✅ ${nomeSabor} (${tamanhoSelecionado} fatias) adicionado ao pedido!`);
        renderizarPedido();
        atualizarTotalPedido();

        // Resetar seleção (opcional)
        if (formato === 'Torta Redonda') {
            document.querySelectorAll('.btn-opcao-redonda').forEach(b => b.removeAttribute('data-selecionado'));
        } else {
            document.querySelectorAll('.btn-opcao-retangular').forEach(b => b.removeAttribute('data-selecionado'));
        }
    });
});


// === Selecionar botão de tamanho ===
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-opcao')) {
        const grupo = e.target.closest('.produto');
        if (!grupo) return;

        const botoes = grupo.querySelectorAll('.btn-opcao');
        botoes.forEach(btn => btn.removeAttribute('data-selecionado'));

        e.target.setAttribute('data-selecionado', true);
    }
});

document.addEventListener('click', function(e) {
    if(e.target.classList.contains('btn-opcao')) {
        const btn = e.target;
        const produto = btn.closest('.produto');
        const precos = JSON.parse(produto.dataset.precos);
        const tamanho = btn.dataset.tamanho;
        
        // Atualizar seleção
        produto.querySelectorAll('.btn-opcao').forEach(b => {
            delete b.dataset.selecionado;
        });
        btn.dataset.selecionado = true;
        
        // Atualizar preço
        const preco = precos[tamanho];
        produto.querySelector('.preco').textContent = `R$ ${preco.toFixed(2).replace('.', ',')}`;
    }
});

document.querySelectorAll('.menu-link-formato').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        
        // Atualizar links ativos
        document.querySelectorAll('.menu-link-formato').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        // Mostrar seção correspondente
        document.querySelectorAll('.secao-tortas').forEach(secao => {
            secao.classList.remove('ativo');
            if(secao.id === targetId) {
                secao.classList.add('ativo');
            }
        });
    });
});

function configurarMenuBrownie() {
    const brownieLinks = document.querySelectorAll('#brownie .menu-link-formato');
    
    brownieLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove a classe active de todos os links
            brownieLinks.forEach(l => l.classList.remove('active'));
            
            // Adiciona a classe active apenas no link clicado
            this.classList.add('active');
            
            // Obtém o tipo do conteúdo a ser mostrado
            const tipo = this.getAttribute('data-tipo');
            
            // Esconde todos os conteúdos de brownie
            document.querySelectorAll('#brownie .tipo-conteudo').forEach(conteudo => {
                conteudo.style.display = 'none';
            });
            
            // Mostra apenas o conteúdo correspondente
            const conteudo = document.getElementById(`conteudo-${tipo}`);
            if (conteudo) {
                conteudo.style.display = 'block';
            }
        });
    });
    
    // Inicializa mostrando o conteúdo do pote
    const conteudoPote = document.getElementById('conteudo-pote');
    if (conteudoPote) {
        conteudoPote.style.display = 'block';
    }
}

function configurarBrownies() {
    // Tipos de brownie com seus estilos correspondentes
    const tiposBrownie = [
        { id: 'pote', estilo: 'No pote', precoBase: 15 },
        { id: 'escondidinho', estilo: 'Escondidinho', precoBase: 18 },
        { id: 'fatia', estilo: 'Fatia', precoBase: 12 }
    ];
    
    tiposBrownie.forEach(tipo => {
        const container = document.getElementById(`conteudo-${tipo.id}`);
        if (!container) return;
        
        const flavorOptions = container.querySelectorAll('.flavor-option');
        const btnAdd = container.querySelector(`.btn-add-${tipo.id}`);
        
        // Seleção de sabores
        flavorOptions.forEach(option => {
            option.addEventListener('click', function() {
                flavorOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                mostrarNotificacao(`✅ Sabor ${this.textContent.trim()} selecionado!`);
            });
        });
        
        // Adicionar ao pedido
        if (btnAdd) {
            btnAdd.addEventListener('click', function() {
                const selectedOption = container.querySelector('.flavor-option.selected');
                
                if (!selectedOption) {
                    mostrarNotificacao('⚠️ Por favor, selecione um sabor!');
                    return;
                }
                
                const sabor = selectedOption.getAttribute('data-flavor');
                const nomeSabor = selectedOption.querySelector('.flavor-name').textContent;
                const preco = parseFloat(selectedOption.getAttribute('data-preco')) || tipo.precoBase;
                
                // Adiciona ao pedido
                pedido.push({
                    tipo: 'Brownie',
                    estilo: tipo.estilo,
                    sabor: sabor,
                    nome: `Brownie ${tipo.estilo} - ${nomeSabor}`,
                    preco: preco
                });
                
                atualizarContador();
                renderizarPedido();
                atualizarTotalPedido();
                mostrarNotificacao(`✅ Brownie ${tipo.estilo} - ${nomeSabor} adicionado!`);
            });
        }
    });
}

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
