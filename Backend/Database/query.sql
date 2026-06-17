CREATE DATABASE Corretagem_Imoveis;
USE Corretagem_Imoveis;

CREATE TABLE Usuarios(
	id_usuario INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
	nome_usuario VARCHAR(50) NOT NULL,
    senha_usuario VARCHAR(255) NOT NULL,
    apelido_usuario VARCHAR(50) NOT NULL,
    telefone_usuario VARCHAR(50) NOT NULL,
    email_usuario VARCHAR(100) NOT NULL,
    instagram_usuario VARCHAR(50),
    nivel_usuario VARCHAR (50) NOT NULL
);

CREATE TABLE Imoveis(
	id_imovel INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    titulo_imovel VARCHAR(255) NOT NULL,
    descricao_imovel TEXT,
    preco_imovel DECIMAL(12,2) NOT NULL,
    
    tipo_imovel VARCHAR(50) NOT NULL, -- Casa, Apartamento, Terreno
    finalidade_imovel VARCHAR(50) NOT NULL, -- Venda, Aluguel
    estagio_imovel VARCHAR(50) NOT NULL, -- Concluído, Em construção, Na planta
    status_imovel VARCHAR(50) NOT NULL, -- Disponível, Vendido, Alugado
    
    cep_imovel VARCHAR(10), -- Buscar na API
    cidade_imovel VARCHAR(100) NOT NULL,
    bairro_imovel VARCHAR(100) NOT NULL,
    endereco_imovel VARCHAR(255) NOT NULL,
    
    area_imovel VARCHAR(20) NOT NULL, -- Valor + Unidade de medida
    qtd_quartos_imovel INT,
    qtd_suites_imovel INT,
    qtd_banheiros_imovel INT,
    qtd_vagas_imovel INT,
    
    data_criacao_imovel DATETIME
);

ALTER TABLE Imoveis ADD COLUMN uso_imovel VARCHAR (50) NULL;
ALTER TABLE Imoveis ADD COLUMN link_instagram_imovel VARCHAR (255) NULL;

CREATE TABLE Imagens_Imoveis(
	id_imagem INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    endereco_imagem VARCHAR(500) NOT NULL,
    posicao_imagem INT NOT NULL,
    
	id_imovel_imagem INT NOT NULL,
    FOREIGN KEY(id_imovel_imagem) REFERENCES Imoveis(id_imovel) ON DELETE CASCADE
);
