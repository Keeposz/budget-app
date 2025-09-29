import React from 'react';
import { ListGroup, Badge } from 'react-bootstrap';
import { Expense } from '../types';

interface ExpenseListProps {
  expenses: Expense[];
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses }) => {
  if (expenses.length === 0) {
    return <p>Nog geen uitgaven toegevoegd. Voeg je eerste uitgave hieronder toe!</p>;
  }

  return (
    <ListGroup>
      {expenses.map(expense => (
        <ListGroup.Item key={expense.id} className="d-flex justify-content-between align-items-start">
          <div className="ms-2 me-auto">
            <div className="fw-bold">{expense.description}</div>
            {expense.category}
          </div>
          <Badge bg="primary" pill>
            € {expense.amount.toFixed(2)}
          </Badge>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default ExpenseList;
