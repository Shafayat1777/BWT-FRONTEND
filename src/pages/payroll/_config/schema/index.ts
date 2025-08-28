import { z } from 'zod';

import {
	BOOLEAN_REQUIRED,
	NUMBER_DOUBLE_OPTIONAL,
	NUMBER_DOUBLE_REQUIRED,
	NUMBER_REQUIRED,
	STRING_NULLABLE,
	STRING_OPTIONAL,
	STRING_REQUIRED,
} from '@/utils/validators';

//* Salary Schema
export const SALARY_SCHEMA = z.object({
	employee_uuid: STRING_REQUIRED,
	type: z.enum(['partial', 'full']),
	amount: NUMBER_DOUBLE_REQUIRED,
	year_month: STRING_REQUIRED,
	// loan_amount: NUMBER_DOUBLE_OPTIONAL,
	// advance_amount: NUMBER_DOUBLE_OPTIONAL,
});

export const SALARY_NULL: Partial<ISalary> = {
	employee_uuid: '',
	type: 'full',
	amount: 0,
	// loan_amount: 0,
	// advance_amount: 0,
};

export type ISalary = z.infer<typeof SALARY_SCHEMA>;
//* Salary Schema
export const MONTHLY_SALARY_SCHEMA = z.object({
	employee_uuid: STRING_OPTIONAL,
	type: z.enum(['partial', 'full']),
	amount: NUMBER_DOUBLE_REQUIRED,
	year_month: STRING_OPTIONAL,
	// loan_amount: NUMBER_DOUBLE_OPTIONAL,
	// advance_amount: NUMBER_DOUBLE_OPTIONAL,
});

export const MONTHLY_SALARY_NULL: Partial<IMonthlySalary> = {
	employee_uuid: '',
	type: 'partial',
	amount: 0,
	// loan_amount: 0,
	// advance_amount: 0,
};
export type IMonthlySalary = z.infer<typeof MONTHLY_SALARY_SCHEMA>;

export const MONTHLY_BULK_SALARY_SCHEMA = z.object({
	salary: z.array(
		z.object({
			employee_uuid: STRING_OPTIONAL,
			type: z.enum(['partial', 'full']),
			amount: NUMBER_DOUBLE_REQUIRED,
			month: NUMBER_REQUIRED,
			year: NUMBER_REQUIRED,
		})
	),
});
export const MONTHLY_BULK_SALARY_NULL: Partial<IMonthlyBulkSalary> = {
	salary: [],
};
export type IMonthlyBulkSalary = z.infer<typeof MONTHLY_BULK_SALARY_SCHEMA>;

//* Salary Increment Schema
export const SALARY_INCREMENT_SCHEMA = z.object({
	employee_uuid: STRING_REQUIRED,
	amount: NUMBER_DOUBLE_REQUIRED,
	effective_date: STRING_REQUIRED,
});

export const SALARY_INCREMENT_NULL: Partial<ISalaryIncrement> = {
	employee_uuid: '',
	amount: 0,
	effective_date: '',
};

export type ISalaryIncrement = z.infer<typeof SALARY_INCREMENT_SCHEMA>;

//* Loan
export const LOAN_SCHEMA = z.object({
	employee_uuid: STRING_REQUIRED,
	amount: NUMBER_DOUBLE_REQUIRED,
	type: z.enum(['salary_advance', 'other']),
	date: STRING_REQUIRED,
	remarks: STRING_NULLABLE,
	loan_entry: z.array(
		z.object({
			uuid: STRING_OPTIONAL,
			loan_uuid: STRING_OPTIONAL,
			type: z.enum(['partial', 'full']),
			amount: NUMBER_DOUBLE_REQUIRED,
			date: STRING_REQUIRED,
			remarks: STRING_NULLABLE,
		})
	),
});

export const LOAN_NULL: Partial<ILoan> = {
	employee_uuid: '',
	amount: 0,
	type: 'salary_advance',
	date: '',
	remarks: '',
	loan_entry: [],
};

export type ILoan = z.infer<typeof LOAN_SCHEMA>;
