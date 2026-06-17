import { addDays, format, startOfDay } from 'date-fns';

export interface SelectOption {
  label: string;
  value: string;
}

export const LEAVE_REASON_OPTIONS: SelectOption[] = [
  { value: 'family_vacation', label: 'Family vacation' },
  { value: 'medical_appointment', label: 'Medical appointment' },
  { value: 'sick_leave', label: 'Sick leave' },
  { value: 'personal_work', label: 'Personal work' },
  { value: 'family_event', label: 'Family event / wedding' },
  { value: 'bereavement', label: 'Bereavement' },
  { value: 'maternity_paternity', label: 'Maternity / paternity' },
  { value: 'other', label: 'Other personal reason' },
];

export function buildLeaveDateOptions(daysAhead = 90): SelectOption[] {
  const today = startOfDay(new Date());
  return Array.from({ length: daysAhead + 1 }, (_, index) => {
    const date = addDays(today, index);
    const value = format(date, 'yyyy-MM-dd');
    return {
      value,
      label: format(date, 'EEE, MMM d, yyyy'),
    };
  });
}

export function getLeaveReasonLabel(value: string): string {
  return LEAVE_REASON_OPTIONS.find((option) => option.value === value)?.label ?? value;
}
