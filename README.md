# Projeto-Labeddit-BackEnd

<h4 align="left">
    Projeto Labeddit Full Stack - BootCamp Labenu.
    </h4>
---

## 🕵Sobre

    Trata se de um projeto Integrador - Full Stack, desenvolvido durante o BootCamp Labenu, com intuito de conectar o usuário a uma rede social chamada LaBeddit, no qual você cria o cadastro para que acesse e possa criar posts, curtí los e comentá los. Ele subdivide-se em *2 repositórios*, sendo esse BackEnd, e o outro FrontEnd.
    A API documentada, no qual explica o passo a passo exemplificado de cada endpoint.

---

## 👩🏾Quem Faz

- Projeto desenvolvido individualmente, by me _Priscila de Assumpção de Moraes_, sob supervisão dos instrutores Labenu.

---

## 🧭Status do Projeto

⏳ Feito _PORÉM... há algumas melhorias a serem feitas! Ainda em Evolução!..._

---

## 🎯Objetivo do Projeto

Este é um projeto BackEnd, desenvolvido no bootcamp da Labenu, cujo o principal objetivo é estudar, conhecer, absorver, errar e aprender (TUDO JUNTO!!):

> NodeJS
> Typescript
> Express
> SQL e SQLite
> Knex
> POO
> Arquitetura em camadas
> Geração de UUID
> Geração de hashes
> Autenticação e autorização
> Roteamento
> Postman - (API documentada)

## ☑️Requisitos de Funcionalidade

- Documentação Postman de todos os endpoints (exemplificados) => https://documenter.getpostman.com/view/27687742/2s9Y5ctg6p:

* USERS:

- [x] POST - SIGNUP => Utilizado para cadastrar os users, e devolve um token jwt;
- [x] POST - LOGIN => Utilizado para logar, e devolve um token jwt;
- [x] GET (acessa todos os users) => Requer o token e apenas o role ADMIN, tem acesso.

* POSTS:

- [x] POST (cria um post) => Requer o token jwt gerado no signup ou login;
- [x] GET (acessa todos os posts) => Requer o token, porém apenas o user role ADMIN, tem acesso;
- [x] GET (acessa os posts pelo Id) => Requer o token, porém apenas o user role ADMIN, tem acesso;
- [x] PUT (edita o post) => Requer o token, sendo que apenas quem criou o post poderá editá-lo;
- [x] DELETE (deleta o post) => Requer o token, sendo que ADMIN é o único que poderá deletar o post.

* LIKES_DISLIKES:

- [x] LIKE_DISLIKE => Em um único endpoint funciona para ambos. Requer token, quem cria não pode dar like e dislike ao mesmo tempo.

* COMMENTS:

- [x] POST (cria um comentário) => Requer o token jwt gerado no signup ou login.

---

## 💡Concepção do Projeto

- [x] Modelagem do Banco de Dados: https://dbdiagram.io/d/64f29c0f02bd1c4a5ed59218

Para esse projeto são modelados cinco entidades :

→ Users - id, name, email, password, role e created_at;
→ Posts - id, creator_id, content, comments, likes, dislikes, created_at e update_at;
→ Likes_dislikes - user_id, post_id e like;
→ comments_posts: id, creator_id, content, likes, dislikes, created_at, updated_at, post_id;
→ likes_dislikes_comments: user_id, comments_id, like;

---

## 🔗Link para Acessar

- Link do render: https://pr-labeddit-backend-final.onrender.com
- Link do FrontEnd: https://github.com/Priapril08/Front-End-Lab-Eddit 

---

## 🛰Rodando o Projeto

→ npm run dev: conecta o banco de dados, mantém o servidor localhost:3003 atualizado automaticamente, em caso de alterações.

---

### Bibliotecas e Framework

> bcryptjs,
> cors,
> dotenv",
> express,
> jsonwebtoken,
> knex,
> sqlite3,
> uuid,
> zod
