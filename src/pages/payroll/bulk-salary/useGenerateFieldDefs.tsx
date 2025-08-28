import { UseFormWatch } from 'react-hook-form';

import FieldActionButton from '@/components/buttons/field-action';
import DateTime from '@/components/ui/date-time';
import { FormField } from '@/components/ui/form';
import CoreForm from '@core/form';
import { FieldDef } from '@core/form/form-dynamic-fields/types';
import { IFormSelectOption } from '@core/form/types';

import {
	useOtherBox,
	useOtherFloor,
	useOtherProduct,
	useOtherRack,
	useOtherWarehouse,
	useOtherWarehouseByQuery,
} from '@/lib/common-queries/other';

import { IMonthlyBulkSalary } from '../_config/schema';

interface IGenerateFieldDefsProps {
	remove: (index: any) => void;
	watch?: UseFormWatch<IMonthlyBulkSalary>;
	form: any;
}

const useGenerateFieldDefs = ({ remove, watch, form }: IGenerateFieldDefsProps): FieldDef[] => {
	return [
		{
			header: 'Employee',
			accessorKey: 'employee_name',
			type: 'readOnly',
		},
		{
			header: 'Joining Date',
			accessorKey: 'joining_date',
			type: 'custom',
			component: (index: number) => {
				return <DateTime date={form.watch(`salary.${index}.joining_date`) as Date} isTime={false} />;
			},
		},
		{
			header: 'Joining Amount',
			accessorKey: 'joining_amount',
			type: 'readOnly',
		},
		{
			header: 'Salary',
			accessorKey: 'total_salary',
			type: 'readOnly',
		},
		{
			header: 'Present Days',
			accessorKey: 'present_days',
			type: 'readOnly',
		},
		{
			header: 'Late Days',
			accessorKey: 'late_days',
			type: 'readOnly',
		},
		{
			header: 'Week Days',
			accessorKey: 'week_days',
			type: 'readOnly',
		},
		{
			header: 'Absent Days',
			accessorKey: 'absent_days',
			type: 'readOnly',
		},
		{
			header: 'Holidays',
			accessorKey: 'total_holidays',
			type: 'readOnly',
		},

		{
			header: 'Total Days',
			accessorKey: 'total_days',
			type: 'readOnly',
		},
		{
			header: 'Gross Salary',
			accessorKey: 'gross_salary',
			type: 'readOnly',
		},
		{
			header: 'Advance Salary',
			accessorKey: 'total_advance_salary',
			type: 'readOnly',
		},
		{
			header: 'Others Deduction',
			accessorKey: 'others_deduction',
			type: 'readOnly',
		},
		{
			header: 'Net Payable',
			accessorKey: 'net_payable',
			type: 'readOnly',
		},
		{
			header: 'Loan Amount',
			accessorKey: 'loan_amount',
			type: 'readOnly',
		},
		{
			header: 'Month',
			accessorKey: 'month',
			type: 'readOnly',
		},
		{
			header: 'Year',
			accessorKey: 'year',
			type: 'readOnly',
		},
		{
			header: 'Type',
			accessorKey: 'type',
			type: 'select',
			placeholder: 'Select Type',
			options: [
				{ label: 'Partial', value: 'partial' },
				{ label: 'Full', value: 'full' },
			],
		},
		{
			header: 'Amount',
			accessorKey: 'amount',
			type: 'number',
		},
		{
			header: 'Actions',
			accessorKey: 'actions',
			type: 'custom',
			component: (index: number) => {
				return <FieldActionButton handleRemove={remove} index={index} />;
			},
		},
	];
};

export default useGenerateFieldDefs;
