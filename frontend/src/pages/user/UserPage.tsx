import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Input,
  Select,
  Flex,
  Spinner,
  // useDisclosure,
  // useToast,
  Text,
  Badge,
  Stack,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, ViewIcon } from '@chakra-ui/icons';

// Placeholder for user data type
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department?: string;
  isActive: boolean;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  // const toast = useToast();

  // Fetch users (replace with real API call)
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setTimeout(() => {
        setUsers([
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            role: 'SUPER_ADMIN',
            department: 'IT',
            isActive: true,
          },
          {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            role: 'ANALYST',
            department: 'Finance',
            isActive: false,
          },
        ]);
        setLoading(false);
      }, 800);
    };
    fetchUsers();
  }, []);

  // Filtered users
  const filteredUsers = users.filter(
    (u) =>
      (u.firstName + ' ' + u.lastName + u.email).toLowerCase().includes(search.toLowerCase()) &&
      (roleFilter ? u.role === roleFilter : true),
  );

  return (
    <Box>
      <Flex mb={4} justify="space-between" align="center" flexWrap="wrap" gap={2}>
        <Text fontSize="2xl" fontWeight="bold">
          Users
        </Text>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={2} flex={1} maxW="500px">
          <Input
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            bg="white"
          />
          <Select
            placeholder="Filter by role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            bg="white"
          >
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="DEPARTMENT_HEAD">Department Head</option>
            <option value="ANALYST">Analyst</option>
            <option value="OFFICER">Officer</option>
          </Select>
        </Stack>
        <Button leftIcon={<AddIcon />} colorScheme="teal">
          Add User
        </Button>
      </Flex>
      <Box borderRadius="lg" boxShadow="md" bg="white" p={2} overflowX="auto">
        {loading ? (
          <Flex justify="center" align="center" minH="200px">
            <Spinner size="lg" />
          </Flex>
        ) : (
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Department</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredUsers.length === 0 ? (
                <Tr>
                  <Td colSpan={6} textAlign="center">
                    No users found.
                  </Td>
                </Tr>
              ) : (
                filteredUsers.map((user) => (
                  <Tr key={user.id}>
                    <Td>
                      {user.firstName} {user.lastName}
                    </Td>
                    <Td>{user.email}</Td>
                    <Td>
                      <Badge
                        colorScheme={
                          user.role === 'SUPER_ADMIN'
                            ? 'purple'
                            : user.role === 'DEPARTMENT_HEAD'
                              ? 'blue'
                              : user.role === 'ANALYST'
                                ? 'green'
                                : 'gray'
                        }
                      >
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </Td>
                    <Td>{user.department || '-'}</Td>
                    <Td>
                      <Badge colorScheme={user.isActive ? 'green' : 'red'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </Td>
                    <Td>
                      <IconButton
                        aria-label="View"
                        icon={<ViewIcon />}
                        size="sm"
                        mr={1}
                        variant="ghost"
                      />
                      <IconButton
                        aria-label="Edit"
                        icon={<EditIcon />}
                        size="sm"
                        mr={1}
                        variant="ghost"
                      />
                      <IconButton
                        aria-label="Delete"
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                      />
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        )}
      </Box>
    </Box>
  );
};

export default UsersPage;
