# Gym IEFP - Sistema de Gestão de Academia

Sistema completo de gestão de academia com backend em Node.js/Express e frontend em React.

## 🚀 Deploy Gratuito

### Backend (Render.com)

1. **Crie conta no Render.com**
   - Acesse [render.com](https://render.com)
   - Faça login com GitHub

2. **Conecte o repositório**
   - Clique em "New Web Service"
   - Conecte este repositório
   - Configure:
     - **Name**: `gym-iefp-backend`
     - **Root Directory**: `backend`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

3. **Configure variáveis de ambiente**
   - JWT_SECRET (gere uma chave segura)
   - STRIPE_SECRET_KEY (se usar pagamentos)
   - SENDGRID_API_KEY (se usar emails)
   - CORS_ORIGIN (URL do frontend)

### Frontend - Opções de Deploy

#### Opção 1: Vercel.com (Recomendado para React)

1. **Crie conta no Vercel.com**
   - Acesse [vercel.com](https://vercel.com)
   - Faça login com GitHub

2. **Conecte o repositório**
   - Clique em "New Project"
   - Conecte este repositório
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Configure variáveis de ambiente**
   - VITE_API_URL (URL do backend no Render)

#### Opção 2: Netlify.com (Alternativa excelente)

1. **Crie conta no Netlify.com**
   - Acesse [netlify.com](https://netlify.com)
   - Faça login com GitHub

2. **Conecte o repositório**
   - Clique em "New site from Git"
   - Conecte este repositório
   - Configure:
     - **Base directory**: `frontend`
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`

3. **Configure variáveis de ambiente**
   - VITE_API_URL (URL do backend no Render)

4. **Configure redirecionamentos** (importante para SPA):
   - Crie arquivo `frontend/public/_redirects` com:
   ```
   /*    /index.html   200
   ```

## 🛠️ Desenvolvimento Local

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📋 Funcionalidades

- ✅ Autenticação de usuários
- ✅ Gestão de planos de academia
- ✅ Subscrições
- ✅ Pagamentos (Stripe)
- ✅ Relatórios
- ✅ Envio de emails

## 🔧 Tecnologias

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

## 📝 Notas de Deploy

- O backend usa SQLite que é persistido no Render
- Para produção, considere migrar para PostgreSQL
- Configure CORS adequadamente para permitir comunicação entre frontend e backend
- Use variáveis de ambiente para todas as chaves secretas
- **Netlify vs Vercel**: Ambos são excelentes, Netlify tem plano gratuito mais generoso