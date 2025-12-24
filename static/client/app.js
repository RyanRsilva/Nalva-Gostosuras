// Função para abrir o modal com os dados do bolo selecionado
function abrirModalPedido(nomeBolo, valorBolo) {
  const modal = document.getElementById("modal-pedido");
  const titulo = document.getElementById("modal-titulo-bolo");
  const inputBolo = document.getElementById("pedido-bolo");
  const inputValor = document.getElementById("pedido-valor");

  // Preenche os dados escondidos
  titulo.innerText = `Encomendar: ${nomeBolo}`;
  inputBolo.value = nomeBolo;
  inputValor.value = valorBolo;

  modal.style.display = "flex";
}

function fecharModal() {
  document.getElementById("modal-pedido").style.display = "none";
}

// Fechar ao clicar fora
window.onclick = function (event) {
  const modal = document.getElementById("modal-pedido");
  if (event.target == modal) {
    fecharModal();
  }
};

// Função para enviar o pedido para a API (Backend)
async function enviarPedido(event) {
  event.preventDefault();

  const dados = {
    cliente_nome: document.getElementById("cliente-nome").value,
    cliente_contato: document.getElementById("cliente-contato").value,
    descricao_bolo: document.getElementById("pedido-bolo").value,
    data_entrega: document.getElementById("data-entrega").value,
    valor: parseFloat(document.getElementById("pedido-valor").value),
    status: "Pendente",
  };

  try {
    const response = await fetch("/encomendas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    if (response.ok) {
      alert("🎉 Pedido realizado com sucesso! A Nalva agradece.");
      fecharModal();
      document.getElementById("form-pedido").reset();
    } else {
      alert("Erro ao realizar pedido. Tente novamente.");
    }

    // saida em caso de erro na conclusao do pedido
  } catch (erro) {
    console.error(erro);
    alert("Erro de conexão.");
  }
}

// essa func sera chamada assim que a pagina carregar
document.addEventListener("DOMContentLoaded", () => {
  carregarProdutos();
});

async function carregarProdutos() {
  const containerComuns = document.getElementById("grade-comuns");
  const containerPersonalizados = document.getElementById(
    "grade-personalizados"
  );

  try {
    const response = await fetch("/produtos");
    const listaProdutos = await response.json();

    // Limpa containers
    containerComuns.innerHTML = "";
    containerPersonalizados.innerHTML = "";

    listaProdutos.forEach((produto) => {
      // Define a imagem (se vier vazio do banco, usa o placeholder)
      const imagem =
        produto.imagem_url && produto.imagem_url.length > 5
          ? produto.imagem_url
          : "https://placehold.co/300x250/FF9EAA/white?text=Bolo";

      // HTML COMUM A TODOS
      let htmlCard = `
                <div class="product-card">
                    <div class="product-image">
                        <img src="${imagem}" alt="${produto.nome}">
                        <div class="price-tag">
                            <span class="currency">R$</span>
                            <span class="value">${produto.preco_base}</span>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${produto.nome}</h3>
                        <p class="product-description">${
                          produto.descricao || ""
                        }</p>
            `;

      // DECISÃO: É Comum ou Personalizado?
      if (produto.tipo === "comum") {
        // Bolo Comum: Botão "Ver Detalhes"
        htmlCard += `
                        <button class="order-button" onclick="abrirDetalhesComuns('${produto.nome}', '${produto.ingredientes}', '${produto.tamanhos}')">
                            Ver Detalhes
                        </button>
                    </div></div>`;
        containerComuns.innerHTML += htmlCard;
      } else {
        // Bolo Personalizado: Botão "Montar Agora"
        htmlCard += `
                        <button class="order-button" style="background-color: #d63384;" onclick="abrirMontagemPersonalizada('${produto.nome}')">
                            Montar Agora 🎨
                        </button>
                    </div></div>`;
        containerPersonalizados.innerHTML += htmlCard;
      }
    });
  } catch (erro) {
    console.error("Erro:", erro);
  }
}

// Funções Placeholder (Crie elas vazias por enquanto para não dar erro)
function abrirDetalhesComuns(nome, ingredientes, tamanhos) {
  alert(
    `Detalhes de ${nome}:\nIngredientes: ${ingredientes}\nTamanhos: ${tamanhos}`
  );
  // Na próxima etapa transformaremos esse alert em um Modal Bonito
}

function abrirMontagemPersonalizada(nome) {
  alert(`Vamos montar o ${nome}! (Em breve)`);
}
