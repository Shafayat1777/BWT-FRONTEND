export const payrollQK = {
	all: () => ['payroll'],

	//* salary
	salary: (query?: string) => [...payrollQK.all(), 'salary', query],
	salaryByUUID: (uuid: string) => [...payrollQK.salary(), uuid],

	//* salary increment
	salaryIncrement: (query?: string) => [...payrollQK.all(), 'salary-increment', query],
	salaryIncrementByUUID: (uuid: string) => [...payrollQK.salaryIncrement(), uuid],

	// * monthly details
	monthlyDetails: (year: number, month: number, query?: string) => [
		...payrollQK.all(),
		'monthly-details',
		year,
		month,
		query,
	],
	monthlyDetailsByUUID: (uuid: string, year: number, month: number) => [
		...payrollQK.all(),
		'monthly-employee-details',
		uuid,
		year,
		month,
	],
	loan: (query?: string) => [...payrollQK.all(), 'loan', query],
	loanByUUID: (uuid: string) => [...payrollQK.loan(), uuid],
};
