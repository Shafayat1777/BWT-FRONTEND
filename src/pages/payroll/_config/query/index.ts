import useTQuery from '@/hooks/useTQuery';

import { payrollQK } from './queryKeys';

// * Salary
export const usePayrollSalary = <T>(query?: string) =>
	useTQuery<T>({
		queryKey: payrollQK.salary(query),
		url: query ? `/hr/salary-entry?${query}` : '/hr/salary-entry',
	});

export const usePayrollSalaryByUUID = <T>(uuid: string) =>
	useTQuery<T>({
		queryKey: payrollQK.salaryByUUID(uuid),
		url: `/hr/salary-entry/${uuid}`,
		enabled: !!uuid,
	});

// * Salary Increment
export const usePayrollSalaryIncrement = <T>(query?: string) =>
	useTQuery<T>({
		queryKey: payrollQK.salaryIncrement(query),
		url: query ? `/hr/salary-increment?${query}` : '/hr/salary-increment',
	});

export const usePayrollSalaryIncrementByUUID = <T>(uuid: string) =>
	useTQuery<T>({
		queryKey: payrollQK.salaryIncrementByUUID(uuid),
		url: `/hr/salary-increment/${uuid}`,
		enabled: !!uuid,
	});

// * Monthly Details
export const usePayrollMonthlyDetails = <T>(year: number, month: number, query?: string) =>
	useTQuery<T>({
		queryKey: payrollQK.monthlyDetails(year, month, query),
		url: query
			? `/hr/employee-salary-details/by/year-month/${year}/${month}?${query}`
			: `/hr/employee-salary-details/by/year-month/${year}/${month}`,
		enabled: !!year && !!month,
	});

export const usePayrollMonthlyDetailsByUUID = <T>(uuid: string, year: number, month: number) =>
	useTQuery<T>({
		queryKey: payrollQK.monthlyDetailsByUUID(uuid, year, month),
		url: `/hr/employee-salary-details/${uuid}/${year}/${month}`,
		enabled: !!uuid && !!year && !!month,
	});
//* Loan
export const usePayrollLoan = <T>(query?: string) =>
	useTQuery<T>({
		queryKey: payrollQK.loan(query),
		url: query ? `/hr/loan?${query}` : '/hr/loan',
	});

export const usePayrollLoanByUUID = <T>(uuid: string) =>
	useTQuery<T>({
		queryKey: payrollQK.loanByUUID(uuid),
		url: `/hr/loan-entry-details/by/${uuid}`,
		enabled: !!uuid,
	});
