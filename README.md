# Express MVC Base

Sistema base MVC com Express.js, MongoDB e autenticação de usuários.

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/ryanmiura/express-mvc-base.git
cd express-mvc-base
```

2. Copie o arquivo de exemplo de variáveis de ambiente:
```bash
cp .env.example .env
```

3. Configure as variáveis de ambiente no arquivo `.env` conforme necessário.

4. Inicie os containers Docker:
```bash
docker-compose up -d
```

## 🔧 Comandos Disponíveis

- `npm start`: Inicia a aplicação em modo produção
- `npm run dev`: Inicia a aplicação em modo desenvolvimento com hot-reload
- `npm test`: Executa os testes manuais

## 📍 Rotas Disponíveis

### Páginas (Views)
- `GET /`: Página inicial (requer autenticação)
- `GET /login`: Página de login (apenas para visitantes)
- `GET /register`: Página de registro (apenas para visitantes)

### API de Autenticação
- `POST /auth/register`: Registro de novo usuário
  ```json
  {
    "email": "usuario@exemplo.com",
    "password": "Senha123"
  }
  ```
- `POST /auth/login`: Login de usuário
  ```json
  {
    "email": "usuario@exemplo.com",
    "password": "Senha123"
  }
  ```
- `GET /auth/logout`: Logout do usuário

## 📝 Requisitos de Senha
- Mínimo de 6 caracteres
- Pelo menos um número
- Pelo menos uma letra maiúscula

## 🔒 Fluxo de Autenticação

1. Acesse `/register` para criar uma nova conta
2. Faça login em `/login` com as credenciais cadastradas
3. Após autenticado, você será redirecionado para a página inicial
4. Para sair, utilize o endpoint `/auth/logout`

## 🐳 Containers Docker

O projeto utiliza dois containers:
- **MongoDB**: Banco de dados (porta 27017)
- **Backend**: Aplicação Node.js (porta 3000)

## 🔍 Logs

Os logs da aplicação podem ser visualizados através do Docker:
```bash
docker logs backend-app
