-- apaga a tabela se ela já existir, para podermos rodar o script várias vezes sem erros
DROP TABLE IF EXISTS encomendas;

-- cria a tabela encomendas
CREATE TABLE encomendas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_nome TEXT NOT NULL,
    cliete_contato TEXT NOT NULL,
    descricao_bolo TEXT NOT NULL,
    data_entrega DATE NOT NULL,
    valor REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente'
);

sqlite> .schema encomendas
CREATE TABLE encomendas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_nome TEXT NOT NULL,
    cliete_contato TEXT NOT NULL,
    descricao_bolo TEXT NOT NULL,
    data_entrega DATE NOT NULL,
    valor REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente'
);

sqlite> .tables
encomendas  
sqlite> .quit 