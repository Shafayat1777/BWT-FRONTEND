import React from 'react';
import { Printer } from 'lucide-react';
import useAuth from '@/hooks/useAuth';

import StatusButton from '@/components/buttons/status';
import { CustomLink } from '@/components/others/link';
import SectionContainer from '@/components/others/section-container';
import TableList, { ITableListItems } from '@/components/others/table-list';

import { formatDateTable } from '@/utils/formatDate';

import { IInfoTableData } from '../../_config/columns/columns.type';
import { default as ChallanPdf, default as OrderSticker } from '../../../../components/pdf/order-sticker';
import { Button, ButtonProps } from '../../../../components/ui/button';

const Information: React.FC<{ data: IInfoTableData }> = ({ data }) => {
	const fullURL = window.location.href;
	const slice = fullURL.split('w');
	const baseURl = slice[0];
	const { user } = useAuth();
	const handlePrint = async () => {
		if (data) {
			await ChallanPdf(data, user, baseURl);
		}
	};
	const renderGeneralItems = (): ITableListItems => {
		return [
			{
				label: 'Info ID',
				value: data.info_id,
			},
			{ label: 'User', value: data.user_name + ' (' + data.user_id + ')' },
			{
				label: 'Phone',
				value: data?.user_phone,
			},
			{
				label: 'Product',
				value: data.products?.map((item: any) => item.brand_name + ': ' + item.model_name).join(', '),
			},
			{
				label: 'Submitted By',
				value: data?.submitted_by,
			},
			{
				label: 'Branch',
				value: data?.branch_name,
			},
			{
				label: 'Order Type',
				value: data?.order_type,
			},
			{ label: 'Location', value: data.location + ' (' + data.zone_name + ')' },
			{ label: 'Reference User', value: data.reference_user_name },
			{
				label: 'Commission Amount',
				value: `${data.commission_amount} ${data.is_commission_amount ? 'BDT' : '%'}`,
			},

			{ label: 'Remarks', value: data.remarks },
		];
	};
	const renderOtherItems = (): ITableListItems => {
		return [
			{
				label: 'Received',
				value: <StatusButton value={data.is_product_received as boolean} />,
			},
			{
				label: 'Received By',
				value: data?.received_by_name,
			},
			{
				label: 'Receiving At',
				value: formatDateTable(data.received_date),
			},
			{
				label: 'Created At',
				value: formatDateTable(data.created_at),
			},
			{
				label: 'Updated At',
				value: formatDateTable(data.updated_at),
			},
			{
				label: 'Link',
				value: (
					<CustomLink
						url={`${baseURl}order/${data?.uuid}`}
						label={`${baseURl}order/${data?.uuid}`}
						name='Open'
						openInNewTab={true}
					/>
				),
			},
			{
				label: 'Sticker',

				value: (
					<Button
						className='size-8 rounded-full'
						size={'icon'}
						variant={'accent'}
						onClick={() => handlePrint()}
					>
						<Printer className='text-white' size={16} />
					</Button>
				),
			},
		];
	};

	return (
		<>
			<SectionContainer title={'Customer Information'}>
				<div className='flex w-full flex-col gap-y-4 md:flex-row md:gap-y-0 md:space-x-4'>
					<TableList title='General' className='w-full md:w-1/2' items={renderGeneralItems()} />
					<TableList title='Other' className='w-full md:w-1/2' items={renderOtherItems()} />
				</div>
			</SectionContainer>
		</>
	);
};

export default Information;
