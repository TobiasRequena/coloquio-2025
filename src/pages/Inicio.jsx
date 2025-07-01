import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function Inicio() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <h1>¿Te animas a preguntar?</h1>
      <Button type="primary" size="large" onClick={() => navigate('/dashboard')}>
        Ir a preguntar!
      </Button>
    </div>
  );
}
