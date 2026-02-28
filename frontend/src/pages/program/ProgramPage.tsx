import React, { useState, useEffect } from 'react';

function formatDate(dateStr?: string) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '-';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
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
  // useToast,
  Spinner,
  Badge,
  // Select,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

// Dummy types and data for UI scaffolding
type ProgramStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'SUSPENDED';
interface Program {
  id: string;
  title: string;
  description?: string;
  status: ProgramStatus;
  officerId: { id: string; firstName: string; lastName: string; email: string };
  startDate: string;
  endDate?: string;
  createdBy: string;
  createdAt: string;
}

const ProgramPage: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  // const toast = useToast();

  const navigate = useNavigate();
  const [, setStatusModalOpen] = useState(false);
  const [, setSelectedProgram] = useState<Program | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/program`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.programs) {
          setPrograms(
            data.programs.map((p: any) => ({
              id: p._id,
              title: p.title,
              description: p.description,
              status: p.status,
              officerId: p.officerId,
              startDate: p.startDate,
              endDate: p.endDate,
              createdBy: p.createdBy,
              createdAt: p.createdAt,
            })),
          );
        } else {
          setPrograms([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setPrograms([]);
        setLoading(false);
      });
  }, []);

  // Handlers
  const handleOpenAdd = () => navigate('/programs/create');
  const handleOpenStatus = (program: Program) => {
    setSelectedProgram(program);
    setStatusModalOpen(true);
  };
  // const handleCloseStatus = () => {
  //   setStatusModalOpen(false);
  //   setSelectedProgram(null);
  // };

  return (
    <Box>
      <Flex mb={4} justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold">
          Programs
        </Text>
        <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={handleOpenAdd}>
          Add Program
        </Button>
      </Flex>
      <Box borderRadius="lg" boxShadow="md" bg="white" p={2} overflowX="auto">
        {loading ? (
          <Flex justify="center" align="center" minH="200px">
            <Spinner size="lg" />
          </Flex>
        ) : programs.length === 0 ? (
          <Flex justify="center" align="center" minH="200px">
            <Text fontSize="lg" color="gray.500">
              No programs found.
            </Text>
          </Flex>
        ) : (
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Status</Th>
                <Th>Officer</Th>
                <Th>Start</Th>
                <Th>End</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {programs.length === 0 ? (
                <Tr>
                  <Td colSpan={6} textAlign="center">
                    No programs found.
                  </Td>
                </Tr>
              ) : (
                programs.map((program) => (
                  <Tr key={program.id}>
                    <Td>{program.title}</Td>
                    <Td>
                      <Badge
                        colorScheme={
                          program.status === 'ACTIVE'
                            ? 'green'
                            : program.status === 'COMPLETED'
                              ? 'blue'
                              : program.status === 'SUSPENDED'
                                ? 'red'
                                : 'gray'
                        }
                      >
                        {program.status}
                      </Badge>
                    </Td>
                    <Td>
                      <Stack spacing={0}>
                        <Text fontWeight="medium">
                          {program.officerId.firstName} {program.officerId.lastName}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {program.officerId.email}
                        </Text>
                      </Stack>
                    </Td>
                    <Td>{formatDate(program.startDate)}</Td>
                    <Td>{formatDate(program.endDate)}</Td>
                    <Td>
                      <IconButton
                        aria-label="View"
                        icon={<ViewIcon />}
                        size="sm"
                        mr={1}
                        variant="ghost"
                        onClick={() => navigate(`/programs/${program.id}`)}
                      />
                      <IconButton
                        aria-label="Update Status"
                        icon={<EditIcon />}
                        size="sm"
                        mr={1}
                        variant="ghost"
                        onClick={() => handleOpenStatus(program)}
                      />
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        )}
      </Box>

      {/* Add Program Modal Placeholder */}
      {/* TODO: Implement AddProgramModal */}

      {/* Update Status Modal Placeholder */}
      {/* TODO: Implement UpdateStatusModal */}
    </Box>
  );
};

export default ProgramPage;
