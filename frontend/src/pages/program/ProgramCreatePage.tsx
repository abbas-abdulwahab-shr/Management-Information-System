/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useToast,
  RadioGroup,
  Radio,
} from '@chakra-ui/react';
import {
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepTitle,
  StepDescription,
  StepSeparator,
  StepIcon,
} from '@chakra-ui/stepper';
import { useNavigate } from 'react-router-dom';

// Dummy data for sponsors, departments, and budgets

// Departments fetched from backend

const ProgramCreatePage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);

  const steps = [
    { title: 'Program Details', description: 'Enter program information' },
    { title: 'Budget', description: 'Set up program budget' },
  ];

  const [form, setForm] = useState({
    title: '',
    description: '',
    primarySponsor: '',
    supportingSponsor: '',
    department: '',
    officerId: '',
    startDate: '',
    endDate: '',
    budgetOption: 'new',
    existingBudget: '',
    budgetAmount: '',
    budgetCurrency: 'USD',
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        primarySponsor: form.primarySponsor,
        supportingSponsor: form.supportingSponsor,
        departmentId: form.department,
        officerId: form.officerId,
        startDate: form.startDate,
        endDate: form.endDate,
        budget: form.budgetAmount,
      };
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/program/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Program created', status: 'success', duration: 2000 });
        navigate('/programs');
      } else {
        toast({
          title: data.message || 'Failed to create program',
          status: 'error',
          duration: 2000,
        });
      }
    } catch (err) {
      toast({ title: 'Failed to create program', status: 'error', duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/department`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDepartments(
          (data.departments || []).map((d: any) => ({
            id: d._id,
            name: d.name,
          })),
        );
      });
    fetch(`${import.meta.env.VITE_API_URL}/api/user/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(
          (data.users || []).map((u: any) => ({
            id: u._id,
            name: `${u.firstName} ${u.lastName}`,
          })),
        );
      });
  }, []);

  return (
    <Box maxW="600px" mx="auto" p={{ base: 4, md: 8 }}>
      <Heading size="lg" mb={6}>
        Create New Program
      </Heading>
      <form onSubmit={handleSubmit}>
        {/* Stepper UI */}
        <Stepper index={step - 1} mb={8} colorScheme="teal">
          {steps.map((s, i) => (
            <Step key={s.title}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepIcon />}
                  active={<StepIcon />}
                />
              </StepIndicator>
              <Box flexShrink={0}>
                <StepTitle>{s.title}</StepTitle>
                <StepDescription>{s.description}</StepDescription>
              </Box>
              <StepSeparator />
            </Step>
          ))}
        </Stepper>
        {step === 1 && (
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input name="title" value={form.title} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea name="description" value={form.description} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Primary Sponsor</FormLabel>
              <Input
                name="primarySponsor"
                value={form.primarySponsor}
                onChange={handleChange}
                placeholder="Enter primary sponsor name"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Supporting Sponsor</FormLabel>
              <Input
                name="supportingSponsor"
                value={form.supportingSponsor}
                onChange={handleChange}
                placeholder="Enter supporting sponsor name (optional)"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Department</FormLabel>
              <Select
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="Select department"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Officer</FormLabel>
              <Select
                name="officerId"
                value={form.officerId}
                onChange={handleChange}
                placeholder="Select officer"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Start Date</FormLabel>
              <Input name="startDate" type="date" value={form.startDate} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>End Date</FormLabel>
              <Input name="endDate" type="date" value={form.endDate} onChange={handleChange} />
            </FormControl>
            <Flex justify="flex-end" mt={2}>
              <Button
                colorScheme="teal"
                onClick={handleNext}
                isDisabled={
                  !form.title || !form.primarySponsor || !form.department || !form.startDate
                }
              >
                Next: Budget
              </Button>
            </Flex>
          </Stack>
        )}
        {step === 2 && (
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Budget Option</FormLabel>
              <RadioGroup
                name="budgetOption"
                value={form.budgetOption}
                onChange={(val) => setForm((f) => ({ ...f, budgetOption: val }))}
              >
                <Stack direction="row">
                  <Radio value="new">Create New Budget</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
            <>
              <FormControl isRequired>
                <FormLabel>Budget Amount</FormLabel>
                <Input
                  name="budgetAmount"
                  type="number"
                  value={form.budgetAmount}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Currency</FormLabel>
                <Select name="budgetCurrency" value={form.budgetCurrency} onChange={handleChange}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="NGN">NGN</option>
                </Select>
              </FormControl>
            </>
            <Flex justify="space-between" mt={2}>
              <Button onClick={handleBack} variant="ghost">
                Back
              </Button>
              <Button colorScheme="teal" type="submit" isLoading={loading}>
                Create Program
              </Button>
            </Flex>
          </Stack>
        )}
      </form>
    </Box>
  );
};

export default ProgramCreatePage;
