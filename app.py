#                   COMANDOS
# flask --app app --debug run
# .venv\Scripts\activate

#                                                  CODIGO

# modulos
import sqlite3
from flask import Flask, jsonify, request, render_template
import os


app = Flask(__name__)


# Rota para acessar a tela da Tia no navegador
@app.route('/admin')
def admin_panel():
    return render_template('admin/painel.html')


# Rota Principal (Vitrine do Cliente)
@app.route('/')
def index():
    return render_template('client/index.html')


def get_db_connection():
    """Cria uma conexão com o banco de dados"""
    conn = sqlite3.connect('dados/encomendas.db')
    # isso trasforma as linhas em objetos parecidos com dicionairos
    conn.row_factory = sqlite3.Row
    return conn



#                             ENDPOINTS

#                          methods=['GET']                        

@app.route('/encomendas', methods=['GET'])  # BUSCAR / LER DADOS
def get_encomendas():
    """Busca e retonna todas as encomendas do banco de dados"""
    conn = get_db_connection()
    cursor = conn.cursor()
    encomendas_rows = cursor.execute('SELECT * FROM encomendas;').fetchall()
    conn.close()

    # convertte as linhas do banco de dados em uma linha de dicionarios
    encomendas_list = [dict(row) for row in encomendas_rows]
    return jsonify(encomendas_list)



@app.route('/produtos', methods=['GET'])
def get_produtos():
    # conexao com o banco
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM produtos")
    
    # convertte as linhas do banco de dados em uma linha de dicionarios
    produtos = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    # retorrna os valores que estao em produtos
    return jsonify(produtos)



# BUSCAR / LER DADOS DE UMA ENCOMENDA ESPECIFICA
@app.route('/encomendas/<int:id>', methods=['GET'])
def get_encomenda(id):
    """Busca e retonna uma encomenda especifica do banco de dados"""
    conn = get_db_connection()
    cursor = conn.cursor()
    encomenda_row = cursor.execute(
        'SELECT * FROM encomendas WHERE id = ?;', (id,)).fetchone()
    conn.close()

    if encomenda_row is None:
        return jsonify({'erro': 'Encomenda não encontrada'}), 404

    # convertte a linha do banco de dados em um dicionario
    encomenda_dict = dict(encomenda_row)

    return jsonify(encomenda_dict)



#                     methods=['POST']

# recebendo os dados
@app.route('/encomendas', methods=['POST'])  # CRIAR NOVOS DADOS
def add_encomendas():
    dados = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # adiciona novas colunas na querry SQL
    query = """
        INSERT INTO encomendas (
            
            cliente_nome, cliente_contato, descricao_bolo,
            data_entrega, valor, status, massa_escolhida,
            recheio_escolhido, foto_referencia
            
        ) VALUES (?,?,?,?,?,?,?,?,?)
    """
    
    cursor.execute(query, (
            dados['cliente_nome'], 
            dados['cliente_contato'], 
            dados['descricao_bolo'],
            dados['data_entrega'], 
            dados['valor'], 
            dados.get('status', 'pendente'),
            dados.get('massa_escolhida'), # .get evita erro se o campo for vazio
            dados.get('recheio_escolhido'),
            dados.get('foto_referencia')
        ))
    
    conn.commit()
    conn.close()
    return jsonify({"STATUS: SUCESSO"}), 201
    


# CRUD para dar update nas encomendas

# ATUALIZA DADOS JÁ EXISTENTES.
@app.route('/encomendas/<int:id>', methods=['PUT'])
def update_encomenda(id):
    # essa parte atualiza o status de uma encomenda existente.

    try:
        dados = request.json
        # extrai o novo status do JSON recebido / já esta dentro de um try except, para caso o json esteja vazio ou a chave esteja faltando
        novo_status = dados['status']

    except (TypeError, KeyError):
        return jsonify({'erro:' 'Dados invalidos ou faltando. É preciso enviar um JSON com a chave "STATUS".'}), 400

    # verifica se a encomenda existe antes de tentar atualizar
    conn = get_db_connection()  # conecta com o banco de dados
    encomenda_existente = conn.execute(
        'SELECT * FROM encomendas WHERE id = ?', (id,)).fetchone()
    if encomenda_existente is None:
        conn.close()
        return jsonify({'erro': 'Encomenda não encontrada'}), 404

    # Se existir ele atualiza
    conn.execute('UPDATE encomendas SET status = ? WHERE id = ?', (novo_status, id))
    conn.commit()
    conn.close()

    return jsonify({'mesagem': f'Encomenda {id} atualizada com sucesso para status "{novo_status}".'})


# CRUD para deletar as encomendas dentro do banco de dados

@app.route('/encomendas/<int:id>', methods=['DELETE'])   # APAGAR DADOS
def deletar_dados(id):

    # acessa o banco de dados e verifica se o valor ainda existe dentro dele
    conn = get_db_connection()
    verifica_se_ainda_existe = conn.execute(
        'SELECT * FROM encomendas WHERE id = ?', (id,)).fetchone()
    if verifica_se_ainda_existe is None:
        conn.close()
        return jsonify({'erro': 'valor não encontrado, verifique novamente'}), 404

    # caso os dados passem pela duas verificações, ele e deletado.
    conn.execute('DELETE FROM encomendas WHERE id = ?', (id,))
    conn.commit()
    conn.close()

    return jsonify({'mensagem': f'Encomenda {id} apagada com sucesso'}), 200


