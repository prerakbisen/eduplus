import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const mockAdmin = {
    email: 'admin@eduplus.com',
    password: 'admin123'
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      if (
        formData.email === mockAdmin.email &&
        formData.password === mockAdmin.password
      ) {
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('userName', 'Admin');

        window.location.href = 'http://localhost:8080/';
      } else {
        setErrors({
          general: 'Invalid credentials. Use admin@eduplus.com / admin123'
        });
      }
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="max-w-2xl w-full mx-auto mt-20 bg-card border border-border rounded-xl p-10 shadow-lg">
      <div className="mb-6 text-center">
        
        <div className="flex items-center justify-center mb-6">
          <img
            src="/assets/images/sihlogo.png" 
            alt="Edu+ Logo"
            className="w-20 h-20 object-contain"
          />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Admin Login</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Sign in to manage EduPlus securely
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="admin@eduplus.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <Button
            type="button"
            variant="link"
            className="text-sm text-primary hover:text-primary/80 p-0"
          >
            Forgot password?
          </Button>
        </div>

        {errors.general && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
            <p className="text-sm text-error">{errors.general}</p>
          </div>
        )}

        <Button type="submit" loading={isLoading} fullWidth className="py-3">
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </div>
  );
};

export default AdminLogin;
