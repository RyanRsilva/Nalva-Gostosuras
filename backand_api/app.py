#                   COMANDOS

# flask --app app --debug run
# .venv\Scripts\activate


# CODIGO

# modulos
import sqlite3
from flask import Flask, jsonify, request
import os


app = Flask(__name__)


def get_db_connection():
    """Cria uma conexão com o banco de dados"""

    conn = sqlite3.connect('dados/encomendas.db')
    # isso trasforma as linhas em objetos parecidos com dicionairos
    conn.row_factory = sqlite3.Row
    return conn


@app.route('/encomendas', methods=['GET'])
def get_encomendas():
    """Busca e retonna todas as encomendas do banco de dados"""
    conn = get_db_connection()
    cursor = conn.cursor()
    encomendas_rows = cursor.execute('SELECT * FROM encomendas;').fetchall()
    conn.close()

    # convertte as linhas do banco de dados em uma linha de dicionarios
    encomendas_list = [dict(row) for row in encomendas_rows]

    return jsonify(encomendas_list)


# recebendo os dados

@app.route('/encomendas', methods=['POST'])
def add_encomendas():
    """Adiciona uma nova encomenda ao banco de dados"""
    dados = request.get_json()
    if not dados:
        return jsonify({'ERRO': 'Nenhum dado JSON recebido'}), 400

    try:
        # extrai cada valor, garantindo que os campos obrigatorios existem
        cliente_nome = dados['cliente_nome']
        cliente_contato = dados['cliente_contato']
        descricao_bolo = dados['descricao_bolo']
        data_entrega = dados['data_entrega']
        valor = dados['valor']

    except (TypeError, KeyError) as e:
        # se request.json for none (typeerro) ou faltar uma chave (keyerro)
        return jsonify({'ERRO': 'Dados errados ou faltando'}), 400

    try:

        conn = get_db_connection()
        cursor = conn.cursor()

        sql = """
            INSERT INTO encomendas (
                
            cliente_nome,
            cliente_contato, 
            descricao_bolo, 
            data_entrega,valor
            
            ) 
            
            VALUES (?,?,?,?,?);
        """

        cursor.execute(sql, (cliente_nome, cliente_contato,
                             descricao_bolo, data_entrega, valor))

        conn.commit()
        conn.close()

    except sqlite3.Error as e:

        return jsonify({'erro': f'Erro no banco de dados: {e}'}), 500

    return jsonify({'mensagem': 'Encomendas criadas com sucesso'}), 201
