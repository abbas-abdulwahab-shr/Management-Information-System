import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Avatar,
  Text,
  Divider,
  Stack,
  Card,
} from '@chakra-ui/react';

// Dummy data for demonstration
// const summary = { totalPrograms: 12, totalUsers: 34 };
// const projectsPerDepartment = [
//   { department: 'IT', count: 5, projects: ['ERP Migration', 'Digital Transformation'] },
//   { department: 'Finance', count: 3, projects: ['Budget Review', 'Audit'] },
//   { department: 'HR', count: 4, projects: ['Recruitment Drive', 'Training'] },
// ];
// const activeUsers = [
//   { name: 'John Doe', avatar: '', role: 'Admin' },
//   { name: 'Jane Smith', avatar: '', role: 'Manager' },
//   { name: 'Alice Johnson', avatar: '', role: 'Staff' },
// ];

// // Dummy measurable impact metrics
// const impactMetrics = [
//   { label: 'Cost Savings', value: 85000, unit: 'USD', percent: 85 },
//   { label: 'Efficiency Improvement', value: 72, unit: '%', percent: 72 },
//   { label: 'User Satisfaction', value: 4.5, unit: '/ 5', percent: 90 },
//   { label: 'Lives Affected / Beneficiaries', value: 12000, unit: '', percent: 60 },
// ];

const ReportPage: React.FC = () => {
  const [summary, setSummary] = useState<any>({ totalPrograms: 0, totalUsers: 0 });
  const [projectsPerDepartment, setProjectsPerDepartment] = useState<any[]>([]);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/report/summary`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((r) => r.json())
      .then((data) => setSummary(data))
      .catch(() => setSummary({ totalPrograms: 0, totalUsers: 0 }));

    fetch(`${import.meta.env.VITE_API_URL}/api/report/projects-per-department`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((r) => r.json())
      .then((data) => setProjectsPerDepartment(data.projectsPerDepartment))
      .catch(() => setProjectsPerDepartment([]));

    fetch(`${import.meta.env.VITE_API_URL}/api/report/active-users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((r) => r.json())
      .then((data) => setActiveUsers(data.activeUsers))
      .catch(() => setActiveUsers([]));
  }, []);

  return (
    <Box w="100%" p={{ base: 4, md: 8 }}>
      <Heading size="lg" mb={6} color="teal.700">
        Reports & Analytics
      </Heading>
      {/* ...existing UI, but now uses state from API... */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
        <Stat p={6} bg="teal.50" borderRadius="xl" boxShadow="md">
          <StatLabel fontSize="lg">Total Programs</StatLabel>
          <StatNumber color="teal.600">{summary.totalPrograms}</StatNumber>
        </Stat>
        <Stat p={6} bg="blue.50" borderRadius="xl" boxShadow="md">
          <StatLabel fontSize="lg">Total Users</StatLabel>
          <StatNumber color="blue.600">{summary.totalUsers}</StatNumber>
        </Stat>
      </SimpleGrid>
      <Divider mb={8} />
      <Heading size="md" mb={4} color="gray.700">
        Projects Per Department
      </Heading>
      <Box w="100%" bg="white" borderRadius="xl" boxShadow="md" p={4} mb={8}>
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th>Department</Th>
              <Th>Project Count</Th>
              <Th>Projects</Th>
            </Tr>
          </Thead>
          <Tbody>
            {projectsPerDepartment.map((dept) => (
              <Tr key={dept.department}>
                <Td fontWeight="bold">{dept.department}</Td>
                <Td>
                  <Badge colorScheme="teal" fontSize="md" px={3} py={1} borderRadius="md">
                    {dept.count}
                  </Badge>
                </Td>
                <Td>
                  <Stack spacing={1}>
                    {dept.projects.map((proj: string) => (
                      <Text key={proj} color="gray.700">
                        {proj}
                      </Text>
                    ))}
                  </Stack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Heading size="md" mb={4} color="gray.700">
        Active Users
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {activeUsers.map((user) => (
          <Card key={user.name} p={4} bg="gray.50" borderRadius="xl" boxShadow="md" align="center">
            <Avatar name={user.name} src={user.avatar} size="lg" mb={2} />
            <Text fontWeight="bold" fontSize="lg">
              {user.name}
            </Text>
            <Badge colorScheme="blue" fontSize="sm" mt={1}>
              {user.role}
            </Badge>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ReportPage;
