import { useFormContext } from 'react-hook-form';

import { FormField } from '@/components/ui/form';
import CoreForm from '@core/form';
import { IFormSelectOption } from '@core/form/types';

import { useOtherEmployees } from '@/lib/common-queries/other';

import { ILoan } from '../../_config/schema';

const Header = () => {
	const form = useFormContext<ILoan>();

	const { data: employeeOptions } = useOtherEmployees<IFormSelectOption[]>();
	const loanType = [
		{ label: 'Salary Advance', value: 'salary_advance' },
		{ label: 'Other', value: 'other' },
	];

	return (
		<CoreForm.Section title={`Information`}>
			<FormField
				control={form.control}
				name='employee_uuid'
				render={(props) => (
					<CoreForm.ReactSelect
						menuPortalTarget={document.body}
						label='Employee'
						placeholder='Select Employee'
						options={employeeOptions!}
						{...props}
					/>
				)}
			/>
			<FormField
				control={form.control}
				name='type'
				render={(props) => (
					<CoreForm.ReactSelect
						label='Loan Type'
						placeholder='Select Loan Type'
						menuPortalTarget={document.body}
						options={loanType!}
						{...props}
					/>
				)}
			/>
			<FormField control={form.control} name='date' render={(props) => <CoreForm.DatePicker {...props} />} />
			<FormField
				control={form.control}
				name='amount'
				
				render={(props) => <CoreForm.Input type='number' {...props} />}
			/>
			<FormField control={form.control} name='remarks' render={(props) => <CoreForm.Textarea {...props} />} />
		</CoreForm.Section>
	);
};

export default Header;
