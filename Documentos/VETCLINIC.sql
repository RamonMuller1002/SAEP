CREATE TABLE tutor (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    nome VARCHAR(100),
    cpf CHAR(11) UNIQUE NOT NULL, 
    telefone CHAR(11) UNIQUE NOT NULL,
    endereco VARCHAR(200) NOT NULL
);

CREATE TABLE veterinario (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    crmv VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE pet (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    nome VARCHAR(255),
    especie VARCHAR(100),
    idade INT,
    id_tutor INT NOT NULL,
    FOREIGN KEY (id_tutor) REFERENCES tutor(id)
);

CREATE TABLE consulta (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    dia DATE NOT NULL,
    numero VARCHAR(5) UNIQUE NOT NULL,
    id_veterinario INT NOT NULL,
    id_pet INT NOT NULL,
    FOREIGN KEY (id_veterinario) REFERENCES veterinario(id),
    FOREIGN KEY (id_pet) REFERENCES pet(id)
);


ALTER TABLE tutor add column senha varchar(20)