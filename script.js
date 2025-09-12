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

   function mostrarNotificacaoErro(mensagem) {
    const notificacaoErroEl = document.getElementById('notificacao-erro');
    const notificacaoErroTextoEl = document.getElementById('notificacao-erro-texto');

    if (notificacaoErroEl && notificacaoErroTextoEl) {
        notificacaoErroTextoEl.textContent = mensagem;
        notificacaoErroEl.classList.add('mostrar');
        setTimeout(() => {
            notificacaoErroEl.classList.remove('mostrar');
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


  // 3. Adicionar produto ao pedido - VERSÃO CORRIGIDA
botoesAdicionar.forEach(botao => {
    botao.addEventListener('click', function() {
        const produto = this.closest('.produto, .produto-ninho');
        if (!produto) return;
        
        const nomeBase = produto.querySelector('.nome-c')?.textContent?.trim() || 'Produto sem nome';
        const quantidade = parseInt(produto.querySelector('.quantidade')?.textContent) || 1;

        // Verifica se tem opção de cor e se foi selecionada
        const botoesCor = produto.querySelectorAll('.btn-escolha');
        let corSelecionada = null;
        
        if (botoesCor.length > 0) {
            const btnCorAtivo = produto.querySelector('.btn-escolha.active');
            if (!btnCorAtivo) {
                mostrarNotificacaoErro('⚠️ Por favor, selecione a cor da casquinha!');
                return;
            }
            corSelecionada = btnCorAtivo.textContent.trim();
        }

        let nomeCompleto = nomeBase;
        
        // Adiciona a cor ao nome se existir
        if (corSelecionada) {
            nomeCompleto += ` (Casquinha ${corSelecionada})`;
        }

        // Obter o preço
        let preco = 0;
        const temOpcoes = produto.querySelector('.btn-opcao');

        if (temOpcoes) {
            // --- Produtos com opções (ex: Tortas ou Bolos) ---
            const tamanhoEl = produto.querySelector('.btn-opcao[data-selecionado]');
            if (!tamanhoEl) {
                mostrarNotificacaoErro('⚠️ Por favor, selecione um tamanho!');
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
                preco = parseFloat(precoEl.textContent.replace('R$', '').replace(',', '.').trim());
            }
        }

        // --- ADIÇÃO ÚNICA AO PEDIDO ---
        // Verifica se o preço é válido antes de adicionar
        if (typeof preco === 'number' && !isNaN(preco)) {
            pedido.push({ 
                nome: `${nomeCompleto} (x${quantidade})`,
                preco: preco * quantidade 
            });
            
            atualizarContador();
            mostrarNotificacao(`✅ ${quantidade}x ${nomeCompleto} adicionado(s)!`);
            renderizarPedido();
            atualizarTotalPedido();
        } else {
           
            mostrarNotificacaoErro('❌ Erro ao adicionar o item. Preço não encontrado.');
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
                mostrarNotificacaoErro('⚠️ Por favor, selecione o tamanho da torta redonda!');
                return;
            }

            formato = 'Torta Redonda';
            tamanhoSelecionado = botaoSelecionado.dataset.tamanho;
            preco = parseFloat(botaoSelecionado.dataset.preco);
        } 
        else if (secaoPai && secaoPai.id === 'retangular') {
            const botaoSelecionado = document.querySelector('.secao-tortas#retangular .btn-opcao-retangular[data-selecionado]');
            if (!botaoSelecionado) {
                mostrarNotificacaoErro('⚠️ Por favor, selecione o tamanho da torta retangular!');
                return;
            }

            formato = 'Torta Retangular';
            tamanhoSelecionado = botaoSelecionado.dataset.tamanho;
            preco = parseFloat(botaoSelecionado.dataset.preco);
        } 
        else {
            mostrarNotificacaoErro('⚠️ Formato da torta não identificado!');
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

let tamanhoSelecionado = null;
let precoSelecionado = 0;

document.querySelectorAll('.btn-gramas').forEach(botao => {
    botao.addEventListener('click', () => {
        tamanhoSelecionado = botao.dataset.peso;
        precoSelecionado = parseFloat(botao.dataset.preco);

        // feedback visual: marcar botão ativo
        document.querySelectorAll('.btn-gramas').forEach(b => b.classList.remove('active'));
        botao.classList.add('active');

        mostrarNotificacao(
            `Tamanho da Barra escolhido: ${tamanhoSelecionado} `
        );
    });
});

document.querySelector('.btn-add-barra').addEventListener('click', () => {
    const container = document.querySelector('#conteudo-barra'); 
    const saborSelecionado = container.querySelector('.flavor-option.selected');
    const sabor = saborSelecionado?.dataset.flavor;
    const quantidade = parseInt(container.querySelector('.quantidade')?.textContent) || 1;

    if (!tamanhoSelecionado || isNaN(precoSelecionado)) {
      mostrarNotificacaoErro("Escolha um tamanho antes de adicionar!");
        return;
    }

    if(saborSelecionado === null) {
        mostrarNotificacaoErro("Escolha um sabor antes de adicionar!");
        return;
    }


let precoFinal = precoSelecionado;

switch (saborSelecionado?.dataset.flavor) {
  case 'Ninho com Nutella':
    if (tamanhoSelecionado === '135g') precoFinal += 2;
    else if (tamanhoSelecionado === '225g') precoFinal += 4;
    break;

   }
    // ------------------------------------

    const nomeProduto = `Barra ${tamanhoSelecionado} - ${sabor}`;

    pedido.push({
        nome: `${nomeProduto} (x${quantidade})`,
        preco: precoFinal * quantidade
    });

    atualizarContador();
    renderizarPedido();
    atualizarTotalPedido();
    mostrarNotificacao(`✅ ${quantidade}x ${nomeProduto} adicionado(s)!`);
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
                    mostrarNotificacaoErro('⚠️ Por favor, selecione um sabor!');
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

function inicializarDocinhos() {
    const linksFormatos = document.querySelectorAll('#docinhos .menu-link-formato');
    const opcoes = document.querySelectorAll('#docinhos .docinho-opcoes');

    // Sempre mostrar Tradicional no início
    opcoes.forEach(sec => sec.style.display = 'none');
    const tradicional = document.getElementById('tradicional');
    tradicional.style.display = 'block';

    // Marca link Tradicional como ativo
    linksFormatos.forEach(link => link.classList.remove('active'));
    document.querySelector('#docinhos .menu-link-formato[href="#tradicional"]').classList.add('active');

  

    // Clique nos links de formato
    linksFormatos.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();

            linksFormatos.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            opcoes.forEach(sec => sec.style.display = 'none');
            const target = document.querySelector(link.getAttribute('href'));
            target.style.display = 'block';

            // Sempre selecionar o primeiro sabor e tamanho do formato
            const primeiroSabor = target.querySelector('.btn-sabor');
            const primeiroTamanho = target.querySelector('.btn-tamanho');

            target.querySelectorAll('.btn-sabor, .btn-tamanho').forEach(b => b.classList.remove('selected'));

            if (primeiroSabor) {
                primeiroSabor.classList.add('selected');
                saborSelecionado = primeiroSabor.dataset.sabor;
            }

            if (primeiroTamanho) {
                primeiroTamanho.classList.add('selected');
                tamanhoSelecionado = primeiroTamanho.dataset.tamanho;
                precoSelecionado = parseFloat(primeiroTamanho.dataset.preco);
            }
        });
    });

    // Clique em sabores
    document.querySelectorAll('.btn-sabor').forEach(btn => {
        btn.addEventListener('click', () => {
            const container = btn.closest('.docinho-opcoes');
            container.querySelectorAll('.btn-sabor').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            saborSelecionado = btn.dataset.sabor;
        });
    });

    // Clique em tamanhos
    document.querySelectorAll('.btn-tamanho').forEach(btn => {
        btn.addEventListener('click', () => {
            const container = btn.closest('.docinho-opcoes');
            container.querySelectorAll('.btn-tamanho').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            tamanhoSelecionado = btn.dataset.tamanho;
            precoSelecionado = parseFloat(btn.dataset.preco);
        });
    });
}

// Inicializa
inicializarDocinhos();

document.getElementById('btn-add-docinho').addEventListener('click', () => {
    // Pega o container ativo
    const containerAtivo = document.querySelector('.docinho-opcoes[style*="display: block"]');

    if (!containerAtivo) return;

    // Nome do produto
    const tipoCaixa = containerAtivo.querySelector('h3').textContent.trim();
    const nomeProduto = `${tipoCaixa} - ${tamanhoSelecionado} unidades - ${saborSelecionado}`;

    // Adiciona ao array pedido
    pedido.push({
        nome: nomeProduto,
        preco: precoSelecionado
    });

    // Atualiza contador, renderiza pedido e mostra notificação
    atualizarContador();
    renderizarPedido();
    atualizarTotalPedido();
    mostrarNotificacao(`✅ ${nomeProduto} adicionado ao pedido!`);
});

    // 4. Enviar Pedido por WhatsApp (verifica se o botão existe)
  if (btnEnviarWhats) {
  btnEnviarWhats.addEventListener('click', () => {
    const selectBairro = document.getElementById("selectBairro");
    const bairroSelecionado = selectBairro ? selectBairro.value.trim() : "";

    const rua = document.getElementById("rua")?.value.trim() || "";
    const numero = document.getElementById("numero")?.value.trim() || "";
    const complemento = document.getElementById("complemento")?.value.trim() || "";

    if (!rua || !numero || !bairroSelecionado) {
      alert("Por favor, preencha todos os campos de endereço (Rua, Número, Complemento e Bairro).");
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

      mensagem += `\n Endereço de entrega:`;
      mensagem += `\nRua: ${rua}`;
      mensagem += `\nNúmero: ${numero}`;
      if (complemento) mensagem += `\nComplemento: ${complemento}`;
      mensagem += `\nBairro: ${bairroSelecionado.replace(/-/g, ' ')}`;

      mensagem += `\n\n Frete: R$ ${frete.toFixed(2).replace('.', ',')}`;
      mensagem += `\n*Total (produtos + frete): R$ ${totalComFrete.toFixed(2).replace('.', ',')}*`;
    } else {
      mensagem += ' um pedido.';
    }

    mensagem += '\n\nAguardo confirmação, obrigado!';

    const telefoneWhats = "5198097470";
    const url = `https://wa.me/${telefoneWhats}?text=${encodeURIComponent(mensagem)}`;
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

   

    // --- ESTADO INICIAL DA PÁGINA ---
    mostrarSecao('cones'); // Mostra a seção "Cones" por padrão
    atualizarContador();   // Inicia o contador (começará em 0)
    renderizarPedido();
    configurarSelecaoCoresCasquinha();
});
// Mapeamento dos bairros para o preço do frete
const precoFrete = {
  "aeroclube": 10.00,
  "bela-vista": 10.00,
  "centro": 11.00,
  "cinco-de-maio": 9.00,
  "estacao": 10.00,
  "faxinal": 15.00,
  "ferroviario": 13.00,
  "fortaleza": 16.00,
  "germano-henke": 11.00,
  "imigracao": 16.00,
  "industrial": 10.00,
  "municipal": 9.00,
  "olaria": 15.00,
  "panorama": 16.00,
  "progresso": 13.00,
  "rui-barbosa": 13.00,
  "santa-rita": 8.00,
  "santo-antonio": 11.00,
  "sao-joao": 14.00,
  "sao-paulo": 9.00,
  "sao-pedro": 9.00,
  "senai": 8.00,
  "tanac": 9.00,
  "timbauva": 9.00,
  "zootecnia": 11.00
};


const selectBairro = document.getElementById("selectBairro");
const resultadoFrete = document.getElementById("frete-resultado");

selectBairro.addEventListener("change", function() {
  const bairroSelecionado = this.value;

  if (bairroSelecionado && precoFrete[bairroSelecionado] !== undefined) {
    const preco = precoFrete[bairroSelecionado].toFixed(2);
    resultadoFrete.textContent = `Frete para ${bairroSelecionado.replace(/-/g, ' ')}: R$ ${preco.replace('.', ',')}`;
    
    // mostra com fade-in
    resultadoFrete.classList.add("show");
  } else {
    resultadoFrete.textContent = "";
    resultadoFrete.classList.remove("show");
  }
});

