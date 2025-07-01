import React, { useEffect, useState, useRef } from 'react';
import { List, Button, DatePicker, Image, Space, Empty, Tour, Radio, Card, Col, Row, Popconfirm, message } from 'antd';
import { LeftOutlined, ClearOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const cardStyle = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  textAlign: 'center',
};

const cardBodyStyle = {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

export default function Historial() {
  const navigate = useNavigate();
  const [historial, setHistorial] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState(null);
  const [openTour, setOpenTour] = useState(false);
  const [vista, setVista] = useState('cuadricula');

  const pickerRef = useRef(null);
  const limpiarBtnRef = useRef(null);
  const viewSelectorRef = useRef(null);

  const disabledDate = (current) => current && current > dayjs().endOf('day');

  useEffect(() => {
    const lastView = localStorage.getItem('vistaHistorial') || 'lista';
    setVista(lastView);
  }, []);

  useEffect(() => {
    localStorage.setItem('vistaHistorial', vista);
  }, [vista]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('historial')) || [];
    setHistorial(data);
    if (data.length > 0) {
      const seenTour = localStorage.getItem('seenHistorialTour');
      if (!seenTour) {
        setOpenTour(true);
        localStorage.setItem('seenHistorialTour', 'true');
      }
    }
  }, []);

  const handleLimpiarHistorial = () => {
    localStorage.removeItem('historial');
    setHistorial([]);
    message.success('Historial limpiado exitosamente.');
    setFiltroFecha(null);
  };

  const filtrado = filtroFecha
    ? historial.filter(h => h.fecha.startsWith(filtroFecha.format('YYYY-MM-DD')))
    : historial;

  const tourSteps = [
    {
      title: 'Filtrar por fecha',
      description: 'Puedes encontrar preguntas específicas filtrándolas por fecha usando este calendario.',
      target: () => pickerRef.current,
      nextButtonProps: { children: 'Siguiente!' },
    },
    {
      title: 'Cambiar vista',
      description: 'Aquí puedes alternar entre diferentes formas de visualizar tu historial.',
      target: () => viewSelectorRef.current,
      prevButtonProps: { children: 'Anterior' },
      nextButtonProps: { children: 'Siguiente!' },
    },
    {
      title: 'Limpiar historial',
      description: 'Usa este botón para borrar de forma permanente todas las preguntas guardadas.',
      target: () => limpiarBtnRef.current,
      prevButtonProps: { children: 'Anterior' },
      nextButtonProps: { children: '¡Entendido!' },
    },
  ];

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f0f2f5' }}>
      <Space style={{ marginBottom: '1.5rem', width: '100%', justifyContent: 'center' }} wrap>
        <Button icon={<LeftOutlined />} onClick={() => navigate('/dashboard')}>Volver</Button>
        <div ref={pickerRef}>
          <DatePicker
            onChange={setFiltroFecha}
            disabledDate={disabledDate}
            placeholder="Filtrar por fecha"
            value={filtroFecha}
            allowClear
            style={{ minWidth: '180px' }}
          />
        </div>
        <Popconfirm
          title="¿Estás seguro de que quieres limpiar todo el historial?"
          description="Esta acción no se puede deshacer."
          onConfirm={handleLimpiarHistorial}
          okText="Sí, limpiar"
          cancelText="No, cancelar"
          placement="bottomRight"
        >
          <Button
            color="danger" 
            variant="outlined"
            ref={limpiarBtnRef}
            icon={<ClearOutlined />}
            type="primary"
          >Limpiar historial</Button>
        </Popconfirm>
      </Space>

      <div ref={viewSelectorRef} style={{ marginBottom: '1.5rem' }}>
        <Radio.Group value={vista} onChange={e => setVista(e.target.value)}>
          <Radio.Button value="lista">Lista</Radio.Button>
          <Radio.Button value="grilla">Grilla</Radio.Button>
          <Radio.Button value="card">Cuadrícula</Radio.Button>
        </Radio.Group>
      </div>

      {filtrado.length === 0 ? (
        <Empty description="Sin preguntas registradas para mostrar." image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ marginTop: '50px' }} />
      ) : vista === 'lista' ? (
        <List
          dataSource={filtrado}
          renderItem={item => (
            <List.Item
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                background: '#fff',
                padding: '1rem 1.5rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
                width: '100%',
              }}
            >
              <div style={{
                flexGrow: 1,
                flexBasis: '300px',
                marginRight: item.image ? '1.5rem' : '0',
              }}>
                <div style={{ fontSize: '1rem', color: '#000', marginBottom: '0.5rem' }}>
                  <strong>Pregunta:</strong> {item.pregunta}
                </div>
                <div style={{ fontSize: '1rem', color: '#000' }}>
                  <strong>Respuesta:</strong> {item.respuesta}
                </div>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                minWidth: '150px',
                marginLeft: 'auto',
              }}>
                {item.image && (
                  <div style={{ marginBottom: '0.5rem' }}>
                    <Image width={150} src={item.image} alt={`Imagen de ${item.pregunta}`} style={{ borderRadius: '4px', border: '1px solid #eee' }} />
                  </div>
                )}
                <div style={{ fontSize: '0.85rem', color: '#888', textAlign: 'right' }}>
                  {new Date(item.fecha).toLocaleString()}
                </div>
              </div>
            </List.Item>
          )}
          style={{ width: '100%', maxWidth: '900px' }}
        />
      ) : vista === 'grilla' ? (
        <List
          dataSource={filtrado}
          bordered
          header={
            <Row gutter={16} style={{ fontWeight: 'bold', background: '#e6f7ff', padding: '10px 0' }}>
              <Col xs={24} sm={8}>Pregunta</Col>
              <Col xs={24} sm={8}>Respuesta</Col>
              <Col xs={24} sm={8} style={{ textAlign: 'center' }}>Imagen</Col>
            </Row>
          }
          renderItem={item => (
            <List.Item style={{ background: '#fff' }}>
              <Row gutter={16} style={{ width: '100%', alignItems: 'center' }}>
                <Col xs={24} sm={8}>{item.pregunta}</Col>
                <Col xs={24} sm={8}>{item.respuesta}</Col>
                <Col xs={24} sm={8} style={{ display: 'flex', justifyContent: 'center' }}>
                  {item.image && <Image width={100} src={item.image} alt={`Imagen de ${item.pregunta}`} />}
                </Col>
              </Row>
            </List.Item>
          )}
          style={{ width: '100%', maxWidth: '900px' }}
        />
      ) : (
        <Row gutter={[16, 16]} style={{ width: '100%', maxWidth: '1200px' }}>
          {filtrado.map((item, idx) => (
            <Col xs={24} sm={12} md={8} lg={6} key={idx}>
              <Card title={item.pregunta} bordered style={cardStyle} bodyStyle={cardBodyStyle}>
                <p><strong>Respuesta:</strong> {item.respuesta}</p>
                {item.image && <Image width={120} src={item.image} alt={`Imagen de ${item.pregunta}`} />}
                <p style={{ marginTop: 'auto', fontSize: '0.85rem', color: '#888' }}>
                  <small>{new Date(item.fecha).toLocaleString()}</small>
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Tour open={openTour} onClose={() => setOpenTour(false)} steps={tourSteps} />
    </div>
  );
}
