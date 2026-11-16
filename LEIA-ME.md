# Relatório Fácil – Semana 1

O que já funciona: criar conta, entrar, cadastrar clientes, enviar PDFs por mês, baixar e apagar.
Ainda NÃO tem: e-mail ao cliente, página pública do cliente, cobrança (semanas 2 e 3).

## Passo a passo (sem instalar nada)
1. Crie uma conta grátis em supabase.com e um projeto novo. Guarde a senha do banco.
2. No Supabase: SQL Editor > New query > cole o conteúdo de `supabase.sql` > Run.
3. No Supabase: Project Settings > API. Copie a "Project URL" e a chave "anon public".
4. Suba estes arquivos num repositório do GitHub (Add file > Upload files).
   Não suba o arquivo `.env.local` (a chave fica só no Vercel).
5. Em vercel.com, entre com o GitHub > Add New Project > escolha o repositório.
6. Em Environment Variables, adicione:
   NEXT_PUBLIC_SUPABASE_URL = (a URL)
   NEXT_PUBLIC_SUPABASE_ANON_KEY = (a chave anon public)
7. Clique em Deploy. O Vercel gera o endereço do site.
8. No Supabase: Authentication > URL Configuration > coloque o endereço do Vercel em "Site URL".

## Teste
Crie uma conta, adicione um cliente, envie um PDF, baixe, apague.
Se algo der erro, copie a mensagem exata e mande para o Claude.
