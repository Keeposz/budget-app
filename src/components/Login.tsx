import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification, 
  sendPasswordResetEmail 
} from 'firebase/auth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        setMessage('Account created! Please check your email and verify your account before signing in.');
        setIsSignUp(false);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          setError('Please verify your email address before signing in. Check your inbox for a verification email.');
          await auth.signOut(); // Sign out unverified user
        }
      }
    } catch (err: any) {
      let errorMessage = 'An error occurred. Please try again.';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!email) {
      setError('Please enter your email address.');
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox for instructions.');
      setShowForgotPassword(false);
    } catch (err: any) {
      let errorMessage = 'Failed to send password reset email.';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Container>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <Card className="section-card">
              <div className="section-header text-center">
                <h2 className="section-title mb-2">
                  {showForgotPassword ? 'Reset Password' : (isSignUp ? 'Create Account' : 'Welcome Back')}
                </h2>
                <p className="section-subtitle mb-0">
                  {showForgotPassword 
                    ? 'Enter your email to receive reset instructions' 
                    : `Please ${isSignUp ? 'sign up to create' : 'sign in to access'} your account`
                  }
                </p>
              </div>
              
              <div className="section-content">
                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
                {message && <Alert variant="success" className="mb-3">{message}</Alert>}
                
                {showForgotPassword ? (
                  <Form onSubmit={handleForgotPassword}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control 
                        type="email" 
                        required 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        disabled={loading}
                      />
                    </Form.Group>
                    
                    <Button 
                      variant="primary" 
                      className="w-100 py-3 fw-bold mb-3" 
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Send Reset Email'}
                    </Button>
                    
                    <div className="text-center">
                      <Button 
                        variant="link" 
                        onClick={() => {
                          setShowForgotPassword(false);
                          setError('');
                          setMessage('');
                        }}
                        className="text-decoration-none"
                        disabled={loading}
                      >
                        Back to Sign In
                      </Button>
                    </div>
                  </Form>
                ) : (
                  <>
                    <Form onSubmit={handleAuth}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control 
                          type="email" 
                          required 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          disabled={loading}
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
                          disabled={loading}
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
                            disabled={loading}
                          />
                        </Form.Group>
                      )}
                      
                      <Button 
                        variant="primary" 
                        className="w-100 py-3 fw-bold mb-3" 
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (isSignUp ? 'Creating Account...' : 'Signing In...') : (isSignUp ? 'Create Account' : 'Sign In')}
                      </Button>
                    </Form>
                    
                    <div className="text-center">
                      <Button 
                        variant="link" 
                        onClick={() => {
                          setIsSignUp(!isSignUp);
                          setError('');
                          setMessage('');
                        }}
                        className="text-decoration-none mb-2"
                        disabled={loading}
                      >
                        {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
                      </Button>
                      
                      {!isSignUp && (
                        <>
                          <br />
                          <Button 
                            variant="link" 
                            onClick={() => {
                              setShowForgotPassword(true);
                              setError('');
                              setMessage('');
                            }}
                            className="text-decoration-none small"
                            disabled={loading}
                          >
                            Forgot your password?
                          </Button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login;
