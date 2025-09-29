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
        <Container className="justify-content-between">
          <Navbar.Brand href="#home" className="fw-bold">Budget App</Navbar.Brand>
          {user && <Navbar.Text className="text-light me-3">Ingelogd als: {user.email}</Navbar.Text>}
          <Button variant="outline-light" onClick={handleLogout}>Uitloggen</Button>
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
                  {allExpenses.length > 0 ? <CategoryChart chartData={getChartData()} /> : <p className="text-center">Geen data voor grafiek</p>}
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
                <p className="text-muted">Stel hier je maandelijkse vaste kosten in.</p>
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
