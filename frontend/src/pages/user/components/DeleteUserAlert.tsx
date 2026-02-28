import React from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useToast,
} from '@chakra-ui/react';

interface DeleteUserAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  userName: string;
  loading: boolean;
}

const DeleteUserAlert: React.FC<DeleteUserAlertProps> = ({
  isOpen,
  onClose,
  onDelete,
  userName,
  loading,
}) => {
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader fontSize="lg" fontWeight="bold">
          Delete User
        </AlertDialogHeader>
        <AlertDialogBody>
          Are you sure you want to delete <b>{userName}</b>? This action cannot be undone.
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={onDelete} ml={3} isLoading={loading}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserAlert;
