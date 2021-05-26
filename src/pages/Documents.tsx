import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { useStore, DocumentRef } from '../components/Store';

interface DocumentCardProps {
  item: DocumentRef
}

const DocumentCard = (props: DocumentCardProps) => {
  const { download, open, remove } = useStore();
  const { name, url, offline } = props.item;
  const [waitFor, setWaitFor] = useState<string>();

  const handleAction = async (action: string, fun: (rawUrl: string) => Promise<void>) => {
    setWaitFor(action);
    try {
      await fun(url);
      setWaitFor(undefined);
    } catch (err) {
      console.error(err);
      setWaitFor('Error!');
      setTimeout(() => setWaitFor(undefined), 1000);
    }
  }

  const handleOpen = () => handleAction('Abriendo...', open);

  const handleRemove = () => handleAction('Eliminando...', remove);

  const handleDownload = () => handleAction('Descargando...', download);

  return (
    <Card bg="dark" text="light" className="mb-2">
      <Card.Body>
        <Card.Title>
          {name}
        </Card.Title>
        {waitFor ? <div>
          <Button variant="secondary" disabled className="me-2">
            {waitFor}
          </Button>
        </div> : <div>
          {offline && <Button variant="success" className="me-2" onClick={handleOpen}>
            Abrir
          </Button>}
          {offline && <Button variant="danger" className="me-2" onClick={handleRemove}>
            Eliminar
          </Button>}
          {!offline && <Button variant="primary" className="me-2" onClick={handleDownload}>
            Descargar
          </Button>}
        </div>}
      </Card.Body>
    </Card>
  )
}

const DocumentsPage = () => {
  const { documents } = useStore();

  return (
    <section>
      <h2>Mis documentos</h2>
      <Row>
        {documents.map((item, n) => {
          return (
            <Col xs="12" key={n}>
              <DocumentCard item={item} />
            </Col>
          )
        })}
      </Row>
    </section>
  )
}

export default DocumentsPage;
