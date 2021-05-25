import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { useStore } from '../components/Store';

const DocumentsPage = () => {
  const { documents } = useStore();
  return (
    <section>
      <h2>Mis documentos</h2>
      <Row>
        {documents.map((item, n) => {
          return (
            <Col xs="12" key={n}>
              <Card bg={item.offline ? 'dark' : 'secondary'} text="light" className="mb-2">
                <Card.Body>
                  <Card.Title className="m-0">
                    {item.name}
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>
    </section>
  )
}

export default DocumentsPage;
