
import useRHF from '@/hooks/useRHF';

import { FormField } from '@/components/ui/form';
import CoreForm from '@core/form';
import { AddModal } from '@core/modal';

import { getDateTime } from '@/utils';

import { IResetPasswordSchema, RESET_PASSWORD_NULL, RESET_PASSWORD_SCHEMA } from '../_config/schema';
import { IResetPasswordProps } from '../_config/types';

const ResetPassword: React.FC<IResetPasswordProps> = ({
	url,
	open,
	setOpen,
	updatedData,
	setUpdatedData,
	updateData,
}) => {
	const form = useRHF(RESET_PASSWORD_SCHEMA, RESET_PASSWORD_NULL);

	const onClose = () => {
		setUpdatedData?.(null);
		form.reset(RESET_PASSWORD_NULL);
		setOpen((prev) => !prev);
	};

	// Submit handler
	async function onSubmit(values: IResetPasswordSchema) {
		await updateData.mutateAsync({
			url:`/hr/user/password/${updatedData?.uuid}?is_reset=true`,
			updatedData: {
				...values,
				updated_at: getDateTime(),
			},
			onClose,
		});
	}

	return (
		<AddModal
			open={open}
			setOpen={onClose}
			title={`Reset Password - ${updatedData?.name}`}
			form={form}
			onSubmit={onSubmit}
		>
			<FormField
				control={form.control}
				name='pass'
				render={(props) => <CoreForm.Input label='Password' type='password' {...props} />}
			/>

			<FormField
				control={form.control}
				name='repeatPass'
				render={(props) => <CoreForm.Input label={`Repeat Password`} type={'password'} {...props} />}
			/>
		</AddModal>
	);
};

export default ResetPassword;
