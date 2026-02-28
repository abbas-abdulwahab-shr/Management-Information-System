import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Flex,
  Text,
  Badge,
  Stack,
  Divider,
} from '@chakra-ui/react';

interface Department {
  id: string;
  name: string;
  head?: { id: string; firstName: string; lastName: string; email: string };
  programs: { id: string; title: string; status: string }[];
  createdAt: string;
}

interface ViewDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null;
}

const ViewDepartmentModal: React.FC<ViewDepartmentModalProps> = ({
  isOpen,
  onClose,
  department,
}) => {
  if (!department) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent borderRadius="2xl" boxShadow="2xl" p={6}>
        <ModalHeader textAlign="center" fontWeight="bold" fontSize="2xl" letterSpacing="wide">
          Department Details
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <Flex align="center" justify="space-between">
              <Text color="gray.500" fontWeight="medium">
                Name
              </Text>
              <Text fontWeight="medium">{department.name}</Text>
            </Flex>
            <Flex align="center" justify="space-between">
              <Text color="gray.500" fontWeight="medium">
                Head
              </Text>
              {department.head ? (
                <Box textAlign="right">
                  <Text fontWeight="medium">
                    {department.head.firstName} {department.head.lastName}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {department.head.email}
                  </Text>
                </Box>
              ) : (
                <Badge colorScheme="yellow">Unassigned</Badge>
              )}
            </Flex>
            <Divider />
            <Box>
              <Text color="gray.500" fontWeight="medium" mb={1}>
                Programs
              </Text>
              {department.programs.length === 0 ? (
                <Text fontSize="sm" color="gray.400">
                  No programs
                </Text>
              ) : (
                <Stack spacing={1}>
                  {department.programs.map((p) => (
                    <Flex key={p.id} align="center" justify="space-between">
                      <Text>{p.title}</Text>
                      <Badge colorScheme={p.status === 'Active' ? 'green' : 'gray'}>
                        {p.status}
                      </Badge>
                    </Flex>
                  ))}
                </Stack>
              )}
            </Box>
            <Divider />
            <Flex align="center" justify="space-between">
              <Text color="gray.500" fontWeight="medium">
                Created
              </Text>
              <Text fontWeight="medium">{department.createdAt}</Text>
            </Flex>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ViewDepartmentModal;
