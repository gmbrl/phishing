"use client";
import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Function to reset all form fields
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setConfirmPassword("");
    setError("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const endpoint = isSignup ? `${API_BASE}/auth/register` : `${API_BASE}/auth/login`;
      const body = isSignup 
        ? JSON.stringify({ name, email, password, confirmPassword })
        : JSON.stringify({ email, password });

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || (isSignup ? "Signup failed" : "Login failed"));
      
      localStorage.setItem("token", json.token);
      window.location.href = "/";
    } catch (e: any) {
      setError(e.message);
      // Auto-refresh form on any failure
      setTimeout(() => resetForm(), 3000);
    } finally {
      setLoading(false);
    }
  }

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e0e7ff 0%, #f3f4f6 100%)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: 16 
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: 400, 
        background: 'white', 
        borderRadius: 18, 
        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.10)', 
        padding: 32, 
        position: 'relative', 
        zIndex: 1 
      }}>
        {/* Logo/Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{ 
            width: 56, 
            height: 56, 
            background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            boxShadow: '0 2px 8px #6366f122' 
          }}>
            <svg style={{ width: 32, height: 32, color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>

        {/* Headline & Subtitle */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#3730a3', margin: 0 }}>
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>
          <p style={{ color: '#64748b', fontSize: 15, margin: '8px 0 0 0' }}>
            {isSignup 
              ? "Join Phishing Guard Admin Dashboard" 
              : "Sign in to your Phishing Guard Admin Dashboard"
            }
          </p>
        </div>

        {/* Toggle Switch */}
        <div style={{ 
          display: 'flex', 
          background: '#f8fafc', 
          borderRadius: 25, 
          padding: '4px', 
          marginBottom: 24,
          border: '1px solid #e2e8f0'
        }}>
          <button
            type="button"
            onClick={() => {
              setIsSignup(false);
              resetForm();
            }}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 20,
              background: isSignup ? 'transparent' : 'white',
              border: '1px solid #e2e8f0',
              color: isSignup ? '#64748b' : '#3730a3',
              fontWeight: 500,
              fontSize: 15,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignup(true);
              resetForm();
            }}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 20,
              background: isSignup ? 'white' : 'transparent',
              border: '1px solid #e2e8f0',
              color: isSignup ? '#3730a3' : '#64748b',
              fontWeight: 500,
              fontSize: 15,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Login/Signup Form */}
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {isSignup && (
            <div>
              <label htmlFor="name" style={{ display: 'block', fontSize: 15, fontWeight: 500, color: '#6366f1', marginBottom: 6 }}>
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '12px 14px', 
                  background: '#f3f4f6', 
                  border: '1px solid #c7d2fe', 
                  borderRadius: 8, 
                  color: '#22223b', 
                  fontSize: 16 
                }}
                placeholder="Enter your full name"
                required
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" style={{ display: 'block', fontSize: 15, fontWeight: 500, color: '#6366f1', marginBottom: 6 }}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px 14px', 
                background: '#f3f4f6', 
                border: '1px solid #c7d2fe', 
                borderRadius: 8, 
                color: '#22223b', 
                fontSize: 16 
              }}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" style={{ display: 'block', fontSize: 15, fontWeight: 500, color: '#6366f1', marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '12px  14px', 
                  background: '#f3f4f6', 
                  border: '1px solid #c7d2fe', 
                  borderRadius: 8, 
                  color: '#22223b', 
                  fontSize: 16 
                }}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={togglePassword}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <svg style={{ width: 20, height: 20, color: '#64748b' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L19.8 19.8M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {isSignup && (
            <div>
              <label htmlFor="confirmPassword" style={{ display: 'block', fontSize: 15, fontWeight: 500, color: '#6366f1', marginBottom: 6 }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px  14px', 
                    background: '#f3f4f6', 
                    border: '1px solid #c7d2fe', 
                    borderRadius: 8, 
                    color: '#22223b', 
                    fontSize: 16 
                  }}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={toggleConfirmPassword}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  <svg style={{ width: 20, height: 20, color: '#64748b' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showConfirmPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L19.8 19.8M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          )}

          {error && (
            <div style={{ 
              background: '#fee2e2', 
              border: '1px solid #fecaca', 
              borderRadius: 8, 
              padding: '10px 14px', 
              color: '#b91c1c', 
              fontSize: 15, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8 
            }}>
              <svg style={{ width: 18, height: 18, color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error} <span style={{color: '#6b7280', fontSize: 14}}>(Clearing in 3s...)</span></span>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading || (isSignup && password !== confirmPassword)}
            style={{
              width: '100%',
              background: (loading || (isSignup && password !== confirmPassword)) 
                ? 'linear-gradient(135deg, #6b7280, #4b5563)' 
                : 'linear-gradient(135deg, #6366f1, #818cf8)',
              color: 'white',
              fontWeight: 600,
              fontSize: 17,
              padding: '12px 0',
              borderRadius: 8,
              border: 'none',
              cursor: (loading || (isSignup && password !== confirmPassword)) ? 'not-allowed' : 'pointer',
              marginTop: 8,
              boxShadow: '0 2px 8px #6366f122',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? (
              <div style={{ width: 20, height: 20, border: '3px solid #fff', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            ) : (
              <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            )}
            {loading ? (isSignup ? 'Creating Account...' : 'Signing In...') : (isSignup ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        {/* Footer */}
        <div style={{ marginTop: 32, textAlign: 'center', color: '#a1a1aa', fontSize: 13 }}>
          <span>© {new Date().getFullYear()} Phishing Guard. All rights reserved.</span>
          <div style={{ marginTop: 6, fontSize: 12 }}>Your credentials are encrypted and secure.</div>
        </div>
        
        <style>{`
          @keyframes spin { 
            0%{transform:rotate(0deg);} 
            100%{transform:rotate(360deg);} 
          }
        `}</style>
      </div>
    </div>
  );
}
