import React, { useState } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { Expense } from '../types';

interface FixedCostFormProps {
  onAddFixedCost: (fixedCost: Omit<Expense, 'id'>) => void;
}

const FixedCostForm: React.FC<FixedCostFormProps> = ({ onAddFixedCost }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Huur');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!description || !amount) {
      alert('Vul een omschrijving en bedrag in.');
      return;
    }
    onAddFixedCost({ 
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
        <Col md={5}>
          <Form.Group controlId="fixedDescription">
            <Form.Label>Omschrijving</Form.Label>
            <Form.Control 
              type="text" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="bv. Huur"
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId="fixedAmount">
            <Form.Label>Bedrag (€)</Form.Label>
            <Form.Control 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              placeholder="bv. 800"
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId="fixedCategory">
            <Form.Label>Categorie</Form.Label>
            <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Huur</option>
              <option>Nutsvoorzieningen</option>
              <option>Belastingen</option>
              <option>Boodschappen</option>
              <option>Vrije tijd</option>
              <option>Mobiliteit</option>
              <option>Shopping</option>
              <option>Overig</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={1} className="d-flex align-items-end">
          <Button variant="secondary" type="submit" className="w-100">+</Button>
        </Col>
      </Row>
    </Form>
  );
};

export default FixedCostForm;
