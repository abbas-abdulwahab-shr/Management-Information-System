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
  Select,
  useToast,
} from '@chakra-ui/react';

interface ChangeRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentRole: string;
  onRoleChanged: (newRole: string) => void;
}

const ChangeRoleModal: React.FC<ChangeRoleModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onRoleChanged,
}) => {
  const [role, setRole] = useState(currentRole);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Replace with real API call
      await new Promise((res) => setTimeout(res, 1000));
      toast({ title: 'Role updated', status: 'success', duration: 2000 });
      onRoleChanged(role);
      onClose();
    } catch (err) {
      toast({ title: 'Failed to update role', status: 'error', duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Change User Role</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Role</FormLabel>
              <Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="DEPARTMENT_HEAD">Department Head</option>
                <option value="ANALYST">Analyst</option>
                <option value="OFFICER">Officer</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3} variant="ghost">
              Cancel
            </Button>
            <Button colorScheme="teal" type="submit" isLoading={loading}>
              Change
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ChangeRoleModal;
