import React, { useState } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { Expense } from '../types';

interface FixedCostFormProps {
  onAddFixedCost: (fixedCost: Omit<Expense, 'id'>) => void;
}

const FixedCostForm: React.FC<FixedCostFormProps> = ({ onAddFixedCost }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Housing');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!amount) {
      alert('Please enter an amount.');
      return;
    }
    onAddFixedCost({ 
      description: description || 'No description', 
      amount: parseFloat(amount), 
      category 
    });
    setDescription('');
    setAmount('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="align-items-end">
        <Col md={5}>
          <Form.Group controlId="fixedDescription">
            <Form.Label>Description (optional)</Form.Label>
            <Form.Control 
              type="text" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="e.g. Rent"
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId="fixedAmount">
            <Form.Label>Amount (€)</Form.Label>
            <Form.Control 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value.replace(',', '.'))} 
              placeholder="e.g. 800"
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId="fixedCategory">
            <Form.Label>Category</Form.Label>
            <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Housing</option>
              <option>Utilities</option>
              <option>Taxes</option>
              <option>Subscriptions</option>
              <option>Groceries</option>
              <option>Entertainment</option>
              <option>Transportation</option>
              <option>Shopping</option>
              <option>Other</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={1} className="d-flex align-items-end">
          <Button variant="secondary" type="submit" className="w-100">Add</Button>
        </Col>
      </Row>
    </Form>
  );
};

export default FixedCostForm;
