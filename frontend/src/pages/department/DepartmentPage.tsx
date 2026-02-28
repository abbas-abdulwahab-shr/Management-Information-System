import React, { useState, useEffect } from 'react';
import AddDepartmentModal from './components/AddDepartmentModal';
import AssignHeadModal from './components/AssignHeadModal';
import ViewDepartmentModal from './components/ViewDepartmentModal';
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
  Flex,
  Text,
  Stack,
  useToast,
  Spinner,
  Badge,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { AddIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';

// Dummy types and data for UI scaffolding
interface Department {
  id: string;
  name: string;
  head?: { id: string; firstName: string; lastName: string; email: string };
  programs: { id: string; title: string; status: string }[];
  staffCount: number;
  createdAt: string;
}

const dummyDepartments: Department[] = [
  {
    id: '1',
    name: 'IT',
    head: { id: 'u1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    programs: [
      { id: 'p1', title: 'ERP Migration', status: 'Active' },
      { id: 'p2', title: 'Network Upgrade', status: 'Completed' },
    ],
    staffCount: 12,
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: 'Finance',
    head: { id: 'u2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
    programs: [{ id: 'p3', title: 'Budget Review', status: 'Active' }],
    staffCount: 8,
    createdAt: '2024-02-15',
  },
  {
    id: '3',
    name: 'HR',
    head: undefined,
    programs: [],
    staffCount: 5,
    createdAt: '2024-03-01',
  },
];

const DepartmentPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  // Modal state placeholders
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [assignHeadModalOpen, setAssignHeadModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/department`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDepartments(
          (data.departments || []).map((d: any) => ({
            id: d._id,
            name: d.name,
            head: d.head
              ? {
                  id: d.head._id,
                  firstName: d.head.firstName,
                  lastName: d.head.lastName,
                  email: d.head.email,
                }
              : undefined,
            programs: (d.programs || []).map((p: any) => ({
              id: p._id,
              title: p.title,
              status: p.status,
            })),
            staffCount: d.staffCount || 0,
            createdAt: d.createdAt?.slice(0, 10) || '',
          })),
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Handlers
  const handleOpenAdd = () => setAddModalOpen(true);
  const handleCloseAdd = () => setAddModalOpen(false);
  const handleOpenAssignHead = (dept: Department) => {
    setSelectedDepartment(dept);
    setAssignHeadModalOpen(true);
  };
  const handleCloseAssignHead = () => {
    setAssignHeadModalOpen(false);
    setSelectedDepartment(null);
  };
  const handleOpenView = (dept: Department) => {
    navigate(`/department/${dept.id}`);
  };
  const handleCloseView = () => {
    setViewModalOpen(false);
    setSelectedDepartment(null);
  };

  // Registered users for assigning head
  const [userOptions, setUserOptions] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/user/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserOptions(
          (data.users || []).map((u: any) => ({
            id: u._id,
            name: `${u.firstName} ${u.lastName}`,
          })),
        );
      });
  }, []);

  // Dummy handlers for modals
  const handleDepartmentAdded = (name: string) => {
    setDepartments((prev) => [
      ...prev,
      {
        id: (Math.random() * 100000).toFixed(0),
        name,
        head: undefined,
        programs: [],
        createdAt: new Date().toISOString().slice(0, 10),
      },
    ]);
  };
  const fetchDepartments = () => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/department`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDepartments(
          (data.departments || []).map((d: any) => ({
            id: d._id,
            name: d.name,
            head: d.head
              ? {
                  id: d.head._id,
                  firstName: d.head.firstName,
                  lastName: d.head.lastName,
                  email: d.head.email,
                }
              : undefined,
            programs: (d.programs || []).map((p: any) => ({
              id: p._id,
              title: p.title,
              status: p.status,
            })),
            staffCount: d.staffCount || 0,
            createdAt: d.createdAt?.slice(0, 10) || '',
          })),
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleAssignHead = (userId: string) => {
    if (selectedDepartment) {
      setLoading(true);
      fetch(`${import.meta.env.VITE_API_URL}/api/department/assign-head`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ departmentId: selectedDepartment.id, headId: userId }),
      })
        .then((res) => res.json())
        .then((data) => {
          fetchDepartments();
        })
        .catch(() => setLoading(false));
    }
  };

  return (
    <Box>
      <Flex mb={4} justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold">
          Departments
        </Text>
        <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={handleOpenAdd}>
          Add Department
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
                <Th>Head</Th>
                <Th>Programs</Th>
                <Th>Staff Count</Th>
                <Th>Created</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {departments.length === 0 ? (
                <Tr>
                  <Td colSpan={5} textAlign="center">
                    No departments found.
                  </Td>
                </Tr>
              ) : (
                departments.map((dept) => (
                  <Tr key={dept.id}>
                    <Td>
                      <Link
                        to={`/department/${dept.id}`}
                        style={{ fontWeight: 'bold', color: '#319795' }}
                      >
                        {dept.name}
                      </Link>
                    </Td>
                    <Td>
                      {dept.head ? (
                        <Stack spacing={0}>
                          <Text fontWeight="medium">
                            {dept.head.firstName} {dept.head.lastName}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            {dept.head.email}
                          </Text>
                        </Stack>
                      ) : (
                        <Badge colorScheme="yellow">Unassigned</Badge>
                      )}
                    </Td>
                    <Td>
                      {dept.programs.length === 0 ? (
                        <Text fontSize="sm" color="gray.400">
                          None
                        </Text>
                      ) : (
                        dept.programs.map((p) => (
                          <Badge
                            key={p.id}
                            colorScheme={p.status === 'Active' ? 'green' : 'gray'}
                            mr={1}
                          >
                            {p.title}
                          </Badge>
                        ))
                      )}
                    </Td>
                    <Td>{dept.staffCount}</Td>
                    <Td>{dept.createdAt}</Td>
                    <Td>
                      <IconButton
                        aria-label="View"
                        icon={<ViewIcon />}
                        size="sm"
                        mr={1}
                        variant="ghost"
                        onClick={() => handleOpenView(dept)}
                      />
                      <IconButton
                        aria-label="Assign Head"
                        icon={<EditIcon />}
                        size="sm"
                        mr={1}
                        variant="ghost"
                        onClick={() => handleOpenAssignHead(dept)}
                      />
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        )}
      </Box>

      {/* Add Department Modal */}
      <AddDepartmentModal
        isOpen={addModalOpen}
        onClose={handleCloseAdd}
        onDepartmentAdded={handleDepartmentAdded}
      />

      {/* Assign Head Modal */}
      <AssignHeadModal
        isOpen={assignHeadModalOpen}
        onClose={handleCloseAssignHead}
        departmentName={selectedDepartment?.name || ''}
        users={userOptions}
        onAssign={handleAssignHead}
      />

      {/* View Department Modal */}
      <ViewDepartmentModal
        isOpen={viewModalOpen}
        onClose={handleCloseView}
        department={selectedDepartment}
      />
    </Box>
  );
};

export default DepartmentPage;
