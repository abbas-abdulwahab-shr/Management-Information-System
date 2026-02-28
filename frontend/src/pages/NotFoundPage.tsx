import React from 'react';
import { Box, Heading, Text, Button, Flex, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Flex minH="80vh" align="center" justify="center" bgGradient="linear(to-br, gray.50, white)">
      <Box textAlign="center" p={8} bg="white" borderRadius="2xl" boxShadow="xl">
        <Image
          src="https://undraw.co/api/illustrations/404.svg"
          alt="404 Not Found"
          boxSize="180px"
          mx="auto"
          mb={6}
        />
        <Heading size="2xl" color="teal.600" mb={2}>
          404
        </Heading>
        <Text fontSize="xl" color="gray.700" mb={4}>
          Oops! Page not found.
        </Text>
        <Text color="gray.500" mb={8}>
          The page you are looking for does not exist or has been moved.
        </Text>
        <Button colorScheme="teal" size="lg" onClick={() => navigate('/')}>
          Go to Dashboard
        </Button>
      </Box>
    </Flex>
  );
};

export default NotFoundPage;
