import React, { useEffect, useState } from 'react';
import AddUserModal from './components/AddUserModal';
import ViewUserModal from './components/ViewUserModal';
import DeleteUserAlert from './components/DeleteUserAlert';
import ChangeRoleModal from './components/ChangeRoleModal';
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
  useDisclosure,
  useToast,
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

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [changeRoleModalOpen, setChangeRoleModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [roleChangeLoading, setRoleChangeLoading] = useState(false);
  const toast = useToast();

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.users) {
          setUsers(
            data.users.map((u: any) => ({
              id: u._id,
              firstName: u.firstName,
              lastName: u.lastName,
              email: u.email,
              role: u.role,
              department: u.department?.name || '-',
              isActive: u.isActive,
            })),
          );
        } else {
          setUsers([]);
        }
      } catch {
        setUsers([]);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  // Handlers for modals
  const handleOpenAdd = () => setAddModalOpen(true);
  const handleCloseAdd = () => setAddModalOpen(false);

  const handleOpenView = (user: User) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };
  const handleCloseView = () => {
    setViewModalOpen(false);
    setSelectedUser(null);
  };

  const handleOpenDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };
  const handleCloseDelete = () => {
    setDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleOpenChangeRole = (user: User) => {
    setSelectedUser(user);
    setChangeRoleModalOpen(true);
  };
  const handleCloseChangeRole = () => {
    setChangeRoleModalOpen(false);
    setSelectedUser(null);
  };

  // Placeholder for API actions
  const handleDeleteUser = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== selectedUser?.id));
        toast({ title: 'User deleted', status: 'success', duration: 2000 });
        handleCloseDelete();
      } else {
        toast({ title: 'Failed to delete user', status: 'error', duration: 2000 });
      }
    } catch {
      toast({ title: 'Failed to delete user', status: 'error', duration: 2000 });
    }
    setDeleteLoading(false);
  };

  const handleRoleChanged = (newRole: string) => {
    if (selectedUser) {
      fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ role: newRole }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUsers((prev) =>
              prev.map((u) => (u.id === selectedUser.id ? { ...u, role: newRole } : u)),
            );
            toast({ title: 'Role updated', status: 'success', duration: 2000 });
          } else {
            toast({ title: 'Failed to update role', status: 'error', duration: 2000 });
          }
          handleCloseChangeRole();
        })
        .catch(() => {
          toast({ title: 'Failed to update role', status: 'error', duration: 2000 });
          handleCloseChangeRole();
        });
    }
  };

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Filtered users
  const filteredUsers = users.filter(
    (u) =>
      (u.firstName + ' ' + u.lastName + u.email).toLowerCase().includes(search.toLowerCase()) &&
      (roleFilter ? u.role === roleFilter : true),
  );

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  // Reset to first page on filter/search change
  React.useEffect(() => {
    setPage(1);
  }, [search, roleFilter]);

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
        <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={handleOpenAdd}>
          Add User
        </Button>
      </Flex>
      <Box borderRadius="lg" boxShadow="md" bg="white" p={2} overflowX="auto">
        {loading ? (
          <Flex justify="center" align="center" minH="200px">
            <Spinner size="lg" />
          </Flex>
        ) : (
          <>
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
                {paginatedUsers.length === 0 ? (
                  <Tr>
                    <Td colSpan={6} textAlign="center">
                      No users found.
                    </Td>
                  </Tr>
                ) : (
                  paginatedUsers.map((user) => (
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
                          onClick={() => handleOpenView(user)}
                        />
                        <IconButton
                          aria-label="Edit"
                          icon={<EditIcon />}
                          size="sm"
                          mr={1}
                          variant="ghost"
                          onClick={() => handleOpenChangeRole(user)}
                        />
                        <IconButton
                          aria-label="Delete"
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleOpenDelete(user)}
                        />
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <Flex justify="flex-end" align="center" mt={4} gap={2}>
                <Button
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    size="sm"
                    onClick={() => setPage(i + 1)}
                    colorScheme={page === i + 1 ? 'teal' : undefined}
                    variant={page === i + 1 ? 'solid' : 'outline'}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  variant="outline"
                >
                  Next
                </Button>
              </Flex>
            )}
          </>
        )}
      </Box>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={addModalOpen}
        onClose={handleCloseAdd}
        onUserAdded={() => {
          // Refetch users from API
          setLoading(true);
          fetch(`${import.meta.env.VITE_API_URL}/api/user/users`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.users) {
                setUsers(
                  data.users.map((u: any) => ({
                    id: u._id,
                    firstName: u.firstName,
                    lastName: u.lastName,
                    email: u.email,
                    role: u.role,
                    department: u.department?.name || '-',
                    isActive: u.isActive,
                  })),
                );
              }
              setLoading(false);
            })
            .catch(() => setLoading(false));
        }}
      />

      {/* View User Modal */}
      <ViewUserModal isOpen={viewModalOpen} onClose={handleCloseView} user={selectedUser} />

      {/* Delete User Alert */}
      <DeleteUserAlert
        isOpen={deleteModalOpen}
        onClose={handleCloseDelete}
        onDelete={handleDeleteUser}
        userName={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : ''}
        loading={deleteLoading}
      />

      {/* Change Role Modal */}
      {selectedUser && (
        <ChangeRoleModal
          isOpen={changeRoleModalOpen}
          onClose={handleCloseChangeRole}
          userId={selectedUser.id}
          currentRole={selectedUser.role}
          onRoleChanged={handleRoleChanged}
        />
      )}
    </Box>
  );
};

export default UsersPage;
