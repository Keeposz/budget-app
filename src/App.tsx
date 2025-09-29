import React, { useState, useEffect } from 'react';
import { Container, Navbar, Row, Col, Card, Button } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import { Expense } from './types';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import CategoryChart from './components/CategoryChart';
import FixedCostForm from './components/FixedCostForm';
import FixedCostList from './components/FixedCostList';

function App() {
  // State for dynamic expenses
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  // State for fixed cost templates
  const [fixedCosts, setFixedCosts] = useState<Omit<Expense, 'id'>[]>(() => {
    const savedFixedCosts = localStorage.getItem('fixed_costs');
    return savedFixedCosts ? JSON.parse(savedFixedCosts) : [];
  });

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('fixed_costs', JSON.stringify(fixedCosts));
  }, [fixedCosts]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    setExpenses(prevExpenses => [...prevExpenses, { ...expense, id: uuidv4() }]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const addFixedCost = (fixedCost: Omit<Expense, 'id'>) => {
    setFixedCosts([...fixedCosts, fixedCost]);
  };

  const deleteFixedCost = (index: number) => {
    setFixedCosts(fixedCosts.filter((_, i) => i !== index));
  };

  const addFixedCostsToExpenses = () => {
    // Voegt alle vaste kosten in één keer toe aan de uitgaven
    fixedCosts.forEach(cost => addExpense(cost));
  };

  const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);

  const getChartData = () => {
    const categoryTotals: { [key: string]: number } = {};
    expenses.forEach(expense => {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += expense.amount;
      } else {
        categoryTotals[expense.category] = expense.amount;
      }
    });

    return {
      labels: Object.keys(categoryTotals),
      datasets: [{
        data: Object.values(categoryTotals),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#2ECC71', '#E74C3C'],
        borderColor: '#fff',
        borderWidth: 1,
      }],
    };
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container className="justify-content-center">
          <Navbar.Brand href="#home" className="fw-bold">Budget App</Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Row className="mb-4">
          <Col md={{ span: 10, offset: 1 }}>
            <Card>
              <Card.Body>
                <Card.Title>Overzicht per Categorie</Card.Title>
                <p className="text-center mb-1">Totaal: <strong>€ {totalAmount.toFixed(2)}</strong></p>
                <div style={{ maxWidth: '450px', margin: 'auto' }}>
                  {expenses.length > 0 ? <CategoryChart chartData={getChartData()} /> : <p className="text-center">Geen data voor grafiek</p>}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={{ span: 10, offset: 1 }}>
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Card.Title className="mb-0">Mijn Uitgaven</Card.Title>
                  <Button variant="outline-primary" onClick={addFixedCostsToExpenses}>Voeg vaste kosten toe</Button>
                </div>
                <ExpenseList expenses={expenses} onDelete={deleteExpense} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={{ span: 10, offset: 1 }}>
            <Card>
              <Card.Body>
                <Card.Title>Beheer Vaste Kosten</Card.Title>
                <p className="text-muted">Stel hier je maandelijkse vaste kosten in. Gebruik de knop hierboven om ze aan de huidige maand toe te voegen.</p>
                <FixedCostForm onAddFixedCost={addFixedCost} />
                <hr />
                <FixedCostList fixedCosts={fixedCosts} onDelete={deleteFixedCost} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={{ span: 10, offset: 1 }}>
            <Card>
              <Card.Body>
                <Card.Title>Nieuwe Eenmalige Uitgave</Card.Title>
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
