import useRHF from '@/hooks/useRHF';
import { Barcode } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import CoreForm from '@core/form';

import { getDateTime } from '@/utils';

import { useStoreOrdersSerial } from '../../_config/query';
import { ISerial, SERIAL_NULL, SERIAL_SCHEMA } from '../../_config/schema';
import { IPopSerial } from '../../_config/types';

const PopupSerial = ({ order_id, product_serial, invalidateQuery }: IPopSerial & { invalidateQuery?: any }) => {
	const { updateData } = useStoreOrdersSerial(false);

	const isUpdate = false;
	const form = useRHF(SERIAL_SCHEMA, SERIAL_NULL);

	useEffect(() => {
		if (product_serial) {
			form.setValue('product_serial', product_serial);
		}
	}, [product_serial]);

	async function onSubmit(values: ISerial) {
		updateData.mutateAsync({
			url: `/store/ordered/${order_id}`,
			updatedData: {
				...values,
				updated_at: getDateTime(),
			},
		});

		await invalidateQuery();
	}

	return (
		<div>
			<Popover>
				<PopoverTrigger asChild>
					<Button variant={'accent'} size={'icon'} className='size-7 rounded-full'>
						<Barcode className='size-4' />
					</Button>
				</PopoverTrigger>
				<PopoverContent>
					<CoreForm.AddEditWrapper
						title={isUpdate ? 'Edit Bill Info' : ' Add Bill Info'}
						form={form}
						onSubmit={onSubmit}
						disableDevTool
					>
						<FormField
							control={form.control}
							name='product_serial'
							render={(props) => <CoreForm.Input {...props} />}
						/>
					</CoreForm.AddEditWrapper>
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default PopupSerial;
