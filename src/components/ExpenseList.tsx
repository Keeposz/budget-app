import React from 'react';
import { ListGroup, Badge, Button } from 'react-bootstrap';
import { Expense } from '../types';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete }) => {
  if (expenses.length === 0) {
    return <p>Nog geen uitgaven toegevoegd. Voeg je eerste uitgave hieronder toe!</p>;
  }

  return (
    <ListGroup>
      {expenses.map(expense => (
        <ListGroup.Item key={expense.id} className="d-flex justify-content-between align-items-center">
          <div className="ms-2 me-auto">
            <div className="fw-bold">{expense.description}</div>
            {expense.category}
          </div>
          <Badge bg="primary" pill className="me-2">
            € {expense.amount.toFixed(2)}
          </Badge>
          <Button variant="danger" size="sm" onClick={() => onDelete(expense.id)}>X</Button>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default ExpenseList;
