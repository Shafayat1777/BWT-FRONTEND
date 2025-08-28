export interface ISalaryTableData {
	uuid: string;
	employee_uuid: string;
	employee_name: string;
	type: string;
	amount: number;
	year: number;
	month: number;
	year_month: string;
	created_by: string;
	created_by_name: string;
	created_at: string;
	updated_at: string;
	remarks: string;
}

export interface ISalaryIncrementTableData {
	uuid: string;
	employee_uuid: string;
	employee_name: string;
	amount: number;
	effective_date: string;

	created_by: string;
	created_by_name: string;
	created_at: string;
	updated_at: string;
	remarks: string;
}

export interface IMonthlyDetailsTableData {
	salary_uuid: string;
	employee_uuid: string;
	employee_name: string;
	type: string;
	amount: number;
	month: number;
	year: number;
	total_general_holidays: number;
	total_special_holidays: number;
	total_incremented_salary: number;
	present_days: number;
	week_days: number;
	absent_days: number;
	late_days: number;
	total_leave_days: number;
	total_salary: number;
	daily_salary: number;
	gross_salary: number;
	total_days: number;
	joining_date: string;
	net_payable: number;
	total_loan_amount: number;
	total_paid_loan_amount: number;

	created_by: string;
	created_by_name: string;
	created_at: string;
	updated_at: string;
	remarks: string | null;
}
export interface ILoanTableData {
	uuid: string;
	employee_uuid: string;
	employee_name: string;
	amount: number;
	date: string;

	created_by: string;
	created_by_name: string;
	created_at: string;
	updated_at: string;
	remarks: string;
}
