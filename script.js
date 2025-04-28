// Elementos da página
const btnConteudo = document.getElementById('btn-conteudo');
const btnFavoritos = document.getElementById('btn-favoritos');
const tabConteudo = document.getElementById('tab-conteudo');
const tabFavoritos = document.getElementById('tab-favoritos');
const listaEstados = document.getElementById('lista-estados');
const listaFavoritos = document.getElementById('lista-favoritos');
const contadorFavoritos = document.getElementById('contador-favoritos');
const notificacao = document.getElementById('notificacao');

// URL da API do IBGE
const API_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';

// Bandeiras dos estados
const BANDEIRAS_ESTADOS = {
    'AC': 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Bandeira_do_Acre.svg',
    'AL': 'https://upload.wikimedia.org/wikipedia/commons/8/88/Bandeira_de_Alagoas.svg',
    'AP': 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Bandeira_do_Amap%C3%A1.svg',
    'AM': 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Bandeira_do_Amazonas.svg',
    'BA': 'https://upload.wikimedia.org/wikipedia/commons/2/28/Bandeira_da_Bahia.svg',
    'CE': 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Bandeira_do_Cear%C3%A1.svg',
    'DF': 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Bandeira_do_Distrito_Federal_%28Brasil%29.svg',
    'ES': 'https://upload.wikimedia.org/wikipedia/commons/4/43/Bandeira_do_Esp%C3%ADrito_Santo.svg',
    'GO': 'https://upload.wikimedia.org/wikipedia/commons/b/be/Flag_of_Goi%C3%A1s.svg',
    'MA': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Bandeira_do_Maranh%C3%A3o.svg',
    'MT': 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Bandeira_de_Mato_Grosso.svg',
    'MS': 'https://upload.wikimedia.org/wikipedia/commons/6/64/Bandeira_de_Mato_Grosso_do_Sul.svg',
    'MG': 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Bandeira_de_Minas_Gerais.svg',
    'PA': 'https://upload.wikimedia.org/wikipedia/commons/0/02/Bandeira_do_Par%C3%A1.svg',
    'PB': 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Bandeira_da_Para%C3%ADba.svg',
    'PR': 'https://upload.wikimedia.org/wikipedia/commons/9/93/Bandeira_do_Paran%C3%A1.svg',
    'PE': 'https://upload.wikimedia.org/wikipedia/commons/5/59/Bandeira_de_Pernambuco.svg',
    'PI': 'https://upload.wikimedia.org/wikipedia/commons/3/33/Bandeira_do_Piau%C3%AD.svg',
    'RJ': 'https://upload.wikimedia.org/wikipedia/commons/7/73/Bandeira_do_estado_do_Rio_de_Janeiro.svg',
    'RN': 'https://upload.wikimedia.org/wikipedia/commons/3/30/Bandeira_do_Rio_Grande_do_Norte.svg',
    'RS': 'https://upload.wikimedia.org/wikipedia/commons/6/63/Bandeira_do_Rio_Grande_do_Sul.svg',
    'RO': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Bandeira_de_Rond%C3%B4nia.svg',
    'RR': 'https://upload.wikimedia.org/wikipedia/commons/9/98/Bandeira_de_Roraima.svg',
    'SC': 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Bandeira_de_Santa_Catarina.svg',
    'SP': 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Bandeira_do_estado_de_S%C3%A3o_Paulo.svg',
    'SE': 'https://upload.wikimedia.org/wikipedia/commons/b/be/Bandeira_de_Sergipe.svg',
    'TO': 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Bandeira_do_Tocantins.svg'
};

// Bandeira do Brasil para fallback
const BANDEIRA_BRASIL = 'https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg';

// Mudar entre abas
btnConteudo.addEventListener('click', function() {
    tabConteudo.classList.add('active');
    tabFavoritos.classList.remove('active');
    btnConteudo.classList.add('active');
    btnFavoritos.classList.remove('active');
});

btnFavoritos.addEventListener('click', function() {
    tabConteudo.classList.remove('active');
    tabFavoritos.classList.add('active');
    btnConteudo.classList.remove('active');
    btnFavoritos.classList.add('active');
    carregarFavoritos();
});

// Carregar estados da API do IBGE
function carregarEstados() {
    listaEstados.innerHTML = '<p>Carregando estados...</p>';
    
    fetch(API_URL)
        .then(function(response) {
            return response.json();
        })
        .then(function(estados) {
            listaEstados.innerHTML = '';
            
            // Ordenar estados por nome
            estados.sort(function(a, b) {
                return a.nome.localeCompare(b.nome);
            });
            
            for(let i = 0; i < estados.length; i++) {
                const estado = estados[i];
                const card = document.createElement('div');
                card.className = 'estado-card';
                
                // Verificar se é favorito
                const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
                let ehFavorito = false;
                
                for(let j = 0; j < favoritos.length; j++) {
                    if(favoritos[j].id === estado.id) {
                        ehFavorito = true;
                        break;
                    }
                }
                
                const iconeCoracao = ehFavorito ? 'fa-heart' : 'fa-heart-o';
                
                // Obter URL da bandeira do estado
                const urlBandeira = BANDEIRAS_ESTADOS[estado.sigla] || BANDEIRA_BRASIL;
                
                // HTML do card - removida a informação de região
                card.innerHTML = `
                    <h3>${estado.nome}</h3>
                    <p>${estado.sigla}</p>
                    <img src="${urlBandeira}" alt="Bandeira ${estado.nome}" onerror="this.src='${BANDEIRA_BRASIL}'">
                    <button class="btn-favorito">
                        <i class="fa ${iconeCoracao}"></i>
                    </button>
                `;
                
                // Adicionar evento ao botão de favorito
                const btnFavorito = card.querySelector('.btn-favorito');
                btnFavorito.addEventListener('click', function() {
                    const icon = this.querySelector('i');
                    
                    if (icon.classList.contains('fa-heart-o')) {
                        icon.classList.remove('fa-heart-o');
                        icon.classList.add('fa-heart');
                        adicionarFavorito(estado, urlBandeira);
                    } else {
                        icon.classList.remove('fa-heart');
                        icon.classList.add('fa-heart-o');
                        removerFavorito(estado.id);
                    }
                });
                
                listaEstados.appendChild(card);
            }
        })
        .catch(function(erro) {
            listaEstados.innerHTML = '<p>Erro ao carregar estados: ' + erro.message + '</p>';
        });
}

// Funções para gerenciar favoritos
function adicionarFavorito(estado, urlBandeira) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    
    // Verificar se já existe
    let existe = false;
    for(let i = 0; i < favoritos.length; i++) {
        if(favoritos[i].id === estado.id) {
            existe = true;
            break;
        }
    }
    
    if(!existe) {
        // Adicionar URL da bandeira ao estado
        estado.urlBandeira = urlBandeira;
        
        favoritos.push(estado);
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        mostrarNotificacao('Estado adicionado aos favoritos!');
        atualizarContador();
    }
}

function removerFavorito(id) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    
    let novosFavoritos = [];
    for(let i = 0; i < favoritos.length; i++) {
        if(favoritos[i].id !== id) {
            novosFavoritos.push(favoritos[i]);
        }
    }
    
    localStorage.setItem('favoritos', JSON.stringify(novosFavoritos));
    mostrarNotificacao('Estado removido dos favoritos!');
    atualizarContador();
}

function carregarFavoritos() {
    let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    
    if (favoritos.length === 0) {
        listaFavoritos.innerHTML = '<p>Você ainda não tem favoritos.</p>';
        return;
    }
    
    listaFavoritos.innerHTML = '';
    
    for(let i = 0; i < favoritos.length; i++) {
        const estado = favoritos[i];
        const item = document.createElement('div');
        item.className = 'favorito-item';
        
        // Obter a URL da bandeira salva ou buscar novamente
        const urlBandeira = estado.urlBandeira || BANDEIRAS_ESTADOS[estado.sigla] || BANDEIRA_BRASIL;
        
        // Removida a informação de região nos favoritos também
        item.innerHTML = `
            <div>
                <img src="${urlBandeira}" alt="Bandeira ${estado.nome}" onerror="this.src='${BANDEIRA_BRASIL}'">
            </div>
            <div class="favorito-info">
                <h3>${estado.nome} (${estado.sigla})</h3>
            </div>
            <button class="btn-remover">Remover</button>
        `;
        
        // Adicionar evento ao botão de remover
        const btnRemover = item.querySelector('.btn-remover');
        btnRemover.addEventListener('click', function() {
            removerFavorito(estado.id);
            carregarFavoritos();
        });
        
        listaFavoritos.appendChild(item);
    }
}

function atualizarContador() {
    let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    contadorFavoritos.textContent = favoritos.length;
}

function mostrarNotificacao(mensagem) {
    notificacao.textContent = mensagem;
    notificacao.classList.add('show');
    
    setTimeout(function() {
        notificacao.classList.remove('show');
    }, 3000);
}

// Iniciar quando a página carregar
window.onload = function() {
    carregarEstados();
    atualizarContador();
};