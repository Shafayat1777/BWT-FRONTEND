import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { FormField } from '@/components/ui/form';
import CoreForm from '@core/form';
import { IFormSelectOption } from '@core/form/types';

import { useOtherUser } from '@/lib/common-queries/other';

import { IBillInfo } from '../../_config/schema';
import ShipAddress from './ship-address';

const Header = () => {
	const form = useFormContext<IBillInfo>();
	const isShipDifferent = useWatch({
		control: form.control,
		name: 'is_ship_different',
		defaultValue: false,
	});

	useEffect(() => {
		if (!isShipDifferent) {
			const shipAddressFields = [
				'ship_address.name',
				'ship_address.phone',
				'ship_address.company_name',
				'ship_address.note',
				'ship_address.address',
				'ship_address.city',
				'ship_address.district',
				'ship_address.zip',
			];

			shipAddressFields.forEach((fieldName) => {
				form.setValue(fieldName as any, '');
			});
		}
	}, [isShipDifferent, form]);

	return (
		<CoreForm.Section
			title='Customer Information'
			extraHeader={
				<div className='flex gap-2 text-white'>
					<FormField
						control={form.control}
						name='bill_status'
						render={(props) => (
							<CoreForm.ReactSelect
								options={[
									{ label: 'Pending', value: 'pending' },
									{ label: 'Completed', value: 'completed' },
									{ label: 'Cancel', value: 'cancel' },
								]}
								placeholder='Select Order Status'
								label='Status'
								{...props}
							/>
						)}
					/>

					<FormField
						control={form.control}
						name='is_ship_different'
						render={(props) => <CoreForm.Switch label='Ship Address' {...props} />}
					/>

					<FormField
						control={form.control}
						name='is_paid'
						render={(props) => <CoreForm.Switch label='Paid' {...props} />}
					/>
				</div>
			}
			className='flex-1 sm:grid-cols-1 lg:grid-cols-2'
		>
			<div className='flex flex-col gap-4'>
				<FormField control={form.control} name='name' render={(props) => <CoreForm.Input {...props} />} />
				<FormField
					control={form.control}
					name='phone'
					render={(props) => <CoreForm.Phone disabled={true} {...props} />}
				/>
				<FormField
					control={form.control}
					name='email'
					render={(props) => <CoreForm.Input disabled {...props} />}
				/>
				<FormField control={form.control} name='address' render={(props) => <CoreForm.Textarea {...props} />} />
				<div className='flex gap-2'>
					<FormField control={form.control} name='city' render={(props) => <CoreForm.Input {...props} />} />
					<FormField
						control={form.control}
						name='district'
						render={(props) => <CoreForm.Input {...props} />}
					/>
				</div>
			</div>
			<ShipAddress isShipDifferent={isShipDifferent} />

			<div className='flex gap-2'>
				<FormField
					control={form.control}
					name='payment_method'
					render={(props) => (
						<CoreForm.ReactSelect
							menuPortalTarget={document.body}
							label='Payment Method'
							placeholder='Select Payment Method'
							options={[
								{ value: 'cod', label: 'COD' },
								{ value: 'bkash', label: 'Bkash' },
							]}
							{...props}
						/>
					)}
				/>
				<FormField control={form.control} name='note' render={(props) => <CoreForm.Textarea {...props} />} />
			</div>

			<FormField control={form.control} name='remarks' render={(props) => <CoreForm.Textarea {...props} />} />
		</CoreForm.Section>
	);
};

export default Header;
