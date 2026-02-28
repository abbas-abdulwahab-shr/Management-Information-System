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
  Stack,
} from '@chakra-ui/react';

interface UserOption {
  id: string;
  name: string;
}

interface AssignHeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentName: string;
  users: UserOption[];
  onAssign: (userId: string) => void;
}

const AssignHeadModal: React.FC<AssignHeadModalProps> = ({
  isOpen,
  onClose,
  departmentName,
  users,
  onAssign,
}) => {
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Replace with real API call
      await new Promise((res) => setTimeout(res, 800));
      toast({ title: 'Head assigned', status: 'success', duration: 2000 });
      onAssign(selected);
      setSelected('');
      onClose();
    } catch (err) {
      toast({ title: 'Failed to assign head', status: 'error', duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Assign Head to {departmentName}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <Stack spacing={3}>
              <FormControl isRequired>
                <FormLabel>Select User</FormLabel>
                <Select
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  placeholder="Select user"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3} variant="ghost">
              Cancel
            </Button>
            <Button colorScheme="teal" type="submit" isLoading={loading} disabled={!selected}>
              Assign
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AssignHeadModal;
