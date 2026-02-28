import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Badge,
  Stack,
  Divider,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  //   IconButton,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

import { useEffect, useState } from 'react';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface Program {
  id: string;
  title: string;
  status: string;
}

interface Department {
  id: string;
  name: string;
  head?: Employee;
  programs: Program[];
  staffCount: number;
  createdAt: string;
  employees: Employee[];
}

const DepartmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/department/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        console.log('Fetch department response:', res);
        return res.json();
      })
      .then((data) => {
        console.log('Department data:', data);
        if (data) {
          setDepartment({
            id: data.id,
            name: data.name,
            head: data.head,
            programs: data.programs || [],
            staffCount: data.staffCount || 0,
            createdAt: data.createdAt?.slice(0, 10) || '',
            employees: data.department.employees || [],
          });
          setError(null);
        } else {
          setError('Department not found.');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch department details.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box p={8}>
        <Text>Loading...</Text>
      </Box>
    );
  }
  if (!department || error) {
    return (
      <Box p={8}>
        <Text>{error || 'Department not found.'}</Text>
      </Box>
    );
  }

  return (
    <Box maxW="900px" mx="auto" p={{ base: 4, md: 8 }}>
      <Button leftIcon={<ArrowBackIcon />} mb={4} onClick={() => navigate(-1)} variant="ghost">
        Back to Departments
      </Button>
      <Box borderRadius="2xl" boxShadow="2xl" bg="white" p={8} mb={8}>
        <Flex align="center" justify="space-between" mb={4}>
          <Text fontSize="2xl" fontWeight="bold">
            {department.name} Department
          </Text>
          <Badge colorScheme="teal" fontSize="md">
            Staff: {department.staffCount}
          </Badge>
        </Flex>
        <Stack spacing={2} mb={4}>
          <Flex align="center" gap={2}>
            <Text color="gray.500" fontWeight="medium">
              Head:
            </Text>
            {department.head ? (
              <>
                <Text fontWeight="medium">
                  {department.head.firstName} {department.head.lastName}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {department.head.email}
                </Text>
              </>
            ) : (
              <Badge colorScheme="yellow">Unassigned</Badge>
            )}
          </Flex>
          <Flex align="center" gap={2}>
            <Text color="gray.500" fontWeight="medium">
              Created:
            </Text>
            <Text fontWeight="medium">{department.createdAt}</Text>
          </Flex>
        </Stack>
        <Divider my={4} />
        <Box>
          <Text color="gray.500" fontWeight="medium" mb={2}>
            Programs
          </Text>
          {department.programs.length === 0 ? (
            <Text fontSize="sm" color="gray.400">
              No programs
            </Text>
          ) : (
            <Stack spacing={1}>
              {department.programs.map((p) => (
                <Flex key={p.id} align="center" gap={2}>
                  <Text>{p.title}</Text>
                  <Badge colorScheme={p.status === 'Active' ? 'green' : 'gray'}>{p.status}</Badge>
                </Flex>
              ))}
            </Stack>
          )}
        </Box>
      </Box>
      <Box borderRadius="2xl" boxShadow="xl" bg="white" p={8}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Employees
        </Text>
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {department.employees.length === 0 ? (
              <Tr>
                <Td colSpan={5} textAlign="center">
                  No employees found.
                </Td>
              </Tr>
            ) : (
              department.employees.map((emp) => (
                <Tr key={emp.id}>
                  <Td>
                    <Flex align="center" gap={2}>
                      <Avatar size="sm" name={`${emp.firstName} ${emp.lastName}`} />
                      <Text>
                        {emp.firstName} {emp.lastName}
                      </Text>
                    </Flex>
                  </Td>
                  <Td>{emp.email}</Td>
                  <Td>
                    <Badge
                      colorScheme={
                        emp.role === 'DEPARTMENT_HEAD'
                          ? 'blue'
                          : emp.role === 'ANALYST'
                            ? 'green'
                            : 'gray'
                      }
                    >
                      {emp.role.replace('_', ' ')}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme={emp.isActive ? 'green' : 'red'}>
                      {emp.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default DepartmentDetailPage;
