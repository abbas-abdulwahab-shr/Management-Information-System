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
  useToast,
  Stack,
} from '@chakra-ui/react';

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDepartmentAdded: (name: string) => void;
}

const AddDepartmentModal: React.FC<AddDepartmentModalProps> = ({
  isOpen,
  onClose,
  onDepartmentAdded,
}) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/department/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (res.ok && data.department) {
        toast({ title: 'Department added', status: 'success', duration: 2000 });
        onDepartmentAdded(data.department.name);
        setName('');
        onClose();
      } else {
        toast({
          title: data.message || 'Failed to add department',
          status: 'error',
          duration: 2000,
        });
      }
    } catch (err) {
      toast({ title: 'Failed to add department', status: 'error', duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Department</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <Stack spacing={3}>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Department name"
                />
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

export default AddDepartmentModal;
