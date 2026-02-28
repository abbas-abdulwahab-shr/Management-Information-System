import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  Spinner,
  Stack,
} from '@chakra-ui/react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onUserAdded }) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    department: '',
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Replace with real API call
      await new Promise((res) => setTimeout(res, 1000));
      toast({ title: 'User added successfully', status: 'success', duration: 2000 });
      onUserAdded();
      onClose();
    } catch (err) {
      toast({ title: 'Failed to add user', status: 'error', duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add User</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <Stack spacing={3}>
              <FormControl isRequired>
                <FormLabel>First Name</FormLabel>
                <Input name="firstName" value={form.firstName} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input name="lastName" value={form.lastName} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input name="email" type="email" value={form.email} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Role</FormLabel>
                <Select name="role" value={form.role} onChange={handleChange}>
                  <option value="">Select role</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="DEPARTMENT_HEAD">Department Head</option>
                  <option value="ANALYST">Analyst</option>
                  <option value="OFFICER">Officer</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Department</FormLabel>
                <Input name="department" value={form.department} onChange={handleChange} />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3} variant="ghost">
              Cancel
            </Button>
            <Button colorScheme="teal" type="submit" isLoading={loading}>
              Add
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddUserModal;
