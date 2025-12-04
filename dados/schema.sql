DROP TABLE IF EXISTS encomendas;

CREATE TABLE encomendas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_nome TEXT NOT NULL,
    cliente_contato TEXT NOT NULL,
    descricao_bolo TEXT NOT NULL,
    data_entrega DATE NOT NULL,
    valor REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente'
);