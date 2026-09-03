# Saborê - Front-end de Receitas

Front-end em Next.js + TypeScript preparado para:

- Vercel no front-end
- Railway no back-end
- URLs de imagens vindas do Firebase Storage
- Home com sidebar e cards de receitas
- Login
- Cadastro
- Favoritos locais
- Layout responsivo

## 1. Instalação

```bash
npm install
```

## 2. Variável de ambiente

Crie `.env.local` na raiz:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Em produção, use a URL pública do Railway:

```env
NEXT_PUBLIC_API_URL=https://seu-backend.up.railway.app
```

## 3. Executar

```bash
npm run dev
```

Abra:

```text
http://localhost:3000
```

## Contrato esperado da API

### GET /recipes

Exemplo:

```json
[
  {
    "id": 1,
    "title": "Lasanha à bolonhesa",
    "description": "Camadas de massa, molho e queijo.",
    "imageUrl": "https://firebasestorage.googleapis.com/...",
    "prepTime": 55,
    "difficulty": "Médio",
    "category": "Massas",
    "rating": 4.8
  }
]
```

Filtros da sidebar são enviados como:

```text
GET /recipes?filter=weekly
GET /recipes?filter=quick
GET /recipes?filter=sweet
GET /recipes?filter=savory
GET /recipes?filter=favorites
```

Se seu back-end usar outros parâmetros, altere apenas `lib/api.ts`.

### POST /auth/login

Body:

```json
{
  "email": "usuario@email.com",
  "password": "123456"
}
```

Resposta esperada:

```json
{
  "token": "jwt-aqui",
  "user": {
    "id": 1,
    "name": "João",
    "email": "usuario@email.com"
  }
}
```

O front também aceita `accessToken` no lugar de `token`.

### POST /auth/register

Body enviado:

```json
{
  "name": "João",
  "email": "usuario@email.com",
  "password": "123456"
}
```

A confirmação de senha é validada apenas no front e não é enviada para a API.

## CORS no back-end

Como Vercel e Railway usarão domínios diferentes, configure CORS no back-end para permitir o domínio do front:

```text
https://seu-front.vercel.app
```

Durante desenvolvimento:

```text
http://localhost:3000
```

## Firebase

O front espera apenas receber `imageUrl` no JSON da receita. Portanto, o upload e o armazenamento da URL podem continuar sendo responsabilidade do back-end.

Neste starter as imagens usam a tag `<img>`, então você não precisa configurar `remotePatterns` do `next/image` para começar.

## Observação sobre autenticação

O starter armazena o JWT em `localStorage` para facilitar a integração inicial.

Para uma aplicação com requisitos maiores de segurança, prefira autenticação com cookie `HttpOnly` e ajuste o fluxo junto ao back-end.
