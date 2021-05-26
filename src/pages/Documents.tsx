import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { useStore, DocumentRef } from '../components/Store';

const DocumentsPage = () => {
  const { documents, download, open } = useStore();

  const handleClick = (item: DocumentRef) => {
    if (item.offline) {
      return () => open(item.url);
    } else {
      return () => download(item.url);
    }
  }

  return (
    <section>
      <h2>Mis documentos</h2>
      <Row>
        {documents.map((item, n) => {
          return (
            <Col xs="12" key={n}>
              <Card bg={item.offline ? 'dark' : 'secondary'} text="light" className="mb-2" onClick={handleClick(item)}>
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
