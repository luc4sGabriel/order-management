# 📦 Order Management API

API REST para gerenciamento de pedidos, com autenticação, paginação, controle de status e regras de negócio bem definidas.

---

## 🚀 Tecnologias

- Node.js  
- TypeScript  
- Express  
- MongoDB + Mongoose  
- JWT (Autenticação)  
- Vitest (Testes unitários)  
- Insomnia (Testes de API)  

---

## 📂 Arquitetura

O projeto segue uma separação clara de responsabilidades:

src/  
├── controllers/     # Entrada HTTP (Request / Response)  
├── services/        # Regras de negócio  
├── repositories/    # Acesso a dados (MongoDB)  
├── models/          # Schemas Mongoose  
├── routes/          # Rotas da aplicação  
├── middlewares/     # Middlewares (auth, etc)  
├── dtos/            # Data Transfer Objects  
└── tests/           # Testes unitários  

---

## 🔐 Autenticação

A API utiliza JWT para autenticação.

Após o login, o token deve ser enviado no header:

Authorization: Bearer <token>

---

## 📌 Regras de Negócio

### 📄 Orders (Pedidos)

Validação de Negócio:  

- Não permitir criação de pedidos sem serviços ou com valor total zerado.  

Fluxo de Status:

- Endpoint PATCH /orders/:id/advance.

- A transição deve respeitar a ordem estrita: CREATED -> ANALYSIS -> COMPLETED.

- Bloquear tentativas de pular etapas ou retroceder.

Testes (Vitest):

- Teste unitário garantindo que a lógica de transição de state funciona e bloqueia ações inválidas.

---

## 🔁 Fluxo de Status

Endpoint:

PATCH /order/:id/advance  

A API automaticamente avança o pedido para o próximo state válido.


# COMO RODAR O PROJETO ✅🔛


## Clonar o repositório

Clone o projeto para sua máquina:

Entre na pasta do projeto:

cd backend

---

## Instalar dependências

Dentro da pasta do projeto, execute:

npm install

Isso vai instalar todas as dependências necessárias.

---

## Configurar variáveis de ambiente

Crie um arquivo chamado **.env** na raiz do projeto.

Ja deixei um env.example pra ajudar 

### Observações:
- Você pode usar qualquer string como JWT_SECRET
- O MongoDB precisa estar rodando nesse endereço  

---

## Rodar o MongoDB

###  MongoDB com Docker
Usar Docker:

docker run -d \
  --name mongo-orders \
  -p 27017:27017 \
  mongo

---

Ja deixei um docker compose pronto pra ajudar 

docker compose up -d 
[pra subir o server do docker e ja vai estar rodando ele]

## Rodar a aplicação

Modo desenvolvimento (com hot reload):

npm run dev  

---

## Documentacao

### Rota default do swagger para documentacao

http://localhost:3000/docs/

Mostra todos os endpoints da api

---

## Rodar testes unitários

Para executar os testes:

npm run test  

Os testes garantem:
- Regras de negócio
- Transições válidas de state
- Bloqueio de ações inválidas

---

## ✅ Pronto