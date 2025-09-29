import React, { useState, useEffect, useRef } from 'react';
import { Container, Navbar, Row, Col, Button } from 'react-bootstrap';
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

  // State for date filtering
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
  // State for export dropdown
  const [showExportDropdown, setShowExportDropdown] = useState<boolean>(false);
  const exportDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setShowExportDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  // Filter expenses by selected month/year
  const filteredExpenses = expenses.filter(expense => {
    if (!expense.date) return true; // Include expenses without date (backward compatibility)
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === selectedMonth && expenseDate.getFullYear() === selectedYear;
  });

  // Fixed costs are always included (monthly recurring)
  const allExpenses = [...filteredExpenses, ...fixedCosts.map(fc => ({ ...fc, id: uuidv4() }))];

  const totalAmount = allExpenses.reduce((total, expense) => total + expense.amount, 0);
  const variableExpensesTotal = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  const fixedCostsTotal = fixedCosts.reduce((total, cost) => total + cost.amount, 0);

  // Get selected month and year for display
  const selectedDate = new Date(selectedYear, selectedMonth);
  const displayMonth = selectedDate.toLocaleString('en-US', { month: 'long' });
  const displayYear = selectedYear;

  // Generate months for dropdown
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2024, i);
    return {
      value: i,
      label: date.toLocaleString('en-US', { month: 'long' })
    };
  });

  // Generate years (current year ± 2)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  // Export functions
  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Amount', 'Category', 'Type'];
    const variableRows = filteredExpenses.map(expense => [
      expense.date ? new Date(expense.date).toLocaleDateString() : 'N/A',
      expense.description,
      expense.amount.toFixed(2),
      expense.category,
      'Variable'
    ]);
    const fixedRows = fixedCosts.map(cost => [
      'Monthly Recurring',
      cost.description,
      cost.amount.toFixed(2),
      cost.category,
      'Fixed'
    ]);
    
    const csvContent = [headers, ...variableRows, ...fixedRows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `budget-${displayMonth}-${displayYear}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const data = {
      month: displayMonth,
      year: displayYear,
      summary: {
        totalAmount: totalAmount.toFixed(2),
        variableExpenses: variableExpensesTotal.toFixed(2),
        fixedCosts: fixedCostsTotal.toFixed(2),
        transactionCount: filteredExpenses.length,
        fixedCostCount: fixedCosts.length
      },
      variableExpenses: filteredExpenses,
      fixedCosts: fixedCosts,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `budget-data-${displayMonth}-${displayYear}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <link rel="icon" href="/bms-logo.svg" type="image/svg+xml">
        <title>Budget Report - ${displayMonth} ${displayYear}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; }
          .summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          .section { margin-bottom: 30px; }
          .section h3 { border-bottom: 2px solid #667eea; padding-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #667eea; color: white; }
          .amount { text-align: right; font-weight: bold; }
          .total { font-size: 1.2em; color: #667eea; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Budget Management System</h1>
          <h2>${displayMonth} ${displayYear} Report</h2>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="summary">
          <h3>Summary</h3>
          <p><strong>Fixed Costs:</strong> €${fixedCostsTotal.toFixed(2)}</p>
          <p><strong>Variable Expenses:</strong> €${variableExpensesTotal.toFixed(2)}</p>
          <p class="total"><strong>Total Monthly Expenses:</strong> €${totalAmount.toFixed(2)}</p>
        </div>
        
        <div class="section">
          <h3>Fixed Costs (${fixedCosts.length} items)</h3>
          <table>
            <tr><th>Description</th><th>Category</th><th>Amount</th></tr>
            ${fixedCosts.map(cost => `
              <tr>
                <td>${cost.description}</td>
                <td>${cost.category}</td>
                <td class="amount">€${cost.amount.toFixed(2)}</td>
              </tr>
            `).join('')}
          </table>
        </div>
        
        <div class="section">
          <h3>Variable Expenses (${filteredExpenses.length} transactions)</h3>
          <table>
            <tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th></tr>
            ${filteredExpenses.map(expense => `
              <tr>
                <td>${expense.date ? new Date(expense.date).toLocaleDateString() : 'N/A'}</td>
                <td>${expense.description}</td>
                <td>${expense.category}</td>
                <td class="amount">€${expense.amount.toFixed(2)}</td>
              </tr>
            `).join('')}
          </table>
        </div>
      </body>
      </html>
    `;
    
    // Open in new window for printing/saving as PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

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
                <Row className="align-items-center">
                  <Col md={8}>
                    <h1 className="mb-2 fw-bold">Financial Dashboard</h1>
                    <p className="mb-1 fs-5 opacity-90">Monthly Budget Overview & Expense Tracking</p>
                    <p className="mb-0 fs-6 opacity-75">{displayMonth} {displayYear}</p>
                  </Col>
                  <Col md={4}>
                    <div className="d-flex gap-2 justify-content-end align-items-center">
                      <select 
                        className="form-select form-select-sm text-white" 
                        style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}
                        value={selectedMonth} 
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                      >
                        {months.map(month => (
                          <option key={month.value} value={month.value} style={{ color: '#333' }}>{month.label}</option>
                        ))}
                      </select>
                      <select 
                        className="form-select form-select-sm text-white" 
                        style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', minWidth: '80px' }}
                        value={selectedYear} 
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      >
                        {years.map(year => (
                          <option key={year} value={year} style={{ color: '#333' }}>{year}</option>
                        ))}
                      </select>
                      <div className="position-relative" ref={exportDropdownRef}>
                        <button 
                          className="btn btn-outline-light btn-sm dropdown-toggle" 
                          type="button" 
                          onClick={() => setShowExportDropdown(!showExportDropdown)}
                        >
                          Export
                        </button>
                        {showExportDropdown && (
                          <div className="dropdown-menu show position-absolute end-0 mt-1">
                            <button 
                              className="dropdown-item" 
                              onClick={() => { exportToCSV(); setShowExportDropdown(false); }}
                            >
                              CSV
                            </button>
                            <button 
                              className="dropdown-item" 
                              onClick={() => { exportToJSON(); setShowExportDropdown(false); }}
                            >
                              JSON
                            </button>
                            <button 
                              className="dropdown-item" 
                              onClick={() => { exportToPDF(); setShowExportDropdown(false); }}
                            >
                              PDF
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>
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
                      <div className="fw-bold text-white">{fixedCosts.length}</div>
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

          {/* Variable Expenses Management */}
          <Row>
            <Col>
              <div className="section-card">
                <div className="section-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h3 className="section-title">Variable Expenses Management</h3>
                      <p className="section-subtitle">Record and track your {displayMonth} {displayYear} transactions</p>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold text-white">{filteredExpenses.length}</div>
                      <small className="text-muted">transactions</small>
                    </div>
                  </div>
                </div>
                <div className="section-content">
                  <div className="professional-form mb-4">
                    <ExpenseForm onAddExpense={addExpense} />
                  </div>
                  <ExpenseList expenses={filteredExpenses} onDelete={deleteExpense} />
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
