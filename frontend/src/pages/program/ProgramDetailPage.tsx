import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Badge,
  Flex,
  Divider,
  Avatar,
  Icon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Tag,
  Button,
} from '@chakra-ui/react';
import { CalendarIcon, InfoIcon, TimeIcon, AtSignIcon } from '@chakra-ui/icons';
import { useParams } from 'react-router-dom';

interface Officer {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface ProgramDetail {
  id: string;
  title: string;
  description?: string;
  status: string;
  officerId: Officer;
  department?: string;
  startDate?: string;
  endDate?: string;
  createdBy?: string;
  createdAt?: string;
  budget?: string;
  amountSpent?: number;
  impact?: string;
  location?: string;
  duration?: string;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '-';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const ProgramDetailPage: React.FC = () => {
  const { id } = useParams();
  const [program, setProgram] = useState<ProgramDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/program/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.program) {
          setProgram({
            id: data.program._id,
            title: data.program.title,
            description: data.program.description,
            status: data.program.status,
            officerId: data.program.officerId,
            department: data.program.department,
            startDate: data.program.startDate,
            endDate: data.program.endDate,
            createdBy: data.program.createdBy,
            createdAt: data.program.createdAt,
            budget: data.program.budget,
            amountSpent: data.program.amountSpent,
            impact: data.program.impact,
            location: data.program.location,
            duration: data.program.duration,
          });
          setError(null);
        } else {
          setError('Program not found');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch program details');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box maxW="900px" mx="auto" p={{ base: 4, md: 8 }}>
        <Text>Loading...</Text>
      </Box>
    );
  }
  if (error || !program) {
    return (
      <Box maxW="900px" mx="auto" p={{ base: 4, md: 8 }}>
        <Text color="red.500">{error || 'Program not found.'}</Text>
      </Box>
    );
  }

  return (
    <Box maxW="900px" mx="auto" p={{ base: 4, md: 8 }}>
      <Box
        bgGradient="linear(to-br, teal.50, white)"
        boxShadow="xl"
        borderRadius="2xl"
        p={{ base: 6, md: 10 }}
        mb={8}
      >
        <Flex align="center" justify="space-between" mb={4}>
          <Heading size="lg" color="teal.700">
            {program.title}
          </Heading>
          <Badge
            fontSize="md"
            px={4}
            py={2}
            borderRadius="md"
            colorScheme={
              program.status === 'ACTIVE'
                ? 'green'
                : program.status === 'COMPLETED'
                  ? 'blue'
                  : program.status === 'SUSPENDED'
                    ? 'red'
                    : 'gray'
            }
            boxShadow="md"
          >
            {program.status}
          </Badge>
        </Flex>
        <Text fontSize="lg" color="gray.700" mb={4}>
          {program.description}
        </Text>
        <Divider mb={6} />
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Box>
            <Text fontWeight="bold" fontSize="md" mb={2} color="teal.600">
              Officer in Charge
            </Text>
            <Flex align="center" mb={4}>
              <Avatar
                name={`${program.officerId.firstName} ${program.officerId.lastName}`}
                src={program.officerId.avatar || ''}
                size="lg"
                mr={4}
              />
              <Box>
                <Text fontWeight="bold" fontSize="lg">
                  {program.officerId.firstName} {program.officerId.lastName}
                </Text>
                <Tag colorScheme="blue" mt={1} fontSize="sm">
                  {program.officerId.role || 'Officer'}
                </Tag>
              </Box>
            </Flex>
            <Flex align="center" mb={3}>
              <Icon as={AtSignIcon} mr={2} color="gray.500" />
              <Text fontWeight="bold">Department:</Text>
              <Text ml={2}>{program.department}</Text>
            </Flex>
            <Flex align="center" mb={3}>
              <Icon as={InfoIcon} mr={2} color="gray.500" />
              <Text fontWeight="bold">Location:</Text>
              <Text ml={2}>{program.location}</Text>
            </Flex>
            <Flex align="center" mb={3}>
              <Icon as={CalendarIcon} mr={2} color="gray.500" />
              <Text fontWeight="bold">Start Date:</Text>
              <Text ml={2}>{formatDate(program.startDate)}</Text>
            </Flex>
            <Flex align="center" mb={3}>
              <Icon as={CalendarIcon} mr={2} color="gray.500" />
              <Text fontWeight="bold">End Date:</Text>
              <Text ml={2}>{formatDate(program.endDate)}</Text>
            </Flex>
            <Flex align="center" mb={3}>
              <Icon as={TimeIcon} mr={2} color="gray.500" />
              <Text fontWeight="bold">Duration:</Text>
              <Text ml={2}>{program.duration}</Text>
            </Flex>
          </Box>
          <Box>
            <Text fontWeight="bold" fontSize="md" mb={2} color="teal.600">
              Budget & Impact
            </Text>
            <Box bg="teal.50" borderRadius="lg" p={4} boxShadow="md" mb={4}>
              <Stat>
                <StatLabel>Allocated/Estimated Budget</StatLabel>
                <StatNumber color="teal.600">
                  {program.budget ? `$${program.budget}` : '-'}
                </StatNumber>
                <StatHelpText>Estimated</StatHelpText>
              </Stat>
              {typeof program.amountSpent === 'number' && (
                <Stat mt={4}>
                  <StatLabel>Amount Spent</StatLabel>
                  <StatNumber color="orange.500">
                    ${program.amountSpent.toLocaleString()}
                  </StatNumber>
                  <StatHelpText>
                    <StatArrow
                      type={
                        program.budget && Number(program.amountSpent) > Number(program.budget)
                          ? 'decrease'
                          : 'increase'
                      }
                    />
                    {program.budget && Number(program.amountSpent) > Number(program.budget)
                      ? 'Over Budget'
                      : 'Within Budget'}
                  </StatHelpText>
                </Stat>
              )}
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Impact
              </Text>
              <Text color="gray.700">{program.impact}</Text>
            </Box>
          </Box>
        </SimpleGrid>
        <Divider mt={8} mb={6} />
        <Flex justify="flex-end">
          <Button colorScheme="teal" variant="solid" size="md" boxShadow="md">
            Edit Program
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default ProgramDetailPage;
