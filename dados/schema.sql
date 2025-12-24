-- Active: 1764814359397@@127.0.0.1@3306
-- apaga a tabela se ela já existir, para podermos rodar o script várias vezes sem erros
DROP TABLE IF EXISTS encomendas;

sqlite>. schema encomendas
---------------- criacao das tabelas ---------

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

--   tabela para criar o catálogo de produtos
CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL, -- 'comum' ou 'personalizado'
    preco_base REAL NOT NULL,
    descricao TEXT,
    ingredientes TEXT,
    tamanhos TEXT, -- Ex: "1kg, 2kg, 3kg"
    imagem_url TEXT
);




------------------------------- visualizacao dos dados ---------------

-- VISU DA TABELA produtos
SELECT * FROM produtos


-- VISU DA TABELA encomanedas
SELECT * FROM encomendas



------------------------------ inserir valores ------------------------


INSERT INTO produtos
VALUES (3,'Bolo de cenoura','comum',40.00,'bolo de cenoura muito gostoso e com o recheio do jeito que voce quer','Farinha, cacau 50%, leite, ovos','2kg','https://placehold.co/300x250')



INSERT INTO produtos
VALUES (2,'Monte seu Bolo','personalizado',0.00, 'monte o seu bolo da forma como voce preferir','os ingredintes sao escolhidos por voce','tamanhos disponiveis: 2kg, 5kg, 10kg',NULL)
    