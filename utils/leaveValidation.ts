import { format, isBefore, isValid, parseISO, startOfDay } from 'date-fns';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export interface LeaveDateErrors {
  start?: string;
  end?: string;
  reason?: string;
}

export interface LeaveFormValidation {
  valid: boolean;
  errors: LeaveDateErrors;
  summary: string | null;
}

const INVALID_DATE_MSG = 'Enter a valid date (YYYY-MM-DD)';
const FORMAT_MSG = 'Use format YYYY-MM-DD';

export function formatDateInput(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

export function formatLeaveDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function getTodayString(): string {
  return formatLeaveDate(startOfDay(new Date()));
}

export function parseLeaveDate(value: string): Date | null {
  const trimmed = value.trim();
  if (!DATE_PATTERN.test(trimmed)) return null;

  const date = startOfDay(parseISO(trimmed));
  if (!isValid(date)) return null;
  if (formatLeaveDate(date) !== trimmed) return null;

  return date;
}

export function getDateInputError(
  value: string,
  options: {
    required?: boolean;
    minDate?: string;
    rejectPast?: boolean;
    fieldLabel?: string;
  } = {}
): string | undefined {
  const trimmed = value.trim();
  const label = options.fieldLabel ?? 'Date';

  if (!trimmed) {
    return options.required ? `${label} is required` : undefined;
  }

  if (trimmed.length < 10) {
    return FORMAT_MSG;
  }

  if (!parseLeaveDate(trimmed)) {
    return INVALID_DATE_MSG;
  }

  const date = parseLeaveDate(trimmed)!;
  const today = startOfDay(new Date());

  if (options.rejectPast && isBefore(date, today)) {
    return 'Date cannot be in the past';
  }

  if (options.minDate) {
    const min = parseLeaveDate(options.minDate);
    if (min && isBefore(date, min)) {
      return `Date cannot be before ${options.minDate}`;
    }
  }

  return undefined;
}

export function validateLeaveDateRange(
  startDate: string,
  endDate: string,
  options: { rejectPastStart?: boolean } = { rejectPastStart: true }
): LeaveFormValidation {
  const errors: LeaveDateErrors = {};

  const startError = getDateInputError(startDate, {
    required: true,
    fieldLabel: 'Start date',
    rejectPast: options.rejectPastStart,
  });
  if (startError) errors.start = startError;

  const endError = getDateInputError(endDate, {
    required: true,
    fieldLabel: 'End date',
    minDate: parseLeaveDate(startDate) ? startDate : undefined,
  });
  if (endError) errors.end = endError;

  if (!errors.start && !errors.end) {
    const start = parseLeaveDate(startDate)!;
    const end = parseLeaveDate(endDate)!;
    if (isBefore(end, start)) {
      errors.end = 'End date cannot be before start date';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    summary: buildValidationSummary(errors),
  };
}

export function validateLeaveForm(
  startDate: string,
  endDate: string,
  reason: string,
  options: { rejectPastStart?: boolean } = { rejectPastStart: true }
): LeaveFormValidation {
  const dateValidation = validateLeaveDateRange(startDate, endDate, options);
  const errors = { ...dateValidation.errors };

  if (!reason.trim()) {
    errors.reason = 'Reason is required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    summary: buildValidationSummary(errors),
  };
}

function buildValidationSummary(errors: LeaveDateErrors): string | null {
  const messages = [errors.start, errors.end, errors.reason].filter(Boolean) as string[];
  if (messages.length === 0) return null;
  return messages.join('\n');
}

export function calculateLeaveDays(startDate: string, endDate: string): number {
  const start = parseLeaveDate(startDate);
  const end = parseLeaveDate(endDate);
  if (!start || !end) return 0;
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export function shouldShowDateFieldError(value: string, touched: boolean, showAllErrors: boolean): boolean {
  return showAllErrors || touched || value.length >= 10;
}
