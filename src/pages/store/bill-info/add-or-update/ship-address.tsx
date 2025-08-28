import { useFormContext } from 'react-hook-form';

import { FormField } from '@/components/ui/form';
import CoreForm from '@core/form';

import { IBillInfo } from '../../_config/schema';

interface ShipAddressProps {
	isShipDifferent: boolean;
}

const ShipAddress: React.FC<ShipAddressProps> = ({ isShipDifferent }) => {
	const form = useFormContext<IBillInfo>();

	return (
		<div className='flex flex-col gap-2'>
			<h1 className='font-semibold'>Shipping Address</h1>
			<div
				className={`flex flex-col gap-2 rounded-md border p-4 transition-colors ${
					!isShipDifferent ? 'bg-gray-100 opacity-60' : 'bg-white'
				}`}
			>
				<FormField
					control={form.control}
					name='ship_address.name'
					render={(props) => (
						<CoreForm.Input
							label='Name'
							placeholder='Enter shipping name'
							disabled={!isShipDifferent}
							{...props}
						/>
					)}
				/>

				<FormField
					control={form.control}
					name='ship_address.phone'
					render={(props) => (
						<CoreForm.Phone
							label='Phone'
							placeholder='Enter shipping phone'
							disabled={!isShipDifferent}
							{...props}
						/>
					)}
				/>

				<FormField
					control={form.control}
					name='ship_address.company_name'
					render={(props) => (
						<CoreForm.Input
							label='Company Name'
							placeholder='Enter company name'
							disabled={!isShipDifferent}
							{...props}
						/>
					)}
				/>

				<div className='flex gap-2'>
					<FormField
						control={form.control}
						name='ship_address.note'
						render={(props) => (
							<CoreForm.Textarea
								label='Note'
								placeholder='Shipping notes'
								disabled={!isShipDifferent}
								{...props}
							/>
						)}
					/>

					<FormField
						control={form.control}
						name='ship_address.address'
						render={(props) => (
							<CoreForm.Textarea
								label='Address'
								placeholder='Full shipping address'
								disabled={!isShipDifferent}
								{...props}
							/>
						)}
					/>
				</div>

				<div className='flex gap-2'>
					<FormField
						control={form.control}
						name='ship_address.city'
						render={(props) => (
							<CoreForm.Input label='City' placeholder='City' disabled={!isShipDifferent} {...props} />
						)}
					/>

					<FormField
						control={form.control}
						name='ship_address.district'
						render={(props) => (
							<CoreForm.Input
								label='District'
								placeholder='District'
								disabled={!isShipDifferent}
								{...props}
							/>
						)}
					/>

					<FormField
						control={form.control}
						name='ship_address.zip'
						render={(props) => (
							<CoreForm.Input
								label='ZIP Code'
								placeholder='ZIP/Postal code'
								disabled={!isShipDifferent}
								{...props}
							/>
						)}
					/>
				</div>
			</div>
		</div>
	);
};

export default ShipAddress;
