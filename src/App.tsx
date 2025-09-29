import React from 'react';
import { Container, Navbar, Row, Col } from 'react-bootstrap';
import './App.css';

function App() {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Budget App</Navbar.Brand>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <Row>
          <Col md={8}>
            <h2>Uitgaven</h2>
            {/* Hier komt de lijst met uitgaven */}
          </Col>
          <Col md={4}>
            <h2>Totaal</h2>
            {/* Hier komt het totaal */}
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={12}>
            <h2>Uitgave Toevoegen</h2>
            {/* Hier komt het formulier om uitgaven toe te voegen */}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;