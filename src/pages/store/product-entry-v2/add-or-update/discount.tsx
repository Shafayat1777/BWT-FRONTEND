import React from 'react';

import { FormField } from '@/components/ui/form';
import CoreForm from '@core/form';

import { discountUnits } from './utils';

const Discount: React.FC<{ form: any; index: number }> = ({ form, index }) => {
	console.log(index);

	return (
		<div className='flex gap-2'>
			<FormField
				control={form.control}
				name={`product_variant.${index}.discount`}
				render={(props) => (
					<CoreForm.Input
						type='number'
						label='Discount'
						disableLabel
						disabled={form?.watch('is_order_exist') && form.watch(`product_variant.${index}.uuid`)}
						{...props}
					/>
				)}
			/>
			<FormField
				control={form.control}
				name={`product_variant.${index}.discount_unit`}
				render={(props) => (
					<CoreForm.ReactSelect
						options={discountUnits}
						menuPortalTarget={document.body}
						label='Unit'
						disableLabel
						disabled={form?.watch('is_order_exist') && form.watch(`product_variant.${index}.uuid`)}
						{...props}
					/>
				)}
			/>
		</div>
	);
};

export default Discount;
