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
  Avatar,
  Badge,
  Text,
  Divider,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department?: string;
  isActive: boolean;
}

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({ isOpen, onClose, user }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const labelColor = useColorModeValue('gray.500', 'gray.400');
  if (!user) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent bg={cardBg} borderRadius="2xl" boxShadow="2xl" p={{ base: 6, md: 8 }}>
        <ModalHeader
          textAlign="center"
          fontWeight="bold"
          fontSize="2xl"
          letterSpacing="wide"
          pb={2}
        >
          User Profile
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody px={{ base: 4, md: 8 }} py={6}>
          <Flex direction="column" align="center" mb={6}>
            <Avatar
              size="xl"
              name={`${user.firstName} ${user.lastName}`}
              src={undefined}
              mb={2}
              bg="teal.500"
              color="white"
              fontWeight="bold"
            />
            <Text fontSize="xl" fontWeight="semibold">
              {user.firstName} {user.lastName}
            </Text>
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
              mt={1}
              px={3}
              py={1}
              borderRadius="md"
              fontSize="sm"
              textTransform="capitalize"
            >
              {user.role.replace('_', ' ')}
            </Badge>
          </Flex>
          <Divider mb={4} />
          <Stack spacing={4} px={2}>
            <Flex align="center" justify="space-between">
              <Text color={labelColor} fontWeight="medium">
                Email
              </Text>
              <Text fontWeight="medium">{user.email}</Text>
            </Flex>
            <Flex align="center" justify="space-between">
              <Text color={labelColor} fontWeight="medium">
                Department
              </Text>
              <Text fontWeight="medium">{user.department || '-'}</Text>
            </Flex>
            <Flex align="center" justify="space-between">
              <Text color={labelColor} fontWeight="medium">
                Status
              </Text>
              <Badge colorScheme={user.isActive ? 'green' : 'red'} px={3} py={1} borderRadius="md">
                {user.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </Flex>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ViewUserModal;
