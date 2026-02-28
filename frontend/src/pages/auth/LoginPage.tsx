import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Heading,
  VStack,
  useToast,
  useColorModeValue,
  Link as ChakraLink,
  FormErrorMessage,
  IconButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok && data.token) {
        await login(data.token);
        toast({ title: 'Login successful', status: 'success', isClosable: true });
        navigate('/');
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setLoading(false);
      setError('Network error. Please try again.');
      console.error(err);
    }
  };

  return (
    <Box
      minH="80vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={useColorModeValue('gray.50', 'gray.900')}
      px={2}
    >
      <Box
        w={{ base: '100%', sm: '400px' }}
        bg={useColorModeValue('white', 'gray.800')}
        p={8}
        borderRadius="lg"
        boxShadow="0 4px 24px 0 rgba(0,0,0,0.16), 0 1.5px 6px 0 rgba(0,0,0,0.12)"
      >
        <Heading mb={6} textAlign="center" color="teal.500" size="lg">
          Sign In
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl id="email" isRequired isInvalid={!!error}>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </FormControl>
            <FormControl id="password" isRequired isInvalid={!!error}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowPassword((v) => !v)}
                  />
                </InputRightElement>
              </InputGroup>
              {error && <FormErrorMessage>{error}</FormErrorMessage>}
            </FormControl>
            <Button type="submit" colorScheme="teal" isLoading={loading} w="full" mt={2}>
              Sign In
            </Button>
            <ChakraLink as={Link} to="/register" color="teal.500" textAlign="center" mt={2}>
              Don't have an account? Register
            </ChakraLink>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default LoginPage;
