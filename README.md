# Sistema de Gestão de Academia

Sistema completo para gestão de academias, desenvolvido com backend em Node.js/Express e frontend em React. Ideal para academias que desejam automatizar processos, melhorar a experiência dos alunos e facilitar a administração.

## 🚩 Visão Geral

Este sistema permite o controle total de uma academia, desde o cadastro de alunos até a gestão de planos, pagamentos, relatórios e comunicação por email. Tudo em uma interface moderna e intuitiva.

## 🎯 Funcionalidades Principais

### 1. Autenticação de Usuários
- Cadastro e login seguro com JWT.
- Diferentes níveis de acesso (admin, gestor, aluno).
- Recuperação de senha por email.

### 2. Gestão de Planos
- Criação, edição e exclusão de planos de academia.
- Definição de preços, duração e benefícios de cada plano.
- Visualização de planos ativos e inativos.

### 3. Subscrições
- Matrícula de alunos em planos.
- Controle de vigência e renovação automática de subscrições.
- Histórico de subscrições por aluno.

### 4. Pagamentos
- Integração com Stripe para pagamentos online.
- Registro de pagamentos manuais.
- Visualização de status de pagamento (pago, pendente, atrasado).

### 5. Relatórios
- Geração de relatórios financeiros e de frequência.
- Exportação de dados para análise.
- Filtros por período, plano e status.

### 6. Envio de Emails
- Notificações automáticas de renovação, pagamento e boas-vindas.
- Integração com SendGrid.
- Personalização de templates de email.

## 🖥️ Como Usar

1. **Administra a academia:**
   - Cadastre planos e defina regras.
   - Gerencie usuários e permissões.
2. **Aluno se cadastra:**
   - Escolhe um plano e realiza o pagamento.
   - Recebe confirmação e acesso ao painel.
3. **Acompanhe tudo pelo dashboard:**
   - Veja relatórios, status de pagamentos e subscrições.
   - Receba notificações automáticas por email.

## 🔧 Tecnologias Utilizadas

**Backend:**
- Node.js + Express
- SQLite (banco de dados)
- JWT (autenticação)
- Stripe (pagamentos)
- SendGrid (emails)

**Frontend:**
- React 19
- Vite
- Material-UI
- React Router
- Axios

## 🛠️ Desenvolvimento Local

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```


## 📝 Notas
- O sistema é modular e pode ser expandido conforme a necessidade da academia.