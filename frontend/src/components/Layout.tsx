import {
  Box,
  Flex,
  IconButton,
  useColorMode,
  useColorModeValue,
  VStack,
  HStack,
  Text,
  Link as ChakraLink,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import {
  SunIcon,
  MoonIcon,
  SearchIcon,
  AtSignIcon,
  SettingsIcon,
  RepeatIcon,
  InfoOutlineIcon,
  ViewIcon,
} from '@chakra-ui/icons';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { label: 'Dashboard', to: '/', icon: <ViewIcon boxSize={5} mr={3} /> },
  { label: 'Users', to: '/users', icon: <AtSignIcon boxSize={5} mr={3} /> },
  { label: 'Departments', to: '/departments', icon: <SettingsIcon boxSize={5} mr={3} /> },
  { label: 'Programs', to: '/programs', icon: <RepeatIcon boxSize={5} mr={3} /> },
  { label: 'Reports', to: '/reports', icon: <InfoOutlineIcon boxSize={5} mr={3} /> },
  { label: 'Audit Log', to: '/audit', icon: <SearchIcon boxSize={5} mr={3} /> },
];

function NavLinks() {
  const location = useLocation();
  const colorModeValue = useColorModeValue;
  return (
    <VStack alignItems="flex-start" spacing={2} w="full" mt={8}>
      {navLinks.map((link) => (
        <ChakraLink
          as={Link}
          to={link.to}
          key={link.to}
          fontWeight={location.pathname === link.to ? 'bold' : 'normal'}
          color={location.pathname === link.to ? 'teal.400' : 'gray.600'}
          _hover={{ textDecoration: 'none', color: 'teal.500' }}
          w="full"
          px={4}
          py={2}
          borderRadius="md"
          bg={location.pathname === link.to ? colorModeValue('teal.50', 'teal.900') : 'none'}
          display="flex"
          alignItems="center"
        >
          {link.icon}
          {link.label}
        </ChakraLink>
      ))}
    </VStack>
  );
}

import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <Box width="100vw" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Flex
        as="header"
        align="center"
        justify="space-between"
        px={6}
        py={4}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow="sm"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Text fontWeight="bold" fontSize="xl" color="teal.500">
          MIS
        </Text>
        <Box flex="1" px={8} maxW="500px">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              type="search"
              placeholder="Search..."
              bg={useColorModeValue('gray.100', 'gray.700')}
              borderRadius="md"
            />
          </InputGroup>
        </Box>
        <HStack spacing={4}>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
          />
          <Menu>
            <MenuButton
              as={Avatar}
              size="sm"
              cursor="pointer"
              name={user ? `${user.firstName} ${user.lastName}` : 'User'}
              bg="teal.400"
              color="white"
            >
              {user && user.firstName && user.lastName
                ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                : ''}
            </MenuButton>
            <MenuList>
              {user && (
                <Box px={4} py={2}>
                  <Text fontWeight="bold">
                    {user.firstName} {user.lastName}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {user.email}
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    Role: {user.role}
                  </Text>
                </Box>
              )}
              <Divider />
              <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
              <MenuItem onClick={() => navigate('/settings')}>Settings</MenuItem>
              <Divider />
              <MenuItem
                color="red.500"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      <Flex>
        <Box
          w={{ base: '60px', md: '220px' }}
          bg={useColorModeValue('white', 'gray.800')}
          boxShadow="md"
          p={2}
          pt={8}
          display={{ base: 'none', md: 'block' }}
          position="sticky"
          top={'70px'}
          height="calc(100vh - 70px)"
        >
          <NavLinks />
        </Box>
        <Box as="main" flex="1" py={2} px={{ base: 2, md: 4 }}>
          <Box
            maxW="container.xl"
            mx="auto"
            w="full"
            bg={useColorModeValue('white', 'gray.800')}
            borderRadius="lg"
            boxShadow="md"
            p={{ base: 2, md: 8 }}
          >
            <Outlet />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
