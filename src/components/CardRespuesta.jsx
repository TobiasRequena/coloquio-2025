import React from 'react';
import { Card } from 'antd';

export default function CardRespuesta({ respuesta, image }) {
  return (
    <Card
      style={{ marginTop: '1rem', textAlign: 'center' }}
      bordered
      cover={<img alt={respuesta} src={image} style={{ maxHeight: '180px', objectFit: 'contain' }} />}
    >
      <h2>{respuesta.toUpperCase()}</h2>
    </Card>
  );
}
