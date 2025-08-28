import { ColumnDef, Row } from '@tanstack/react-table';
import { format, getYear } from 'date-fns';
import { ArrowRightCircle } from 'lucide-react';

import DateTime from '@/components/ui/date-time';

import { ILoanTableData, IMonthlyDetailsTableData, ISalaryIncrementTableData, ISalaryTableData } from './columns.type';

//* Salary Columns
export const salaryColumns = (): ColumnDef<ISalaryTableData>[] => [
	{
		accessorKey: 'employee_name',
		header: 'Employee',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'type',
		header: 'Type',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'amount',
		header: 'Amount',
		enableColumnFilter: false,
	},
	{
		accessorFn: (row) => {
			const date = row.year_month;
			const month = format(date, 'MMM');
			const year = getYear(date);
			return `${month}, ${year}`;
		},
		header: 'Salary Month',
		enableColumnFilter: false,
	},
];

//* Salary Increment Columns
export const salaryIncrementColumns = (): ColumnDef<ISalaryIncrementTableData>[] => [
	{
		accessorKey: 'employee_name',
		header: 'Employee',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'amount',
		header: 'Amount',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'effective_date',
		header: 'Effective Date',
		enableColumnFilter: false,
		cell: (info) => <DateTime date={info.getValue() as Date} isTime={false} />,
	},
];

//* Monthly details
export const monthlyDetailsColumns = ({
	handleRedirect,
	handlePayment,
}: {
	handleRedirect: (row: IMonthlyDetailsTableData) => void;
	handlePayment: (row: Row<IMonthlyDetailsTableData>) => void;
}): ColumnDef<IMonthlyDetailsTableData>[] => [
	{
		accessorKey: 'employee_name',
		header: 'Employee',
		enableColumnFilter: false,
		cell: (info) => {
			const { employee_uuid } = info.row.original;
			return (
				// <CustomLink
				// 	url={`/payroll/monthly-employee-details/${employee_uuid}`}
				// 	label={info.getValue() as string}
				// 	openInNewTab={true}
				// />
				<span className='cursor-pointer underline' onClick={() => handleRedirect(info.row.original)}>
					{info.getValue() as string}
				</span>
			);
		},
	},
	{
		accessorKey: 'joining_date',
		header: 'Joining Date',
		enableColumnFilter: false,
		cell: (info) => <DateTime date={info.getValue() as Date} isTime={false} />,
	},
	{
		accessorKey: 'total_salary',
		header: 'Salary',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'present_days',
		header: 'Present Days',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'late_days',
		header: 'Late Days',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'week_days',
		header: 'Week Days',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'absent_days',
		header: 'Absent Days',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'total_leave_days',
		header: 'Leave Days',
		enableColumnFilter: false,
	},
	{
		accessorFn: (row) => row.total_general_holidays + row.total_special_holidays,
		header: 'Holidays Days',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'total_days',
		header: 'Total Days',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'gross_salary',
		header: 'Gross Salary',
		enableColumnFilter: false,
		cell: (info) => (info.getValue() as number).toFixed(2),
	},
	{
		accessorKey: 'total_advance_salary',
		header: 'Salary Advance',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'others_deduction',
		header: 'Others Deduction',
		enableColumnFilter: false,
	},
	{
		accessorFn: (row) => Math.ceil(row.net_payable),
		header: 'Net Payable',
		enableColumnFilter: false,
	},
	{
		accessorFn: (row) => row.total_loan_amount - row.total_paid_loan_amount,
		header: 'Loan Amount',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'payment',
		header: 'Pay',
		size: 40,
		enableColumnFilter: false,
		enableSorting: false,
		enableGlobalFilter: false,
		cell: (info) => (
			<button
				className='flex items-center justify-center rounded-lg bg-transparent p-2 text-xs text-white hover:bg-secondary-foreground'
				onClick={() => handlePayment(info.row)}
			>
				<ArrowRightCircle size={24} absoluteStrokeWidth={true} className='text-primary' />
			</button>
		),
	},
];

//* Loan
export const loanColumns = (): ColumnDef<ILoanTableData>[] => [
	{
		accessorKey: 'employee_name',
		header: 'Employee',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'type',
		header: 'Type',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'amount',
		header: 'Amount',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'date',
		header: 'Date',
		enableColumnFilter: false,
		cell: (info) => <DateTime date={info.getValue() as Date} isTime={false} />,
	},
];
