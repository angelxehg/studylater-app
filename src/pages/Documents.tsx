import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { useFirestore, useFirestoreDocData, useUser } from 'reactfire';

interface SimpleDocLink {
  name: string
  url: string
}

interface MainDocModel {
  documents?: SimpleDocLink[]
}

const DocumentsPage = () => {
  const { data: user } = useUser();
  const mainDocRef = useFirestore()
    .collection('studylater').doc(user.uid);
  const { data } = useFirestoreDocData<MainDocModel>(mainDocRef);
  return (
    <section>
      <h2>Mis documentos</h2>
      {data.documents && <Row>
        {data.documents.map((item, n) => {
          return (
            <Col key={n}>
              <Card bg="dark" text="light" className="mb-2">
                <Card.Body>
                  <Card.Title>
                    {item.name}
                  </Card.Title>
                  <Card.Subtitle className="text-muted">
                    {item.url}
                  </Card.Subtitle>
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>}
    </section>
  )
}

export default DocumentsPage;
