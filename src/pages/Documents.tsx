import React from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { useStore } from '../components/Store';

const DocumentsPage = () => {
  const { documents, download, open, remove } = useStore();

  return (
    <section>
      <h2>Mis documentos</h2>
      <Row>
        {documents.map((item, n) => {
          return (
            <Col xs="12" key={n}>
              <Card bg="dark" text="light" className="mb-2">
                <Card.Body>
                  <Card.Title>
                    {item.name}
                  </Card.Title>
                  {item.offline && <Button variant="success" className="me-2" onClick={() => open(item.url)}>
                    Abrir
                  </Button>}
                  {item.offline && <Button variant="danger" className="me-2" onClick={() => remove(item.url)}>
                    Eliminar
                  </Button>}
                  {!item.offline && <Button variant="primary" className="me-2" onClick={() => download(item.url)}>
                    Descargar
                  </Button>}
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
