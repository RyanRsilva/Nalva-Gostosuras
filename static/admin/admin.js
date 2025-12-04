
document.addEventListener('DOMContentLoaded', () => {
    // Assim que a página carregar, chamamos a função para buscar os dados
    carregarEncomendas();
});

async function carregarEncomendas() {
    const tabelaCorpo = document.getElementById('tabela-corpo');
    tabelaCorpo.innerHTML = '<tr><td colspan="8">Carregando...</td></tr>';

    try {
        // 1. O FETCH: Bate na porta do seu backend Flask
        const response = await fetch('/encomendas'); 
        
        if (!response.ok) {
            throw new Error('Erro na requisição');
        }

        // 2. O JSON: Converte a resposta em dados que o JS entende
        const encomendas = await response.json();

        // Limpa a mensagem de carregando
        tabelaCorpo.innerHTML = '';

        // 3. O LOOP: Cria uma linha para cada encomenda
        encomendas.forEach(pedido => {
            const linha = document.createElement('tr');

            // Monta o HTML da linha
            linha.innerHTML = `
                <td>#${pedido.id}</td>
                <td>${pedido.cliente_nome}</td>
                <td>${pedido.cliente_contato}</td> <td>${pedido.descricao_bolo}</td>
                <td>${pedido.data_entrega}</td>
                <td>R$ ${pedido.valor}</td>
                <td>
                    <span class="status-${pedido.status.toLowerCase()}">
                        ${pedido.status}
                    </span>
                </td>
                <td>
                    <button onclick="editarPedido(${pedido.id})">✏️</button>
                    <button onclick="deletarPedido(${pedido.id})">🗑️</button>
                </td>
            `;

            tabelaCorpo.appendChild(linha);
        });

        if (encomendas.length === 0) {
            tabelaCorpo.innerHTML = '<tr><td colspan="8">Nenhuma encomenda encontrada.</td></tr>';
        }

    } catch (erro) {
        console.error('Erro:', erro);
        tabelaCorpo.innerHTML = '<tr><td colspan="8" style="color: red;">Erro ao carregar dados. Verifique se o servidor está rodando.</td></tr>';
    }
}

// Funções placeholder para o futuro
function editarPedido(id) {
    alert(`Vamos editar o pedido ${id} em breve!`);
}

function deletarPedido(id) {
    if(confirm(`Tem certeza que deseja apagar o pedido ${id}?`)) {
        // Aqui chamaremos a Task 2.4 (DELETE via JS)
        alert('Funcionalidade em construção');
    }
}