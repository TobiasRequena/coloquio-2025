import React, { useEffect, useState, useRef } from 'react';
import { Input, Button, Space, message, Spin, Tour, Badge } from 'antd';
import { useNavigate } from 'react-router-dom';
import { validateQuestion } from '../utils/validateQuestion';
import axios from 'axios';
import { LeftOutlined, HistoryOutlined } from '@ant-design/icons';
import CardRespuesta from '../components/CardRespuesta';

const colorMap = {
  yes: '#548164',
  no: '#C4554D',
  maybe: '#C29343'
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [pregunta, setPregunta] = useState('');
  const [respuestaData, setRespuestaData] = useState(null);
  const [bgColor, setBgColor] = useState('#f0f2f5');
  const [loading, setLoading] = useState(false);
  const [openTourFirstVisit, setOpenTourFirstVisit] = useState(false);
  const [openTourAfterFirstQuestion, setOpenTourAfterFirstQuestion] = useState(false);
  const [totalPreguntas, setTotalPreguntas] = useState(0);

  const inputRef = useRef();

  useEffect(() => {
    const seenTour = localStorage.getItem('seenDashboardTour');
    if (!seenTour) {
      setOpenTourFirstVisit(true);
      localStorage.setItem('seenDashboardTour', 'true');
    }
    const historial = JSON.parse(localStorage.getItem('historial')) || [];
    setTotalPreguntas(historial.length);
  }, []);

  const handleSubmit = async () => {
    if (!pregunta.trim()) {
      message.warning('Por favor escribí una pregunta.');
      return;
    }

    if (!validateQuestion(pregunta)) {
      message.error('La pregunta debe estar entre ¿...? o terminar con un signo de pregunta (?)');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get('https://yesno.wtf/api');
      const answer = res.data.answer.toLowerCase();
      setRespuestaData(res.data);
      setBgColor(colorMap[answer] || '#ffffff');

      const nuevo = {
        pregunta,
        respuesta: res.data.answer,
        image: res.data.image,
        fecha: new Date().toISOString()
      };

      const historial = JSON.parse(localStorage.getItem('historial')) || [];
      historial.push(nuevo);
      localStorage.setItem('historial', JSON.stringify(historial));
      setTotalPreguntas(historial.length);

      if (historial.length === 1) {
        setOpenTourAfterFirstQuestion(true);
      }
    } catch (err) {
      console.error('Error consultando la API:', err);
      message.error('Error consultando la API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', backgroundColor: bgColor, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Space style={{ marginBottom: '1rem' }}>
        <Button icon={<LeftOutlined />} onClick={() => navigate('/')}>Inicio</Button>
        <Badge count={totalPreguntas} offset={[0, 0]}>
          <Button
            icon={<HistoryOutlined />}
            onClick={() => {
              if (totalPreguntas > 0) {
                navigate('/historial');
              } else {
                message.info('No hay preguntas en el historial aún.');
              }
            }}
            type={totalPreguntas > 0 ? 'default' : 'disabled'}
          >
            Historial
          </Button>
        </Badge>
      </Space>
      <div ref={inputRef} style={{ width: '100%', maxWidth: '400px' }}>
        <Input.Search
          placeholder="Escribí tu pregunta..."
          enterButton={<Button type="primary" loading={loading}>Enviar</Button>}
          size="large"
          value={pregunta}
          onChange={e => setPregunta(e.target.value)}
          onSearch={handleSubmit}
        />
      </div>
      <div style={{ maxWidth: '300px', width: '100%', minHeight: '250px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem' }}>
        {loading ? (
          <Spin size="large" />
        ) : (
          respuestaData && <CardRespuesta respuesta={respuestaData.answer} image={respuestaData.image} />
        )}
      </div>

      <Tour
        open={openTourFirstVisit}
        onClose={() => setOpenTourFirstVisit(false)}
        steps={[
          {
            title: '¡Bienvenido!',
            description: 'Recordá: solo preguntas que se respondan con sí o no.',
            target: () => inputRef.current,
            nextButtonProps: {
              children: '¡Entendido!',
            },
          }
        ]}
      />

      <Tour
        open={openTourAfterFirstQuestion}
        onClose={() => setOpenTourAfterFirstQuestion(false)}
        steps={[
          {
            title: '¡Mirá el Historial!',
            description: 'Ya podés ver tus preguntas anteriores en el Historial.',
            target: () => document.querySelector('button[icon*="HistoryOutlined"]') || null,
            nextButtonProps: {
              children: '¡Entendido!',
            },
          }
        ]}
      />
    </div>
  );
}
