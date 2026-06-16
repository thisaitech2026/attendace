import { format, isValid, parseISO } from 'date-fns';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export interface LeaveDateErrors {
  start?: string;
  end?: string;
}

export function formatDateInput(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

export function parseLeaveDate(value: string): Date | null {
  const trimmed = value.trim();
  if (!DATE_PATTERN.test(trimmed)) return null;

  const date = parseISO(trimmed);
  if (!isValid(date)) return null;
  if (format(date, 'yyyy-MM-dd') !== trimmed) return null;

  return date;
}

export function validateLeaveDateRange(startDate: string, endDate: string): {
  valid: boolean;
  errors: LeaveDateErrors;
} {
  const errors: LeaveDateErrors = {};

  if (!startDate.trim()) {
    errors.start = 'Start date is required';
  } else if (!parseLeaveDate(startDate)) {
    errors.start = 'Enter a valid date (YYYY-MM-DD)';
  }

  if (!endDate.trim()) {
    errors.end = 'End date is required';
  } else if (!parseLeaveDate(endDate)) {
    errors.end = 'Enter a valid date (YYYY-MM-DD)';
  }

  if (!errors.start && !errors.end) {
    const start = parseLeaveDate(startDate)!;
    const end = parseLeaveDate(endDate)!;
    if (end < start) {
      errors.end = 'End date must be on or after start date';
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function calculateLeaveDays(startDate: string, endDate: string): number {
  const start = parseLeaveDate(startDate);
  const end = parseLeaveDate(endDate);
  if (!start || !end) return 0;
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}
