import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Bem-vindo ao Sistema de Gestão de Academia</h1>
        <p className="subtitle">Organize planos, subscrições, pagamentos e usuários de forma simples e eficiente.</p>
        <div className="landing-actions">
          <Link to="/login" className="landing-btn primary">Entrar</Link>
          <Link to="/register" className="landing-btn secondary">Registar</Link>
        </div>
      </div>
    </div>
  );
};

export default Landing; 