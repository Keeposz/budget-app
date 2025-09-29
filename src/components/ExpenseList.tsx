import React from 'react';
import { ListGroup, Badge } from 'react-bootstrap';
import { Expense } from '../types';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete }) => {
  if (expenses.length === 0) {
    return <p className="text-muted text-center py-4">No expenses added yet. Add your first expense below!</p>;
  }

  return (
    <ListGroup>
      {expenses.map(expense => (
        <ListGroup.Item key={expense.id} className="d-flex justify-content-between align-items-center">
          <div className="ms-2 me-auto">
            <div className="fw-bold">{expense.description}</div>
            {expense.category}
          </div>
          <Badge bg="secondary" pill className="me-2">
            € {expense.amount.toFixed(2)}
          </Badge>
          <span className="delete-btn" onClick={() => onDelete(expense.id)}>&times;</span>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default ExpenseList;
