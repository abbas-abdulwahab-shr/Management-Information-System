import { useEffect, useState } from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Heading,
  Flex,
  useColorModeValue,
  Button,
  Icon,
  Skeleton,
  Link as ChakraLink,
  List,
  ListItem,
  ListIcon,
  useToast,
} from '@chakra-ui/react';
import {
  AtSignIcon,
  CalendarIcon,
  RepeatIcon,
  InfoOutlineIcon,
  ViewIcon,
  SearchIcon,
  ExternalLinkIcon,
  CheckCircleIcon,
} from '@chakra-ui/icons';

const quickLinks = [
  { label: 'Users', to: '/users', icon: AtSignIcon },
  { label: 'Departments', to: '/departments', icon: CalendarIcon },
  { label: 'Programs', to: '/programs', icon: RepeatIcon },
  { label: 'Budgets', to: '/budgets', icon: InfoOutlineIcon },
  { label: 'Reports', to: '/reports', icon: ViewIcon },
  { label: 'Audit Log', to: '/audit', icon: SearchIcon },
];

const DashboardPage = () => {
  const [summary, setSummary] = useState<any>(null);
  const [projectsPerDept, setProjectsPerDept] = useState<any[]>([]);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const colorModeValue = useColorModeValue;

  useEffect(() => {
    const eventSource = new EventSource(`${import.meta.env.VITE_API_URL}/api/dashboard/stream`);

    eventSource.addEventListener('dashboard', (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        setSummary({
          programs: data.summary?.totalPrograms ?? '0',
          users: data.summary?.totalUsers ?? '0',
          departments: data.summary?.totalDepartments ?? data.summary?.departments ?? '0',
        });

        setProjectsPerDept(
          data.projects?.projectsPerDepartment?.map((dept: any) => ({
            department: dept._id || 'Unknown',
            projects: dept.projects?.join(', '),
            count: dept.count,
          })) ?? [],
        );

        setActiveUsers(
          data.users?.activeUsers?.map((user: any) => ({
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
          })) ?? [],
        );

        setLoading(false);
      } catch {
        setLoading(false);
        toast({
          title: 'Failed to parse dashboard update',
          status: 'error',
          isClosable: true,
        });
      }
    });

    eventSource.onerror = () => {
      setLoading(false);
      toast({
        title: 'Dashboard SSE connection lost',
        status: 'error',
        isClosable: true,
      });
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [toast]);

  const handleSyncERP = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/erp/sync`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.ok) {
        toast({ title: 'ERP Sync completed successfully', status: 'success', isClosable: true });
      } else {
        toast({ title: 'ERP Sync failed', status: 'error', isClosable: true });
      }
    } catch {
      toast({ title: 'ERP Sync failed', status: 'error', isClosable: true });
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="lg" color={useColorModeValue('teal.600', 'teal.300')}>
          Dashboard
        </Heading>
        <Button colorScheme="teal" leftIcon={<RepeatIcon />} onClick={handleSyncERP}>
          Sync ERP
        </Button>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
        <Skeleton isLoaded={!loading} borderRadius="lg">
          <Stat
            p={6}
            bg={colorModeValue('white', 'gray.800')}
            borderRadius="lg"
            boxShadow="0 4px 24px 0 rgba(0,0,0,0.16), 0 1.5px 6px 0 rgba(0,0,0,0.12)"
            display="flex"
            alignItems="center"
            gap={4}
          >
            <Icon as={quickLinks[0].icon} boxSize={8} color="teal.400" />
            <Box>
              <StatLabel>{quickLinks[0].label}</StatLabel>
              <StatNumber>{summary?.users}</StatNumber>
              <StatHelpText></StatHelpText>
            </Box>
          </Stat>
        </Skeleton>
        <Skeleton isLoaded={!loading} borderRadius="lg">
          <Stat
            p={6}
            bg={colorModeValue('white', 'gray.800')}
            borderRadius="lg"
            boxShadow="0 4px 24px 0 rgba(0,0,0,0.16), 0 1.5px 6px 0 rgba(0,0,0,0.12)"
            display="flex"
            alignItems="center"
            gap={4}
          >
            <Icon as={quickLinks[2].icon} boxSize={8} color="teal.400" />
            <Box>
              <StatLabel>{quickLinks[2].label}</StatLabel>
              <StatNumber>{summary?.programs ?? '--'}</StatNumber>
              <StatHelpText></StatHelpText>
            </Box>
          </Stat>
        </Skeleton>
      </SimpleGrid>

      <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
        <Box
          flex={1}
          p={6}
          bg={useColorModeValue('white', 'gray.800')}
          borderRadius="lg"
          boxShadow="0 4px 24px 0 rgba(0,0,0,0.16), 0 1.5px 6px 0 rgba(0,0,0,0.12)"
        >
          <Heading size="md" mb={4}>
            Quick Links
          </Heading>
          <List spacing={3}>
            {quickLinks.map((link) => (
              <ListItem key={link.to}>
                <ChakraLink
                  href={link.to}
                  display="flex"
                  alignItems="center"
                  color="teal.500"
                  fontWeight="medium"
                  _hover={{ textDecoration: 'underline', color: 'teal.600' }}
                >
                  <ListIcon as={link.icon} color="teal.400" />
                  {link.label}
                  <ExternalLinkIcon ml={2} />
                </ChakraLink>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box
          flex={2}
          p={6}
          bg={useColorModeValue('white', 'gray.800')}
          borderRadius="lg"
          boxShadow="0 4px 24px 0 rgba(0,0,0,0.16), 0 1.5px 6px 0 rgba(0,0,0,0.12)"
        >
          <Heading size="md" mb={4}>
            Projects per Department
          </Heading>
          <Skeleton isLoaded={!loading} borderRadius="md">
            <List spacing={2}>
              {projectsPerDept.length > 0 ? (
                projectsPerDept.map((dept: any) => (
                  <ListItem key={dept.department} display="flex" alignItems="center">
                    <CheckCircleIcon color="teal.400" mr={2} />
                    <Box flex={1}>{dept.department}</Box>
                    <Box fontWeight="bold">{dept.projects}</Box>
                  </ListItem>
                ))
              ) : (
                <Box color="gray.400">No data</Box>
              )}
            </List>
          </Skeleton>
        </Box>
      </Flex>

      <Box
        mt={8}
        p={6}
        bg={useColorModeValue('white', 'gray.800')}
        borderRadius="lg"
        boxShadow="0 4px 24px 0 rgba(0,0,0,0.16), 0 1.5px 6px 0 rgba(0,0,0,0.12)"
      >
        <Heading size="md" mb={4}>
          Active Users
        </Heading>
        <Skeleton isLoaded={!loading} borderRadius="md">
          <List spacing={2}>
            {activeUsers.length > 0 ? (
              activeUsers.map((user: any) => (
                <ListItem key={user.id} display="flex" alignItems="center">
                  <AtSignIcon color="teal.400" mr={2} />
                  <Box flex={1}>{user.name}</Box>
                  <Box color="gray.500">{user.role}</Box>
                </ListItem>
              ))
            ) : (
              <Box color="gray.400">No active users</Box>
            )}
          </List>
        </Skeleton>
      </Box>

      {/* Sync ERP button moved to top right */}
    </Box>
  );
};

export default DashboardPage;
