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
    return <p>Loading...</p>; // Or a spinner component
  }

  if (!user) {
    return <Login />;
  }

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand href="#home" className="fw-bold fs-4">Budget Management System</Navbar.Brand>
          <div className="d-flex align-items-center gap-3">
            {user && (
              <Navbar.Text className="text-light mb-0 d-none d-md-block small">
                <span className="text-muted">Logged in as:</span> <span className="fw-semibold">{user.email}</span>
              </Navbar.Text>
            )}
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </Container>
      </Navbar>

      <Container fluid className="py-4">
        {/* Professional Header */}
        <Row className="mb-4">
          <Col>
            <div className="professional-header rounded">
              <Container>
                <h1 className="mb-2 fw-bold">Financial Dashboard</h1>
                <p className="mb-0 fs-5 opacity-90">Monthly Budget Overview & Expense Tracking</p>
              </Container>
            </div>
          </Col>
        </Row>

        <Container>
          {/* Stats Cards */}
          <Row className="g-4 mb-5">
            <Col lg={4} md={6}>
              <div className="stats-card">
                <div className="stats-label text-white">Fixed Costs</div>
                <div className="stats-number text-white">€{fixedCostsTotal.toFixed(2)}</div>
                <small className="text-muted">{fixedCosts.length} items</small>
              </div>
            </Col>
            <Col lg={4} md={6}>
              <div className="stats-card">
                <div className="stats-label text-white">Variable Expenses</div>
                <div className="stats-number text-white">€{variableExpensesTotal.toFixed(2)}</div>
                <small className="text-muted">{expenses.length} transactions</small>
              </div>
            </Col>
            <Col lg={4}>
              <div className="stats-card">
                <div className="stats-label text-white">Total Monthly</div>
                <div className="stats-number text-white">€{totalAmount.toFixed(2)}</div>
                <small className="text-muted">Combined expenses</small>
              </div>
            </Col>
          </Row>

          {/* Chart Section */}
          <Row className="mb-5">
            <Col>
              <div className="chart-container">
                <h3 className="section-title mb-3">Expense Distribution</h3>
                <p className="text-muted mb-4">Breakdown of your spending by category</p>
                <div style={{ maxWidth: '500px', margin: 'auto' }}>
                  {allExpenses.length > 0 ? (
                    <CategoryChart chartData={getChartData()} />
                  ) : (
                    <div className="py-5">
                      <p className="text-muted mb-0">No data available</p>
                      <small className="text-muted">Add expenses to view distribution</small>
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>

          {/* Fixed Costs Management */}
          <Row className="mb-4">
            <Col>
              <div className="section-card">
                <div className="section-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h3 className="section-title">Fixed Costs Management</h3>
                      <p className="section-subtitle">Set up your monthly recurring expenses</p>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold text-success">{fixedCosts.length}</div>
                      <small className="text-muted">fixed costs</small>
                    </div>
                  </div>
                </div>
                <div className="section-content">
                  <div className="professional-form mb-4">
                    <FixedCostForm onAddFixedCost={addFixedCost} />
                  </div>
                  <FixedCostList fixedCosts={fixedCosts} onDelete={deleteFixedCost} />
                </div>
              </div>
            </Col>
          </Row>

          {/* Variable Expenses Section */}
          <Row className="mb-4">
            <Col>
              <div className="section-card">
                <div className="section-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h3 className="section-title">Variable Expenses</h3>
                      <p className="section-subtitle">Current month transactions</p>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold text-primary">{expenses.length}</div>
                      <small className="text-muted">transactions</small>
                    </div>
                  </div>
                </div>
                <div className="section-content">
                  <ExpenseList expenses={expenses} onDelete={deleteExpense} />
                </div>
              </div>
            </Col>
          </Row>

          {/* Add New Expense */}
          <Row>
            <Col>
              <div className="section-card">
                <div className="section-header">
                  <h3 className="section-title">Add New Expense</h3>
                  <p className="section-subtitle">Record a new transaction to your budget</p>
                </div>
                <div className="section-content">
                  <div className="professional-form">
                    <ExpenseForm onAddExpense={addExpense} />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
}

export default App;
