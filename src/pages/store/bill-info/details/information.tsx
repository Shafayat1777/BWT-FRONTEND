import React from 'react';

import SectionContainer from '@/components/others/section-container';
import TableList, { ITableListItems } from '@/components/others/table-list';
import ReactSelect from '@/components/ui/react-select';
import { Switch } from '@/components/ui/switch';

import { useOtherUser } from '@/lib/common-queries/other';
import { getDateTime } from '@/utils';
import { formatDateTable } from '@/utils/formatDate';

import { IBillInfo } from '../../_config/columns/columns.type'; // TODO: update data type
import { order_status } from '../utills';

const Information: React.FC<{ data: IBillInfo; updateData: any }> = ({ data, updateData }) => {
	const renderItems = (): ITableListItems => {
		return [
			{
				label: 'Name',
				value: data.name,
			},
			{ label: 'Phone', value: data.phone },
			{ label: 'Email', value: data.email },
			{ label: 'Address', value: data.address },
			{ label: 'District', value: data.district },
			{ label: 'City', value: data.city },
			{ label: 'Payment Method', value: data.payment_method },
			{ label: 'Note', value: data.note },
		];
	};
	const renderItems3 = (): ITableListItems => {
		return [
			{
				label: 'Name',
				value: data?.ship_address?.name,
			},
			{ label: 'Phone', value: data?.ship_address?.phone },
			{ label: 'Address', value: data?.ship_address?.address },
			{ label: 'District', value: data?.ship_address?.district },
			{ label: 'City', value: data?.ship_address?.city },
			{ label: 'Zip', value: data?.ship_address?.zip },
			{ label: 'Note', value: data?.ship_address?.note },
		];
	};
	const renderItems2 = (): ITableListItems => {
		return [
			{
				label: 'Status',
				value: (
					<ReactSelect
						value={order_status?.find((item) => item.value === data?.bill_status)}
						options={order_status}
						menuPortalTarget={document.body}
						styles={{
							menuPortal: (base) => ({ ...base, zIndex: 999 }),
						}}
						isClearable={false}
						onChange={(value: any) => handleStatus(data, value.value as number)}
					/>
				),
			},
			{
				label: 'Paid',
				value: <Switch checked={data?.is_paid as boolean} onCheckedChange={() => handlePaid(data)} />,
			},
			{
				label: 'Created At',
				value: formatDateTable(data.created_at),
			},
			{
				label: 'Updated At',
				value: formatDateTable(data.updated_at),
			},
			{ label: 'Remarks', value: data.remarks },
		];
	};

	const handleStatus = async (data: IBillInfo, value: number) => {
		const bill_status = value;
		const updated_at = getDateTime();

		await updateData.mutateAsync({
			url: `/store/bill-info/${data?.uuid}`,
			updatedData: { bill_status, updated_at },
		});
	};
	const handlePaid = async (data: IBillInfo) => {
		const updated_at = getDateTime();
		const is_paid = !data?.is_paid;

		await updateData.mutateAsync({
			url: `/store/bill-info/${data?.uuid}`,
			updatedData: { is_paid, updated_at },
		});
	};

	return (
		<SectionContainer title={'Information'}>
			<div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
				<TableList title='Customer' items={renderItems()} />
				{data?.ship_address ? (
					<TableList title='Shipping Address' items={renderItems3()} />
				) : (
					'Same as Customer'
				)}
				<TableList title='Other' items={renderItems2()} />
			</div>
		</SectionContainer>
	);
};

export default Information;
