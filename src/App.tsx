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
import Login from './components/Login';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // State for dynamic expenses
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // State for fixed cost templates
  const [fixedCosts, setFixedCosts] = useState<Omit<Expense, 'id'>[]>([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribeAuth(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setFixedCosts([]);
      return;
    }

    const docRef = doc(db, 'budgets', user.uid);
    const unsubscribeFirestore = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setExpenses(data.expenses || []);
        setFixedCosts(data.fixedCosts || []);
      } else {
        // Document doesn't exist, maybe first time user
        console.log("No budget document found for user, will be created on first add.");
      }
    });

    return () => unsubscribeFirestore(); // Cleanup listener on user change or unmount
  }, [user]);

  const updateFirestore = async (data: { expenses: Expense[], fixedCosts: Omit<Expense, 'id'>[] }) => {
    if (user) {
      const docRef = doc(db, 'budgets', user.uid);
      await setDoc(docRef, data, { merge: true });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpenses = [...expenses, { ...expense, id: uuidv4() }];
    updateFirestore({ expenses: newExpenses, fixedCosts });
  };

  const deleteExpense = (id: string) => {
    const newExpenses = expenses.filter(expense => expense.id !== id);
    updateFirestore({ expenses: newExpenses, fixedCosts });
  };

  const addFixedCost = (fixedCost: Omit<Expense, 'id'>) => {
    const newFixedCosts = [...fixedCosts, fixedCost];
    updateFirestore({ expenses, fixedCosts: newFixedCosts });
  };

  const deleteFixedCost = (index: number) => {
    const newFixedCosts = fixedCosts.filter((_, i) => i !== index);
    updateFirestore({ expenses, fixedCosts: newFixedCosts });
  };

  const allExpenses = [...expenses, ...fixedCosts.map(fc => ({ ...fc, id: uuidv4() }))];

  const totalAmount = allExpenses.reduce((total, expense) => total + expense.amount, 0);
  const variableExpensesTotal = expenses.reduce((total, expense) => total + expense.amount, 0);
  const fixedCostsTotal = fixedCosts.reduce((total, cost) => total + cost.amount, 0);

  const getChartData = () => {
    const categoryTotals: { [key: string]: number } = {};
    allExpenses.forEach(expense => {
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

  if (loading) {
    return <p>Laden...</p>; // Or a spinner component
  }

  if (!user) {
    return <Login />;
  }

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home" className="fw-bold">Budget App</Navbar.Brand>
          <div className="d-flex align-items-center gap-3">
            {user && (
              <Navbar.Text className="text-light mb-0 d-none d-md-block">
                Ingelogd als: <span className="fw-semibold">{user.email}</span>
              </Navbar.Text>
            )}
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              Uitloggen
            </Button>
          </div>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Row className="mb-4">
          <Col md={{ span: 10, offset: 1 }}>
            <Card>
              <Card.Body>
                <Card.Title className="text-center mb-4">📊 Maandelijks Budget Overzicht</Card.Title>
                
                {/* Summary Cards */}
                <Row className="mb-4">
                  <Col md={4}>
                    <Card className="text-center h-100" style={{ backgroundColor: 'var(--card-background)', border: '2px solid #e3f2fd' }}>
                      <Card.Body>
                        <h6 className="text-primary mb-2">💰 Vaste Kosten</h6>
                        <h4 className="text-primary mb-0">€ {fixedCostsTotal.toFixed(2)}</h4>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="text-center h-100" style={{ backgroundColor: 'var(--card-background)', border: '2px solid #fff3e0' }}>
                      <Card.Body>
                        <h6 className="text-warning mb-2">🛒 Variabele Uitgaven</h6>
                        <h4 className="text-warning mb-0">€ {variableExpensesTotal.toFixed(2)}</h4>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="text-center h-100" style={{ backgroundColor: 'var(--card-background)', border: '2px solid #f3e5f5' }}>
                      <Card.Body>
                        <h6 className="text-info mb-2">💸 Totaal</h6>
                        <h4 className="text-info mb-0">€ {totalAmount.toFixed(2)}</h4>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Chart Section */}
                <div className="text-center">
                  <h5 className="mb-3">Verdeling per Categorie</h5>
                  <div style={{ maxWidth: '400px', margin: 'auto' }}>
                    {allExpenses.length > 0 ? <CategoryChart chartData={getChartData()} /> : <p className="text-muted">Voeg uitgaven toe om je budget verdeling te zien</p>}
                  </div>
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
                  <Card.Title className="mb-0">🛒 Variabele Uitgaven (Deze Maand)</Card.Title>
                  <small className="text-muted">{expenses.length} uitgaven</small>
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
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <Card.Title className="mb-1">💰 Vaste Kosten Beheer</Card.Title>
                    <p className="text-muted mb-0">Stel hier je maandelijkse vaste kosten in (huur, abonnementen, etc.)</p>
                  </div>
                  <small className="text-muted">{fixedCosts.length} vaste kosten</small>
                </div>
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
                <Card.Title>➕ Nieuwe Uitgave Toevoegen</Card.Title>
                <p className="text-muted mb-3">Voeg een nieuwe uitgave toe aan je budget overzicht</p>
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
