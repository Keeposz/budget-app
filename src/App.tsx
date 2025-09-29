import React, { useState, useEffect } from 'react';
import { Container, Navbar, Row, Col, Card } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import { Expense } from './types';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import CategoryChart from './components/CategoryChart';

function App() {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    setExpenses([...expenses, { ...expense, id: uuidv4() }]);
  };

  const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);

  // Data voorbereiden voor de grafiek
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
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#C9CBCF'
        ],
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
        {/* Row for Chart */}
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

        {/* Row for Expense List */}
        <Row className="mb-4">
          <Col md={{ span: 10, offset: 1 }}>
            <Card>
              <Card.Body>
                <Card.Title>Mijn Uitgaven</Card.Title>
                <ExpenseList expenses={expenses} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Row for Expense Form */}
        <Row className="mb-4">
          <Col md={{ span: 10, offset: 1 }}>
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