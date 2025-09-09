import { useFormContext } from 'react-hook-form';

import { FormField } from '@/components/ui/form';
import CoreForm from '@core/form';

import { IInfo } from './_config/schema';
import { platformTypeOptions, repairOptions } from './utils';

const Header = () => {
	const form = useFormContext<IInfo>();

	return (
		<CoreForm.Section title='Customer Information' className='sm:grid-cols-1 lg:grid-cols-2'>
			<FormField
				control={form.control}
				name='name'
				render={(props) => <CoreForm.Input label='Customer Name' {...props} />}
			/>
			<FormField
				control={form.control}
				name='phone'
				render={(props) => <CoreForm.Phone label='Phone Number' {...props} />}
			/>

			<FormField
				control={form.control}
				name='where_they_find_us'
				render={(props) => (
					<CoreForm.ReactSelect
						menuPortalTarget={document.body}
						label='Where They Find Us'
						options={platformTypeOptions || []}
						placeholder='Select Platform'
						{...props}
					/>
				)}
			/>
			<FormField
				control={form.control}
				name='service_type'
				render={(props) => (
					<CoreForm.ReactSelect
						menuPortalTarget={document.body}
						label='Service Type'
						options={repairOptions || []}
						placeholder='Select Service'
						{...props}
					/>
				)}
			/>

			<FormField control={form.control} name='location' render={(props) => <CoreForm.Input {...props} />} />
			{/* <div className='lg:col-span-2'>
				<FormField control={form.control} name='remarks' render={(props) => <CoreForm.Textarea {...props} />} />
			</div> */}
		</CoreForm.Section>
	);
};

export default Header;
