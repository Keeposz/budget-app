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
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Container>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="professional-header text-center mb-4">
              <h1 className="fw-bold mb-2">Budget Management System</h1>
              <p className="mb-0 opacity-75">Financial Dashboard & Expense Tracking</p>
            </div>
            
            <Card className="section-card">
              <div className="section-header text-center">
                <h2 className="section-title mb-2">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
                <p className="section-subtitle mb-0">Please {isSignUp ? 'sign up to create' : 'sign in to access'} your account</p>
              </div>
              
              <div className="section-content">
                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
                
                <Form onSubmit={handleAuth}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control 
                      type="email" 
                      required 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      required 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                  </Form.Group>
                  
                  {isSignUp && (
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control 
                        type="password" 
                        required 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                      />
                    </Form.Group>
                  )}
                  
                  <Button variant="primary" className="w-100 py-3 fw-bold mb-3" type="submit">
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </Button>
                </Form>
                
                <div className="text-center">
                  <Button 
                    variant="link" 
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-decoration-none"
                  >
                    {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login;
