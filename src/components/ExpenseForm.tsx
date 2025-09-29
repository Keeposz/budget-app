import React, { useState } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { Expense } from '../types';

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Boodschappen');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!description || !amount) {
      alert('Vul een omschrijving en bedrag in.');
      return;
    }
    onAddExpense({ 
      description, 
      amount: parseFloat(amount), 
      category 
    });
    setDescription('');
    setAmount('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="align-items-end">
        <Col md={4}>
          <Form.Group controlId="description">
            <Form.Label>Omschrijving</Form.Label>
            <Form.Control 
              type="text" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="bv. Lunch"
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId="amount">
            <Form.Label>Bedrag (€)</Form.Label>
            <Form.Control 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              placeholder="bv. 12.50"
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId="category">
            <Form.Label>Categorie</Form.Label>
            <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Boodschappen</option>
              <option>Huur</option>
              <option>Vrije tijd</option>
              <option>Vervoer</option>
              <option>Overig</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={2} className="d-flex align-items-end">
          <Button variant="primary" type="submit" className="w-100">Toevoegen</Button>
        </Col>
      </Row>
    </Form>
  );
};

export default ExpenseForm;
