import React, { useState, useEffect } from 'react';
import { Container, Navbar, Row, Col, Card } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import { Expense } from './types';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';

function App() {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    // Laad de uitgaven uit local storage bij de start
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  useEffect(() => {
    // Sla de uitgaven op in local storage telkens als ze wijzigen
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    setExpenses([...expenses, { ...expense, id: uuidv4() }]);
  };

  const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Budget App</Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Row>
          <Col md={8}>
            <Card>
              <Card.Body>
                <Card.Title>Mijn Uitgaven</Card.Title>
                <ExpenseList expenses={expenses} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Totaal</Card.Title>
                <h3 className="text-center">€ {totalAmount.toFixed(2)}</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col md={12}>
            <Card>
              <Card.Body>
                <Card.Title>Nieuwe Uitgave Toevoegen</Card.Title>
                <ExpenseForm onAddExpense={addExpense} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
