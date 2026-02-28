import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Text,
  Badge,
  Input,
  Icon,
  Flex,
  // Button,
  // Stack,
  Select,
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon, TimeIcon } from '@chakra-ui/icons';

const AuditLogPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/auditlog`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((r) => r.json())
      .then((data) => setAuditLogs(data.logs || []))
      .catch(() => setAuditLogs([]));
  }, []);

  const filteredLogs = auditLogs.filter(
    (log) =>
      (log.performedBy?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        log.performedBy?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        log.actionType?.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter ? log.status === statusFilter : true),
  );

  return (
    <Box w="100%" p={{ base: 4, md: 8 }}>
      <Box
        w="100%"
        bgGradient="linear(to-br, gray.50, white)"
        boxShadow="xl"
        borderRadius="2xl"
        p={{ base: 6, md: 10 }}
        mb={8}
      >
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg" color="gray.700">
            Audit Log
          </Heading>
          <Flex gap={2}>
            <Input
              placeholder="Search user, action, details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              width="220px"
              bg="white"
              boxShadow="sm"
              // leftIcon={<SearchIcon />}
            />
            <Select
              placeholder="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              width="120px"
              bg="white"
              boxShadow="sm"
            >
              <option value="Success">Success</option>
              <option value="Warning">Warning</option>
            </Select>
          </Flex>
        </Flex>
        <Box borderRadius="lg" boxShadow="md" bg="white" p={2} overflowX="auto">
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th>User</Th>
                <Th>Action</Th>
                <Th>Status</Th>
                <Th>Timestamp</Th>
                <Th>Details</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredLogs.length === 0 ? (
                <Tr>
                  <Td colSpan={5} textAlign="center">
                    <Text color="gray.400">No audit logs found.</Text>
                  </Td>
                </Tr>
              ) : (
                filteredLogs.map((log) => (
                  <Tr key={log.id}>
                    <Td>
                      <Flex align="center">
                        <Avatar
                          name={log.performedBy?.firstName + ' ' + log.performedBy?.lastName}
                          src={log.performedBy?.avatar}
                          size="sm"
                          mr={2}
                        />
                        <Box>
                          <Text fontWeight="bold">
                            {log.performedBy?.firstName} {log.performedBy?.lastName}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {log.performedBy?.role}
                          </Text>
                        </Box>
                      </Flex>
                    </Td>
                    <Td>
                      <Text>{log.actionType}</Text>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={log.status === 'Success' ? 'green' : 'yellow'}
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        {log.status}
                        {log.status === 'Success' ? (
                          <Icon as={CheckCircleIcon} ml={2} color="green.400" />
                        ) : (
                          <Icon as={WarningIcon} ml={2} color="yellow.400" />
                        )}
                      </Badge>
                    </Td>
                    <Td>
                      <Flex align="center">
                        <Icon as={TimeIcon} mr={1} color="gray.400" />
                        <Text fontSize="sm">{log.createdAt}</Text>
                      </Flex>
                    </Td>
                    <Td>
                      <Text color="gray.600">{`${log.actionType.toLowerCase()} ${log.entityType.toLowerCase()}`}</Text>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
};

export default AuditLogPage;
