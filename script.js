document.addEventListener('DOMContentLoaded', () => {
    // --- ESTADO DA APLICAÇÃO ---
    let pedido = []; // Array para armazenar os itens do pedido
    let tamanhoTortaRedondaSelecionado = null;
    let tamanhoTortaRetangularSelecionado = null;

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
    const selectBairro = document.getElementById("selectAeroclube");

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
        tamanhoTortaRetangularSelecionado = { // Armazena o tamanho selecionado
            tamanho: btn.dataset.tamanho,
            preco: parseFloat(btn.dataset.preco)
        };
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

        if (id === 'tortas') {
            inicializarTortas();
        }
    });
});

    // 2. Lógica do Carrossel de Produtos
    carousels.forEach(carousel => {
        const grid = carousel.querySelector('.produtos-grid-c');
        if (!grid) return; // Pula se o carrossel não tiver a estrutura esperada

        const items = grid.querySelectorAll('.produto, .produto-ninho');
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
  function configurarSelecaoCoresCasquinha() {
    document.querySelectorAll('.produto').forEach(produto => {
        const botoesCor = produto.querySelectorAll('.btn-escolha');
        if (!botoesCor.length) return;

        botoesCor.forEach(botao => {
            botao.addEventListener('click', function() {
                // Remove a seleção de todos os botões no mesmo grupo
                produto.querySelectorAll('.btn-escolha').forEach(b => b.classList.remove('active'));
                
                // Adiciona a seleção ao botão clicado
                this.classList.add('active');
            });
        });
    });
}
document.querySelectorAll('.produto, .produto-ninho').forEach(produto => {
    const btnMais = produto.querySelector('.btn-quantidade-mais');
    const btnMenos = produto.querySelector('.btn-quantidade-menos');
    const quantidadeEl = produto.querySelector('.quantidade');

    

    if (btnMais && btnMenos && quantidadeEl) {
        btnMais.addEventListener('click', () => {
            let qtd = parseInt(quantidadeEl.textContent) || 1;
            quantidadeEl.textContent = qtd + 1;
        });

        btnMenos.addEventListener('click', () => {
            let qtd = parseInt(quantidadeEl.textContent) || 1;
            if (qtd > 1) {
                quantidadeEl.textContent = qtd - 1;
            }
        });
    }
});


document.querySelectorAll('.btn-escolha').forEach(botao => {
    botao.addEventListener('click', function() {
        // Remove a classe active de todos os botões do mesmo grupo
        const grupo = this.closest('.produto-ninho');
        grupo.querySelectorAll('.btn-escolha').forEach(btn => {
            btn.classList.remove('active');
        });
        // Adiciona a classe active apenas ao botão clicado
        this.classList.add('active');
    });
});


    // 3. Adicionar produto ao pedido
  botoesAdicionar.forEach(botao => {
    botao.addEventListener('click', function() {
        const produto = this.closest('.produto, .produto-ninho');
        if (!produto) return;
    const nomeBase = produto.querySelector('.nome-c')?.textContent?.trim() || 'Produto sem nome';
        const precoEl = produto.querySelector('.preco');
        let preco = 0;

         if (precoEl) {
            preco = parseFloat(precoEl.textContent.replace('R$', '').replace(',', '.').trim());
        }
         const quantidade = parseInt(produto.querySelector('.quantidade')?.textContent) || 1;

    

        // Verifica se tem opção de cor e se foi selecionada
        const botoesCor = produto.querySelectorAll('.btn-escolha');
        let corSelecionada = null;
        
        if (botoesCor.length > 0) {
            const btnCorAtivo = produto.querySelector('.btn-escolha.active');
            if (!btnCorAtivo) {
                mostrarNotificacao('⚠️ Por favor, selecione a cor da casquinha!');
                return;
            }
            corSelecionada = btnCorAtivo.textContent.trim();
        }

        let nomeCompleto = nomeBase;
        

        // Adiciona a cor ao nome se existir
        if (corSelecionada) {
            nomeCompleto += ` (Casquinha ${corSelecionada})`;
        }

        pedido.push({ 
            nome: `${nomeCompleto} (x${quantidade})`,  // Usando nomeCompleto que inclui a cor
            preco: preco * quantidade 
        });

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
            atualizarContador();
            mostrarNotificacao(`✅ ${quantidade}x ${nomeCompleto} adicionado(s)!`);
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
            b.removeAttribute('data-selecionado');
        });
        btn.setAttribute('data-selecionado', 'true'); 
        
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
    // 1. Configuração da seleção de sabores (comum a todos os tipos)
    document.querySelectorAll('.flavor-option').forEach(option => {
        option.addEventListener('click', function() {
            // Remove seleção de todos no mesmo grupo
            const grupo = this.closest('.flavor-options');
            grupo.querySelectorAll('.flavor-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            // Adiciona seleção ao clicado
            this.classList.add('selected');
        });
    });

    // 2. Configuração dos controles de quantidade para TODOS os tipos
    document.querySelectorAll('.quantidade-container').forEach(container => {
        const btnMenos = container.querySelector('.btn-quantidade-menos');
        const btnMais = container.querySelector('.btn-quantidade-mais');
        const quantidadeEl = container.querySelector('.quantidade');

        btnMais.addEventListener('click', () => {
            let qtd = parseInt(quantidadeEl.textContent) || 1;
            quantidadeEl.textContent = qtd + 1;
        });

        btnMenos.addEventListener('click', () => {
            let qtd = parseInt(quantidadeEl.textContent) || 1;
            if (qtd > 1) {
                quantidadeEl.textContent = qtd - 1;
            }
        });
    });

    // 3. Função para adicionar qualquer tipo de brownie ao pedido
    function adicionarBrownie(tipo) {
        const btnClass = `.btn-add-${tipo}`;
        const containerClass = `.tipo-conteudo#conteudo-${tipo}`;

        document.querySelectorAll(btnClass).forEach(btn => {
            btn.addEventListener('click', function() {
                const container = this.closest(containerClass);
                const selectedOption = container.querySelector('.flavor-option.selected');
                
                if (!selectedOption) {
                    mostrarNotificacao('⚠️ Por favor, selecione um sabor!');
                    return;
                }

                const nomeSabor = selectedOption.querySelector('.flavor-name').textContent;
                const preco = parseFloat(selectedOption.dataset.preco);
                const quantidade = parseInt(container.querySelector('.quantidade').textContent) || 1;

                // Define o nome do tipo de brownie
                const tipoNomes = {
                    'pote': 'Brownie no Pote',
                    'escondidinho': 'Brownie Escondidinho',
                    'fatia': 'Fatia de Brownie'
                };

                // Adiciona ao pedido
                pedido.push({
                    nome: `${tipoNomes[tipo]} - ${nomeSabor} (x${quantidade})`,
                    preco: preco * quantidade
                });

                // Atualiza a interface
                atualizarContador();
                renderizarPedido();
                atualizarTotalPedido();
                mostrarNotificacao(`✅ ${quantidade}x ${tipoNomes[tipo]} - ${nomeSabor} adicionado(s)!`);
            });
        });
    }

    // 4. Configura os eventos para cada tipo de brownie
    adicionarBrownie('pote');
    adicionarBrownie('escondidinho');
    adicionarBrownie('fatia');
}

    // 4. Enviar Pedido por WhatsApp (verifica se o botão existe)
    if (btnEnviarWhats) {
    btnEnviarWhats.addEventListener('click', () => {

        const selectBairro = document.getElementById("selectAeroclube");
        const bairroSelecionado = selectBairro ? selectBairro.value : null;

        if (!bairroSelecionado) {
            alert('Por favor, selecione seu bairro para calcular o frete.');
            return;
        }

        const frete = precoFrete[bairroSelecionado] || 0;

        let mensagem = 'Olá! Gostaria de fazer';

        if (pedido.length > 0) {
            mensagem += ' o seguinte pedido:\n\n';

            pedido.forEach(item => {
                mensagem += `- ${item.nome}: R$ ${item.preco.toFixed(2).replace('.', ',')}\n`;
            });

            const totalProdutos = pedido.reduce((sum, item) => sum + item.preco, 0);
            const totalComFrete = totalProdutos + frete;

            mensagem += `\nFrete para o bairro:${bairroSelecionado.replace(/-/g, ' ')}: R$ ${frete.toFixed(2).replace('.', ',')}`;
            mensagem += `\n*Total (produtos + frete): R$ ${totalComFrete.toFixed(2).replace('.', ',')}*`;
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
function inicializarTortas() {
    // Seleciona as subseções
    const secaoRedonda = document.getElementById('Redonda');
    const secaoRetangular = document.getElementById('retangular');

    // Ativa a seção Redonda, desativa a Retangular
    if (secaoRedonda && secaoRetangular) {
        secaoRedonda.classList.add('ativo');
        secaoRetangular.classList.remove('ativo');
    }

    // Remove seleção de todos os botões de torta (redonda e retangular)
    document.querySelectorAll('.btn-opcao-redonda, .btn-opcao-retangular').forEach(btn => {
        btn.removeAttribute('data-selecionado');
    });

    // Seleciona o primeiro botão redondo e simula clique pra ativar tudo
    const primeiroBtnRedondo = document.querySelector('.btn-opcao-redonda');
    if (primeiroBtnRedondo) {
        primeiroBtnRedondo.setAttribute('data-selecionado', 'true');
        
    }

    // Atualiza os links de formato (menu-formato) para indicar que Redonda está ativo
    document.querySelectorAll('.menu-link-formato').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#Redonda') {
            link.classList.add('active');
        }
    });
}

    // 5. Menu mobile
 const toggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const closeSidebar = document.getElementById('close-sidebar');

// Abrir menu
toggle.addEventListener('click', () => {
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    toggle.classList.add('hidden'); // Esconde o ícone
});

// Fechar menu (clique no overlay)
overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    toggle.classList.remove('hidden'); // Mostra o ícone novamente
});

    // --- ESTADO INICIAL DA PÁGINA ---
    mostrarSecao('cones'); // Mostra a seção "Cones" por padrão
    atualizarContador();   // Inicia o contador (começará em 0)
    renderizarPedido();
    configurarSelecaoCoresCasquinha();
});

// Mapeamento dos bairros para o preço do frete
const precoFrete = {
  "aeroclube": 10.00,
  "bela-vista": 15.00,
  "centenario": 12.00,
  "centro": 8.00,
  "cinco-de-maio": 14.00,
  "ferroviario": 13.00,
  "germano-henke": 16.00,
  "imigracao": 15.00,
  "industrial": 18.00,
  "panorama": 20.00,
  "por-do-sol": 22.00,
  "progresso": 14.00,
  "rui-barbosa": 12.00,
  "sao-joao": 10.00,
  "sao-paulo": 17.00,
  "santa-rita": 13.00,
  "santo-antonio": 11.00,
  "senai": 9.00,
  "timbauva": 19.00,
  "zona-rural": 25.00
};

const selectBairro = document.getElementById("selectAeroclube");
const resultadoFrete = document.getElementById("frete-resultado");

selectBairro.addEventListener("change", function() {
  const bairroSelecionado = this.value;
  
  if (bairroSelecionado && precoFrete[bairroSelecionado] !== undefined) {
    const preco = precoFrete[bairroSelecionado].toFixed(2);
    resultadoFrete.textContent = `Preço do frete para ${bairroSelecionado.replace(/-/g, ' ')}: R$ ${preco}`;
  } else {
    resultadoFrete.textContent = "";
  }
});

