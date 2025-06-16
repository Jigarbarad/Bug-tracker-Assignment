
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Bug } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials. Try dev@example.com or manager@example.com with password123');
    } else {
      toast({
        title: "Login successful!",
        description: "Welcome to Bug Track Flow",
      });
    }
  };

  const handleDemoLogin = async (role: 'developer' | 'manager') => {
    const demoCredentials = {
      developer: { email: 'jigarbarad@gmail.com', password: 'password123' },
      manager: { email: 'manager@example.com', password: 'password123' }
    };

    setEmail(demoCredentials[role].email);
    setPassword(demoCredentials[role].password);
    
    const success = await login(demoCredentials[role].email, demoCredentials[role].password);
    if (success) {
      toast({
        title: "Demo login successful!",
        description: `Logged in as ${role}`,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <Bug className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Bug Track Flow</CardTitle>
          <CardDescription>
            Sign in to manage your bugs and tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>

          <div className="mt-6 space-y-2">
            <p className="text-sm text-muted-foreground text-center">Demo Accounts:</p>
            <span className="grid gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleDemoLogin('developer')}
                disabled={isLoading}
                className="w-full"
              >
                Login as Developer
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleDemoLogin('manager')}
                disabled={isLoading}
                className="w-full"
              >
                Login as Manager
              </Button>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
