import sqlite3

# conecta o banco de dados (cria o arquivo caso ele não exista)
connection = sqlite3.connect('dados/encomendas.db')

# abre o arquivo schama.sql e lê seu conteúdo
with open('dados/schema.sql') as f:
    connection.executescript(f.read())

# confirma as alterações e fecha a conexão
connection.commit()
connection.close()

print("Banco de dados inicializado com sucesso.")
