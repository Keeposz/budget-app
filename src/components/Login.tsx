import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleAuth}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label className="mt-2">Password</Form.Label>
              <Form.Control type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            {isSignUp && (
              <Form.Group id="confirm-password">
                <Form.Label className="mt-2">Confirm Password</Form.Label>
                <Form.Control type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </Form.Group>
            )}
            <Button className="w-100 mt-4" type="submit">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Button variant="link" onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
