import { useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { IFormSelectOption } from '@/components/core/form/types';
import { FormField } from '@/components/ui/form';
import CoreForm from '@core/form';

import {
	useOtherBranch,
	useOtherDepartment,
	useOtherDesignation,
	useOtherUser,
	useOtherUserByQuery,
	useOtherZone,
} from '@/lib/common-queries/other';

import { IInfoTableData } from '../../_config/columns/columns.type';
import { IInfo } from '../../_config/schema';
import { status } from '../utils';
import { businessTypeOptions, orderType, platformTypeOptions } from './utils';

export interface ICustomUserType extends IFormSelectOption {
	location: string;
	zone_uuid: string;
}

const Header = ({ isUpdate, data }: { isUpdate: boolean; data?: IInfo }) => {
	const form = useFormContext<IInfo>();

	const { data: userOption } = useOtherUserByQuery<ICustomUserType[]>('?type=customer');
	const { data: branchOptions } = useOtherBranch<IFormSelectOption[]>();
	const { data: userOptions } = useOtherUser<IFormSelectOption[]>();
	const isProductReceived = form.watch('is_product_received');
	const isNewCustomer = form.watch('is_new_customer');
	const isUser = form.watch('business_type') === 'user';
	const isBusinessTypeCompany =
		(form.watch('business_type') === 'tv_company' || form.watch('business_type') === 'corporate') && isNewCustomer;

	const { data: departmentOption } = useOtherDepartment<IFormSelectOption[]>();
	const { data: designationOption } = useOtherDesignation<IFormSelectOption[]>();
	const { data: zoneOption } = useOtherZone<IFormSelectOption[]>();

	useEffect(() => {
		if (isNewCustomer) {
			form.resetField('user_uuid');
		} else {
			form.resetField('name');
			form.resetField('phone');
			form.resetField('business_type');
			form.resetField('designation_uuid');
			form.resetField('department_uuid');
		}
	}, [isNewCustomer, form, isBusinessTypeCompany]);
	useEffect(() => {
		if (isUpdate) return;
		const zone_uuid = userOption?.find((item) => item.value === form.watch('user_uuid'))?.zone_uuid;
		const location = userOption?.find((item) => item.value === form.watch('user_uuid'))?.location;
		form.setValue('zone_uuid', zone_uuid || '');
		form.setValue('location', location || '');
	}, [form.watch('user_uuid'), isUpdate, userOption]);

	return (
		<CoreForm.Section
			title={
				<div className='flex justify-end gap-2'>
					<h1>Information</h1>
					<FormField
						control={form.control}
						name='is_new_customer'
						render={(props) => (
							<CoreForm.Checkbox label='New Customer' className='float-end bg-white' {...props} />
						)}
					/>
					<FormField
						control={form.control}
						name='is_product_received'
						render={(props) => (
							<CoreForm.Checkbox label='Product Received' className='float-end bg-white' {...props} />
						)}
					/>
					{isProductReceived && (
						<FormField
							control={form.control}
							name='received_date'
							render={(props) => <CoreForm.DatePicker disableLabel={true} {...props} />}
						/>
					)}
				</div>
			}
			className='lg:grid-cols-3'
		>
			<div className='flex flex-col gap-4'>
				{!isNewCustomer ? (
					<FormField
						control={form.control}
						name='user_uuid'
						render={(props) => (
							<CoreForm.ReactSelect
								menuPortalTarget={document.body}
								label='Customer'
								options={userOption || []}
								placeholder='Select Customer'
								{...props}
							/>
						)}
					/>
				) : (
					<div className='flex flex-col gap-4'>
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
							name='business_type'
							render={(props) => (
								<CoreForm.ReactSelect
									menuPortalTarget={document.body}
									label='Business Type'
									options={businessTypeOptions || []}
									placeholder='Select Business Type'
									{...props}
								/>
							)}
						/>

						{isUser && (
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
						)}
					</div>
				)}

				{isNewCustomer && !isUser && form.watch('business_type') !== undefined && (
					<>
						<FormField
							control={form.control}
							name='designation_uuid'
							render={(props) => (
								<CoreForm.ReactSelect
									menuPortalTarget={document.body}
									label='Designation'
									options={designationOption || []}
									placeholder='Select Designation'
									{...props}
								/>
							)}
						/>
						<FormField
							control={form.control}
							name='department_uuid'
							render={(props) => (
								<CoreForm.ReactSelect
									menuPortalTarget={document.body}
									label='Department'
									options={departmentOption || []}
									placeholder='Select Department'
									{...props}
								/>
							)}
						/>
					</>
				)}
			</div>

			<div className='flex flex-col gap-4'>
				{' '}
				<FormField
					control={form.control}
					name='branch_uuid'
					render={(props) => (
						<CoreForm.ReactSelect
							menuPortalTarget={document.body}
							label='Branch'
							options={branchOptions || []}
							placeholder='Select Branch'
							{...props}
						/>
					)}
				/>
				<FormField
					control={form.control}
					name='location'
					render={(props) => <CoreForm.Textarea {...props} />}
				/>
				<FormField
					control={form.control}
					name='zone_uuid'
					render={(props) => (
						<CoreForm.ReactSelect
							menuPortalTarget={document.body}
							label='Zone'
							options={zoneOption || []}
							placeholder='Select Zone'
							{...props}
						/>
					)}
				/>
				<FormField control={form.control} name='remarks' render={(props) => <CoreForm.Textarea {...props} />} />
			</div>

			<div className='flex flex-col gap-4'>
				<FormField
					control={form.control}
					name='order_type'
					render={(props) => (
						<CoreForm.ReactSelect
							menuPortalTarget={document.body}
							label='Order Type'
							options={orderType || []}
							placeholder='Select Order Type'
							{...props}
						/>
					)}
				/>
				<FormField
					control={form.control}
					name='reference_user_uuid'
					render={(props) => (
						<CoreForm.ReactSelect
							menuPortalTarget={document.body}
							label='Reference User'
							options={userOptions || []}
							placeholder='Select user'
							{...props}
						/>
					)}
				/>
				<FormField
					control={form.control}
					name='is_commission_amount'
					render={(props) => <CoreForm.Checkbox label='In BDT' {...props} />}
				/>
				<FormField
					control={form.control}
					name='commission_amount'
					render={(props) => (
						<CoreForm.JoinInputUnit
							unit={form.watch('is_commission_amount') ? 'BDT' : '%'}
							type='number'
							{...props}
						/>
					)}
				/>
				{data?.submitted_by === 'customer' && (
					<div className='flex flex-col gap-4'>
						<FormField
							control={form.control}
							name='is_contact_with_customer'
							render={(props) => <CoreForm.Checkbox label='Contact' {...props} />}
						/>
						<FormField
							control={form.control}
							name='order_info_status'
							render={(props) => <CoreForm.ReactSelect label='Status' options={status} {...props} />}
						/>
						<FormField
							control={form.control}
							name='customer_feedback'
							render={(props) => <CoreForm.Textarea label='Customer Feedback' {...props} />}
						/>
					</div>
				)}
			</div>
		</CoreForm.Section>
	);
};

export default Header;
