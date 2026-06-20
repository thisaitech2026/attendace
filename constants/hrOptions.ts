import { addDays, format, startOfDay } from 'date-fns';

import type { SelectOption } from '@/constants/leaveOptions';

export const DEPARTMENT_OPTIONS: SelectOption[] = [
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Human Resources', label: 'Human Resources' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Marketing', label: 'Marketing' },
];

export const POSITIONS_BY_DEPARTMENT: Record<string, SelectOption[]> = {
  Engineering: [
    { value: 'Junior Software Engineer', label: 'Junior Software Engineer' },
    { value: 'Software Engineer', label: 'Software Engineer' },
    { value: 'Senior Software Engineer', label: 'Senior Software Engineer' },
    { value: 'Engineering Manager', label: 'Engineering Manager' },
  ],
  'Human Resources': [
    { value: 'HR Executive', label: 'HR Executive' },
    { value: 'HR Manager', label: 'HR Manager' },
    { value: 'Recruiter', label: 'Recruiter' },
  ],
  Finance: [
    { value: 'Accountant', label: 'Accountant' },
    { value: 'Financial Analyst', label: 'Financial Analyst' },
    { value: 'Finance Manager', label: 'Finance Manager' },
  ],
  Operations: [
    { value: 'Operations Executive', label: 'Operations Executive' },
    { value: 'Operations Manager', label: 'Operations Manager' },
  ],
  Sales: [
    { value: 'Sales Executive', label: 'Sales Executive' },
    { value: 'Sales Manager', label: 'Sales Manager' },
  ],
  Marketing: [
    { value: 'Marketing Executive', label: 'Marketing Executive' },
    { value: 'Marketing Manager', label: 'Marketing Manager' },
  ],
};

export function buildJoinDateOptions(): SelectOption[] {
  const today = startOfDay(new Date());
  return Array.from({ length: 396 }, (_, index) => {
    const date = addDays(today, index - 30);
    const value = format(date, 'yyyy-MM-dd');
    return {
      value,
      label: format(date, 'EEE, MMM d, yyyy'),
    };
  });
}
