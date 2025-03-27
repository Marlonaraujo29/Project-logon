const express = require('express');
const mssql = require('mssql');
const path = require('path');
const app = express();
const port = 3000;

// Middleware para processar dados do formulário
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Rota para servir o formulário HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'formulario.html'));
});

// Configuração do banco de dados
const config = {
    user: 'Marlon',
    password: '2005',
    server: 'localhost',
    database: 'AutenticacaoDB',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// Conectar ao banco de dados
mssql.connect(config)
    .then(() => {
        console.log('Conexão bem-sucedida ao banco de dados.');
    })
    .catch((err) => {
        console.error('Erro ao conectar ao banco de dados:', err);
    });

// Rota para processar o formulário
app.post('/cadastrar', async (req, res) => {
    const { name, email, password } = req.body; // Captura os dados do formulário

    try {
        // Cria uma nova conexão para a requisição
        const pool = await mssql.connect(config);
        const request = pool.request();

        // Query para inserir os dados no banco de dados
        const query = `
            INSERT INTO Usuarios (Nome, Email, Senha)
            VALUES (@name, @email, @password)
        `;

        // Add parâmetros à requisição
        request.input('name', mssql.VarChar, name);
        request.input('email', mssql.VarChar, email);
        request.input('password', mssql.VarChar, password);

        await request.query(query);
        console.log('Usuário cadastrado com sucesso!');
        res.send('Usuário cadastrado com sucesso!');
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err);
        res.status(500).send('Erro ao cadastrar usuário.');
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}`);
});