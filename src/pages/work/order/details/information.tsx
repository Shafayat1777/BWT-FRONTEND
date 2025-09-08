import React, { useRef } from 'react';
import useAccess from '@/hooks/useAccess';

import StatusButton from '@/components/buttons/status';
import SwitchStatus from '@/components/buttons/switch-or-satus';
import { CustomLink } from '@/components/others/link';
import SectionContainer from '@/components/others/section-container';
import TableList, { ITableListItems } from '@/components/others/table-list';
import { Badge } from '@/components/ui/badge';

import { getDateTime } from '@/utils';
import { formatDateTable } from '@/utils/formatDate';

import { IOrderTableData } from '../../_config/columns/columns.type';
import { OrderImages } from '../../_config/utils/component';

const ProblemComponent = ({ arr, statement }: { arr: string[]; statement: string }) => {
	return (
		<div className='flex flex-wrap items-start gap-1'>
			{arr?.map((item, index) => (
				<Badge className='uppercase' variant='outline' key={index}>
					{item?.replace(/_/g, ' ')}
				</Badge>
			)) ?? '--'}
			<span className='text-sm italic'>{statement}</span>
		</div>
	);
};

const Information: React.FC<{ data: IOrderTableData; updateData: any }> = ({ data, updateData }) => {
	const pageAccess = useAccess('work__order_details') as string[];
	const haveDeliveryAccess = pageAccess?.includes('click_transfer_delivery');
	const haveQCAccess = pageAccess?.includes('click_transfer_qc');
	const haveProceedToRepairAccess = pageAccess?.includes('click_proceed_to_repair');
	const haveDiagnosedNeedAccess = pageAccess?.includes('click_diagnosis_need');

	const renderGeneralItems = (): ITableListItems => {
		return [
			{
				label: 'ID',
				value: (
					<div>
						<span>{data?.order_id}</span>
						{data?.reclaimed_order_uuid && (
							<CustomLink
								url={`/work/info/details/${data?.info_uuid}/order/details/${data?.reclaimed_order_uuid}`}
								label={data?.reclaimed_order_id as string}
								openInNewTab={true}
							/>
						)}
					</div>
				),
			},
			{
				label: 'Info ID',
				value: (
					<CustomLink
						url={`/work/info/details/${data?.info_uuid}`}
						label={data?.info_id as string}
						openInNewTab={true}
					/>
				),
			},
			{ label: 'User ID', value: data.user_id },
			{ label: 'User', value: data.user_name },
			{
				label: 'Phone No',
				value: data?.user_phone,
			},
			{
				label: 'Created',
				value: formatDateTable(data.created_at),
			},
			{
				label: 'Updated',
				value: formatDateTable(data.updated_at),
			},
			{ label: 'Remarks', value: data.remarks },
		];
	};

	const renderProductItems = (): ITableListItems => {
		return [
			{ label: 'Brand', value: data.brand_name },
			{ label: 'Model', value: data.model_name },
			{
				label: 'Quantity',
				value: data.quantity,
			},
			{ label: 'Serial', value: data.serial_no },
			{
				label: 'Accessories',
				value: (
					<div className='flex flex-wrap gap-1'>
						{(data.accessories_name as string[])?.map((item, index) => (
							<span key={index} className='rounded-[10px] bg-accent px-2 py-1 capitalize text-white'>
								{item?.replace(/_/g, ' ')}
							</span>
						))}
					</div>
				),
			},
		];
	};

	const renderProblemItems = (): ITableListItems => {
		return [
			{
				label: 'Order',
				value: (
					<ProblemComponent arr={data.order_problems_name as string[]} statement={data.problem_statement} />
				),
			},
			{
				label: 'Diagnosis',
				value: (
					<div className='flex flex-col gap-1'>
						<ProblemComponent
							arr={data?.diagnosis?.diagnosis_problems_name as string[]}
							statement={data.diagnosis?.problem_statement}
						/>
						{formatDateTable(data.diagnosis?.status_update_date)}
					</div>
				),
			},
			{
				label: 'Customer Defined',
				value: (
					<ProblemComponent
						arr={[data.diagnosis?.customer_problem_statement]}
						statement={data.diagnosis?.customer_remarks}
					/>
				),
			},
			{
				label: 'Repair',
				value: (
					<ProblemComponent
						arr={data.repairing_problems_name as string[]}
						statement={data.repairing_problem_statement}
					/>
				),
			},
			{
				label: 'QC',
				value: (
					<ProblemComponent arr={data.qc_problems_name as string[]} statement={data.qc_problem_statement} />
				),
			},
			{
				label: 'Delivery',
				value: (
					<ProblemComponent
						arr={data.delivery_problems_name as string[]}
						statement={data.delivery_problem_statement}
					/>
				),
			},
			{
				label: 'Images',
				value: <OrderImages image_1={data?.image_1} image_2={data?.image_2} image_3={data?.image_3} />,
			},
		];
	};

	const renderStatusItems = (): ITableListItems => {
		return [
			{
				label: 'Reclaimed',
				value: (
					<div className='flex flex-col gap-2'>
						<StatusButton value={data.is_reclaimed as boolean} />
						{data?.new_order_uuid && (
							<CustomLink
								url={`/work/info/details/${data?.info_uuid}/order/details/${data?.new_order_uuid}`}
								label={data?.new_order_id as string}
								openInNewTab={true}
							/>
						)}
					</div>
				),
			},
			{
				label: 'Home Repair',
				value: <StatusButton value={data.is_home_repair as boolean} />,
			},
			{
				label: 'Challan Needed',
				value: <StatusButton value={data.is_challan_needed as boolean} />,
			},
			{
				label: 'Received',
				value: (
					<div className='flex gap-2'>
						<StatusButton value={data.is_product_received as boolean} />
						<span className='text-xs font-bold'>
							{data?.is_product_received ? formatDateTable(data?.received_date) : '-'}
						</span>
					</div>
				),
			},

			{
				label: 'Diagnosing Needed',
				value: (
					<div className='flex gap-1'>
						<SwitchStatus
							checked={data?.is_diagnosis_need}
							onCheckedChange={() => {
								handelDiagnosisStatusChange();
							}}
							disabled={
								!haveDiagnosedNeedAccess || data?.is_delivery_complete || data?.is_ready_for_delivery
							}
						/>
					</div>
				),
			},
			{ label: 'Engineer', value: data.engineer_name },
			{
				label: 'Proceed to Repair',
				value: (
					<SwitchStatus
						checked={data?.is_proceed_to_repair}
						onCheckedChange={() => {
							handelProceedToRepair();
						}}
						disabled={
							!haveProceedToRepairAccess ||
							data?.is_delivery_complete ||
							data?.is_transferred_for_qc ||
							data?.is_ready_for_delivery
						}
					/>
				),
			},

			{
				label: 'Transfer For QC',
				value: (
					<SwitchStatus
						checked={data?.is_transferred_for_qc}
						onCheckedChange={() => {
							handelQCStatusChange();
						}}
						disabled={!haveQCAccess || data?.is_delivery_complete || data?.is_ready_for_delivery}
					/>
				),
			},
			{
				label: 'Ready For Delivery',
				value: (
					<div className='flex gap-2'>
						<SwitchStatus
							checked={data?.is_ready_for_delivery}
							onCheckedChange={() => {
								handelDeliveryStatusChange();
							}}
							disabled={!haveDeliveryAccess || data?.is_delivery_complete}
						/>
						<span className='text-xs font-bold'>
							{data?.is_ready_for_delivery ? formatDateTable(data?.ready_for_delivery_date) : '-'}
						</span>
					</div>
				),
			},
			{
				label: 'Delivery Complete',
				value: <StatusButton value={data.is_delivery_complete as boolean} />,
			},
		];
	};

	const renderLocationItems = (): ITableListItems => {
		return [
			{
				label: 'Warehouse',
				value: data.warehouse_name,
			},
			{
				label: 'Rack',
				value: data.rack_name,
			},
			{
				label: 'Floor',
				value: data.floor_name,
			},
			{
				label: 'Box',
				value: data.box_name,
			},
		];
	};

	const renderBillItems = (): ITableListItems => {
		return [
			{
				label: 'Proposed Cost',
				value: data?.diagnosis?.proposed_cost,
			},
			{ label: 'Advance Pay', value: data.advance_pay },
			{ label: 'Bill Amount', value: data.bill_amount },
			{ label: 'Remaining', value: data.bill_amount - data.advance_pay },
		];
	};

	const handelDiagnosisStatusChange = async () => {
		const form = {
			is_diagnosis_need: !data?.is_diagnosis_need,
		};
		await updateData.mutateAsync({
			url: `/work/order-without-form/${data?.uuid}`,
			updatedData: form,
			isOnCloseNeeded: false,
		});
	};

	const handelProceedToRepair = async () => {
		const form = {
			is_proceed_to_repair: !data?.is_proceed_to_repair,
		};
		await updateData.mutateAsync({
			url: `/work/order-without-form/${data?.uuid}`,
			updatedData: form,
			isOnCloseNeeded: false,
		});
	};

	const handelQCStatusChange = async () => {
		const form = {
			is_transferred_for_qc: !data?.is_transferred_for_qc,
		};
		await updateData.mutateAsync({
			url: `/work/order-without-form/${data?.uuid}`,
			updatedData: form,
			isOnCloseNeeded: false,
		});
	};

	const handelDeliveryStatusChange = async () => {
		const form = {
			is_ready_for_delivery: !data?.is_ready_for_delivery,
			ready_for_delivery_date: data.is_ready_for_delivery ? null : getDateTime(),
		};
		await updateData.mutateAsync({
			url: `/work/order-without-form/${data?.uuid}`,
			updatedData: form,
			isOnCloseNeeded: false,
		});
	};

	return (
		<>
			<SectionContainer title={'Order Details'}>
				<div className='grid w-full grid-cols-4 gap-y-2 overflow-x-scroll md:flex-row md:gap-y-0 md:space-x-4'>
					<div className='flex flex-col'>
						<TableList title='General' className='w-full' items={renderGeneralItems()} />
					</div>
					<div className='flex flex-col'>
						<TableList title='Product' className='w-full' items={renderProductItems()} />
						<TableList title='Location' className='w-full' items={renderLocationItems()} />
					</div>
					<div className='flex flex-col gap-2'>
						<TableList title='Problem' className='w-full' items={renderProblemItems()} />
						<TableList title='Bill' className='w-full' items={renderBillItems()} />
					</div>
					<div className='flex flex-col'>
						<TableList title='Status' className='w-full' items={renderStatusItems()} />
					</div>
				</div>
			</SectionContainer>
		</>
	);
};

export default Information;
