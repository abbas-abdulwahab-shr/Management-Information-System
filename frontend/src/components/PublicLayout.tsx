import { Box, useColorModeValue } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <Box
      height="100vh"
      width="100vw"
      bg={useColorModeValue('gray.50', 'gray.900')}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Outlet />
    </Box>
  );
}
