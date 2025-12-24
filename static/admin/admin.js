document.addEventListener("DOMContentLoaded", () => {
  // Assim que a página carregar, chamamos a função para buscar os dados
  carregarEncomendas();
});

async function carregarEncomendas() {
  const tabelaCorpo = document.getElementById("tabela-corpo");
  // Loader estilizado
  tabelaCorpo.innerHTML =
    '<tr><td colspan="8" style="text-align:center; padding: 2rem; color: #d63384;">Carregando doçuras... 🍰</td></tr>';

  try {
    const response = await fetch("/encomendas");
    if (!response.ok) throw new Error("Erro na requisição");
    const encomendas = await response.json();

    tabelaCorpo.innerHTML = "";

    if (encomendas.length === 0) {
      tabelaCorpo.innerHTML =
        '<tr><td colspan="8" style="text-align:center; padding: 2rem; color: #594a4e;">Nenhuma encomenda encontrada.</td></tr>';
      return;
    }

    encomendas.forEach((pedido) => {
      const linha = document.createElement("tr");

      // Lógica para definir a cor do Status (Badge)
      let badgeClass = "badge-pending";
      let statusTexto = pedido.status;

      // Normaliza o texto para comparar (evita erro se vier 'Pendente' ou 'pendente')
      const statusLower = pedido.status.toLowerCase();
      if (statusLower === "produção" || statusLower === "producao")
        badgeClass = "badge-production";
      if (statusLower === "entregue") badgeClass = "badge-delivered";

      // Monta o HTML com os ícones e classes do Tema Rosa
      linha.innerHTML = `
                <td class="id-cell">#${pedido.id}</td>
                <td style="font-weight: 500;">${pedido.cliente_nome}</td>
                <td>
                    <div class="contact-cell">
                        <svg class="whatsapp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        ${pedido.cliente_contato}
                    </div>
                </td>
                <td>${pedido.descricao_bolo}</td>
                <td>${pedido.data_entrega}</td>
                <td class="value-cell">R$ ${pedido.valor}</td>
                <td><span class="badge ${badgeClass}">${pedido.status}</span></td>
                <td>
                    <div class="actions-cell">
                        <button onclick="editarPedido(${pedido.id})" class="btn-action btn-edit" title="Editar">
                            <svg class="action-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onclick="deletarPedido(${pedido.id})" class="btn-action btn-delete" title="Excluir">
                            <svg class="action-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                </td>
            `;
      tabelaCorpo.appendChild(linha);
    });
  } catch (erro) {
    console.error("Erro:", erro);
    tabelaCorpo.innerHTML =
      '<tr><td colspan="8" style="color: #dc3545; text-align: center;">Erro ao carregar dados.</td></tr>';
  }
}

// FUNÇÕES DO MODAL (Adicione ao final do arquivo)

function abrirModal() {
  document.getElementById("modal-novo-pedido").style.display = "flex";
}
function fecharModal() {
  document.getElementById("modal-novo-pedido").style.display = "none";
}
// Fechar se clicar fora da janela
document.getElementById("modal-novo-pedido").addEventListener("click", (e) => {
  if (e.target === document.getElementById("modal-novo-pedido")) {
    fecharModal();
  }
});

// Lógica de Criar Pedido (POST)
async function criarPedido(event) {
  event.preventDefault(); // Impede a página de recarregar

  // Pegando os valores do formulário
  const dados = {
    cliente_nome: document.getElementById("cliente_nome").value,
    cliente_contato: document.getElementById("cliente_contato").value,
    descricao_bolo: document.getElementById("descricao_bolo").value,
    data_entrega: document.getElementById("data_entrega").value,
    valor: parseFloat(document.getElementById("valor").value),
    status: "Pendente", // Status padrão
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
      alert("Encomenda criada com sucesso! 🎂");
      fecharModal();
      document.getElementById("form-novo-pedido").reset(); // Limpa o formulário
      carregarEncomendas(); // Atualiza a tabela na hora
    } else {
      const erro = await response.json();
      alert("Erro: " + (erro.ERRO || "Falha ao criar"));
    }
  } catch (e) {
    console.error(e);
    alert("Erro de conexão com o servidor.");
  }
}
