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
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          role,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        toast({ title: 'Registration successful', status: 'success', isClosable: true });
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch {
      setLoading(false);
      setError('Network error. Please try again.');
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
          Register
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl id="firstName" isRequired>
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                autoComplete="given-name"
              />
            </FormControl>
            <FormControl id="lastName" isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                autoComplete="family-name"
              />
            </FormControl>
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
                  autoComplete="new-password"
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
            </FormControl>
            <FormControl id="confirmPassword" isRequired isInvalid={!!error}>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
              </InputGroup>
              {error && <FormErrorMessage>{error}</FormErrorMessage>}
            </FormControl>
            <FormControl id="role" isRequired>
              <FormLabel>Role</FormLabel>
              <Input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Enter role (e.g. USER, ADMIN, SUPER_ADMIN)"
              />
            </FormControl>
            <Button type="submit" colorScheme="teal" isLoading={loading} w="full" mt={2}>
              Register
            </Button>
            <ChakraLink as={Link} to="/login" color="teal.500" textAlign="center" mt={2}>
              Already have an account? Sign In
            </ChakraLink>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default RegisterPage;
