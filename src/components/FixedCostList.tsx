import React from 'react';
import { ListGroup, Button, Badge } from 'react-bootstrap';
import { Expense } from '../types';

interface FixedCostListProps {
  fixedCosts: Omit<Expense, 'id'>[];
  onDelete: (index: number) => void;
}

const FixedCostList: React.FC<FixedCostListProps> = ({ fixedCosts, onDelete }) => {
  if (fixedCosts.length === 0) {
    return <p>Nog geen vaste kosten ingesteld.</p>;
  }

  return (
    <ListGroup>
      {fixedCosts.map((cost, index) => (
        <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
          <div className="ms-2 me-auto">
            <div className="fw-bold">{cost.description}</div>
            {cost.category}
          </div>
          <Badge bg="secondary" pill className="me-2">
            € {cost.amount.toFixed(2)}
          </Badge>
          <span className="delete-btn" onClick={() => onDelete(index)}>&times;</span>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default FixedCostList;
