import React, { useState } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { Expense } from '../types';

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Groceries');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!amount) {
      alert('Please enter an amount.');
      return;
    }
    onAddExpense({ 
      description: description || 'No description', 
      amount: parseFloat(amount), 
      category,
      date: new Date().toISOString()
    });
    setDescription('');
    setAmount('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="align-items-end">
        <Col md={4}>
          <Form.Group controlId="description">
            <Form.Label>Description (optional)</Form.Label>
            <Form.Control 
              type="text" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="e.g. Lunch"
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId="amount">
            <Form.Label>Amount (€)</Form.Label>
            <Form.Control 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value.replace(',', '.'))} 
              placeholder="e.g. 12.50"
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Groceries</option>
              <option>Housing</option>
              <option>Entertainment</option>
              <option>Transportation</option>
              <option>Shopping</option>
              <option>Utilities</option>
              <option>Taxes</option>
              <option>Subscriptions</option>
              <option>Healthcare</option>
              <option>Insurance</option>
              <option>Loan</option>
              <option>Other</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={2} className="d-flex align-items-end">
          <Button variant="primary" type="submit" className="w-100">Add</Button>
        </Col>
      </Row>
    </Form>
  );
};

export default ExpenseForm;
