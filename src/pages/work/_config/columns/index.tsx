import { ColumnDef, Row } from '@tanstack/react-table';
import { over } from 'lodash';



import StatusButton from '@/components/buttons/status';
import Transfer from '@/components/buttons/transfer';
import { CustomLink } from '@/components/others/link';
import { WhatsApp } from '@/components/others/what-app-button';
import DateTime from '@/components/ui/date-time';
import { Switch } from '@/components/ui/switch';



import { Address, Location, OderID, OrderImages, Problem, Product, TableForColumn, UserNamePhone } from '../utils/component';
import { LocationName, OrderID, ProductName } from '../utils/function';
import { IAccessoriesTableData, IDiagnosisTableData, IInfoTableData, IOrderTableData, IProblemsTableData, IProcessTableData, ISectionTableData, ITransferTableData, IZoneTableData } from './columns.type';


//* Problems Columns
export const problemsColumns = (): ColumnDef<IProblemsTableData>[] => [
	{
		accessorKey: 'name',
		header: 'Name',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'category',
		header: 'Category',
		enableColumnFilter: false,
	},
];
//* Info Columns
export const infoColumns = (
	handleStatus?: (row: Row<IInfoTableData>) => void,
	permissionStatus?: boolean,
	overriddenPermissionStatus?: boolean,
	handleWhatsApp?: (row: Row<IInfoTableData>) => void
): ColumnDef<IInfoTableData>[] => [
	{
		accessorKey: 'info_id',
		header: 'Info ID',
		enableColumnFilter: false,
		cell: (info) => {
			const { uuid } = info.row.original;
			return (
				<CustomLink url={`/work/info/details/${uuid}`} label={info.getValue() as string} openInNewTab={true} />
			);
		},
	},
	{
		accessorFn: (row) => row.user_name + ' - ' + row.user_phone,
		header: 'Customer',
		size: 200,
		enableColumnFilter: false,
		cell: (info) => {
			const { user_name, user_phone } = info.row.original;

			return (
				<div className='flex items-center gap-2'>
					<UserNamePhone user_name={user_name} phone={user_phone} />
				</div>
			);
		},
	},
	// {
	// 	accessorFn: (row) => row.zone_name + ' : ' + row.location,
	// 	header: 'Address',
	// 	enableColumnFilter: false,
	// 	cell: (info) => {
	// 		const { location, zone_name } = info.row.original;

	// 		return (
	// 			<div className='flex items-center gap-2'>
	// 				<Address location={location} zone_name={zone_name} />
	// 			</div>
	// 		);
	// 	},
	// 	size: 200,
	// },
	{
		accessorKey: 'branch_name',
		header: 'Branch',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'order_type',
		header: 'Order Type',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'is_product_received',
		size: 32,
		header: 'Product \nReceived',
		enableColumnFilter: false,
		cell: (info) => {
			return (
				<div>
					<StatusButton value={info.getValue() as boolean} />
					<DateTime date={info.row.original.received_date} isTime={false} />
					<span className='text-xs font-semibold'>{info.row.original.received_by_name}</span>
				</div>
			);
		},
	},
	{
		accessorKey: 'reference_user_name',
		header: 'Reference',
		enableColumnFilter: false,
		cell: (info) => {
			if (info.getValue() === null) return '-';
			return (
				<div className='flex flex-col gap-2'>
					<span>{info.getValue() as string}</span>
					<span>
						CO: {info.row.original.commission_amount}
						{info.row.original.is_commission_amount ? 'BDT' : '%'}
					</span>
				</div>
			);
		},
	},
	{
		accessorKey: 'is_whatsapp',
		header: 'WhatsApp',
		cell: (info) => {
			return <WhatsApp onClick={() => handleWhatsApp?.(info.row)} />;
		},
	},

	{
		accessorFn: (row) => row.delivered_count + '/' + row.order_count,
		header: 'Delivered',
		enableColumnFilter: false,
	},
	// {
	// 	accessorKey: 'user_phone',
	// 	header: 'Phone Number',
	// 	enableColumnFilter: false,
	// },

	{
		accessorKey: 'submitted_by',
		header: 'Submitted By',
		enableColumnFilter: false,
		cell: (info) => <span className='capitalize'>{info.getValue() as string}</span>,
	},
	{
		accessorKey: 'is_contact_with_customer',
		header: 'Contact with \nCustomer',
		size: 40,
		enableColumnFilter: false,
		cell: (info) => {
			const status = info.row.original.order_info_status;
			const bgColorClass =
				{
					accepted: 'bg-success',
					rejected: 'bg-red-500',
					cancel: 'bg-gray-500',
					pending: 'bg-warning',
				}[status?.toLowerCase()] || '';
			return (
				<div className='flex flex-col items-center gap-2'>
					<Switch
						checked={info.getValue() as boolean}
						onCheckedChange={() => handleStatus?.(info.row)}
						disabled={!overriddenPermissionStatus && (info.getValue() as boolean)}
					/>

					<span className={`flex-1 rounded px-2 py-1 text-xs capitalize text-white ${bgColorClass}`}>
						{status?.split('_').join(' ')}
					</span>
				</div>
			);
		},
		meta: {
			disableFullFilter: true,
		},
	},
	{
		accessorKey: 'customer_feedback',
		header: 'Feedback',
		enableColumnFilter: false,
	},
];
//* Order Columns
type IOrderColumns = {
	actionTrxAccess?: boolean;
	actionProceedToRepair?: boolean;
	handleAgainstTrx?: (row: Row<any>) => void;
	handleProceedToRepair?: (row: Row<any>) => void;
	actionDiagnosisNeed?: boolean;
	handelDiagnosisStatusChange?: (row: Row<any>) => void;
};
export const orderColumnsForDetails = ({
	actionTrxAccess,
	handleAgainstTrx,
}: IOrderColumns = {}): ColumnDef<IOrderTableData>[] => [
	{
		accessorKey: 'is_reclaimed',
		header: 'Reclaimed',
		size: 200,
		enableColumnFilter: false,
		cell: (info) => {
			return (
				<div className='flex items-center gap-2'>
					<StatusButton value={info.getValue() as boolean} />
					<CustomLink
						url={`/work/info/details/${info.row.original.info_uuid}/order/details/${info.row.original.new_order_uuid}`}
						label={info.row.original.new_order_id as string}
						openInNewTab={true}
					/>
				</div>
			);
		},
	},
	{
		accessorKey: 'is_diagnosis_need',
		header: 'Diagnosis \nNeed',
		size: 40,
		enableColumnFilter: false,
		cell: (info) => <StatusButton value={info.getValue() as boolean} />,
	},

	{
		accessorKey: 'status',
		header: 'Status',
		enableColumnFilter: false,
		size: 40,
		cell: (info) => {
			const status = info.getValue() as string;
			const bgColorClass =
				{
					accepted: 'bg-success',
					rejected: 'bg-red-500',
					not_repairable: 'bg-gray-500',
					pending: 'bg-warning',
				}[status?.toLowerCase()] || '';

			return (
				<div>
					<span className={`rounded px-2 py-1 capitalize text-white ${bgColorClass}`}>{status}</span>
					<DateTime
						date={
							info.row.original.status_update_date ? new Date(info.row.original.status_update_date) : null
						}
						isTime={false}
					/>
				</div>
			);
		},
	},
	{
		accessorKey: 'diagnosis_proposed_cost',
		header: 'Proposed \nCost',
		size: 40,
		enableColumnFilter: false,
	},
	{
		accessorKey: 'is_proceed_to_repair',
		header: 'Proceed to \nRepair',
		size: 40,
		enableColumnFilter: false,
		cell: (info) => <StatusButton value={info.getValue() as boolean} />,
	},
	{
		accessorKey: 'is_transferred_for_qc',
		header: 'Transferred to \nQC',
		size: 40,
		enableColumnFilter: false,
		cell: (info) => <StatusButton value={info.getValue() as boolean} />,
	},
	{
		accessorKey: 'is_ready_for_delivery',
		header: 'Ready for \nDelivery',
		size: 40,
		enableColumnFilter: false,
		cell: (info) => <StatusButton value={info.getValue() as boolean} />,
	},
	{
		accessorKey: 'bill_amount',
		header: 'Bill \nAmount',
		size: 40,
		enableColumnFilter: false,
	},
	{
		accessorKey: 'ready_for_delivery_date',
		header: 'Ready for \nDelivery Date',
		size: 40,
		enableColumnFilter: false,
		cell: (info) => <DateTime date={info.getValue() as Date} isTime={false} />,
	},
	{
		accessorFn: (row) => OrderID(row),
		header: 'Order ID',
		enableColumnFilter: false,
		cell: (info) => {
			const uuid = info.row.original.uuid;
			const info_uuid = info.row.original.info_uuid;
			const reclaimed_order_uuid = info.row.original.reclaimed_order_uuid;
			return (
				<OderID
					info_uuid={info_uuid}
					uuid={uuid}
					order_id={info.row.original.order_id}
					reclaimed_order_uuid={reclaimed_order_uuid}
					reclaimed_order_id={info.row.original.reclaimed_order_id}
				/>
			);
		},
	},
	{
		accessorFn: (row) => ProductName(row),
		id: 'product',
		header: 'Product',
		enableColumnFilter: false,
		cell: (info) => {
			const { brand_name, model_name, serial_no } = info.row.original;
			return <Product brand_name={brand_name} model_name={model_name} serial_no={serial_no} />;
		},
	},
	{
		accessorKey: 'engineer_name',
		header: 'Engineer',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'quantity',
		header: 'QTY',
		size: 40,
		enableColumnFilter: false,
	},

	{
		accessorFn: (row) => {
			return row.order_problems_name
				.map((item:string) => item)
				.join(', ')
				.replace(/_/g, ' ');
		},
		header: 'Order Problem',
		enableColumnFilter: false,
		size: 180,
		cell: (info) => {
			const { problem_statement } = info.row.original;

			return <Problem problems_name={info.getValue() as string} problem_statement={problem_statement} />;
		},
	},
	{
		accessorKey: 'images',
		header: 'Images',
		cell: (info) => {
			const { image_1, image_2, image_3 } = info.row.original;

			return <OrderImages image_1={image_1} image_2={image_2} image_3={image_3} />;
		},
	},
	{
		accessorFn: (row) => {
			return row.diagnosis_problems_name
				.map((item) => item)
				.join(', ')
				.replace(/_/g, ' ');
		},
		header: 'Diagnosis Problem',
		enableColumnFilter: false,
		size: 180,
		cell: (info) => {
			const { diagnosis_problem_statement } = info.row.original;

			return (
				<Problem problems_name={info.getValue() as string} problem_statement={diagnosis_problem_statement} />
			);
		},
	},
	{
		accessorFn: (row) => {
			return row.repairing_problems_name
				.map((item) => item)
				.join(', ')
				.replace(/_/g, ' ');
		},
		header: 'Repairing Problem',
		enableColumnFilter: false,
		size: 180,
		cell: (info) => {
			const { repairing_problem_statement } = info.row.original;

			return (
				<Problem problems_name={info.getValue() as string} problem_statement={repairing_problem_statement} />
			);
		},
	},
	{
		accessorFn: (row) => {
			return row.qc_problems_name
				.map((item) => item)
				.join(', ')
				.replace(/_/g, ' ');
		},
		header: 'QC Problem',
		enableColumnFilter: false,
		size: 180,
		cell: (info) => {
			const { qc_problem_statement } = info.row.original;

			return <Problem problems_name={info.getValue() as string} problem_statement={qc_problem_statement} />;
		},
	},
	{
		accessorFn: (row) => {
			return row.delivery_problems_name
				.map((item) => item)
				.join(', ')
				.replace(/_/g, ' ');
		},
		header: 'Delivery Problem',
		enableColumnFilter: false,
		size: 180,
		cell: (info) => {
			const { delivery_problem_statement } = info.row.original;

			return <Problem problems_name={info.getValue() as string} problem_statement={delivery_problem_statement} />;
		},
	},
	{
		accessorFn: (row) => {
			return row.accessories_name
				?.map((item) => item)
				.join(', ')
				.replace(/_/g, ' ');
		},
		header: 'Accessories',
		enableColumnFilter: false,
		cell: (info) => info.getValue() as string,
	},
	{
		id: 'action_trx',
		header: 'Section \nTransfer',
		cell: (info) => (
			<Transfer onClick={() => handleAgainstTrx?.(info.row)} disabled={!info.row.original.is_proceed_to_repair} />
		),
		size: 40,
		meta: {
			hidden: !actionTrxAccess,
			disableFullFilter: true,
		},
	},
	{
		accessorFn: (row) => LocationName(row),
		id: 'location',
		header: 'Location',
		enableColumnFilter: false,
		size: 170,
		cell: (info) => {
			const { branch_name, warehouse_name, rack_name, floor_name, box_name } = info.row.original;
			return (
				<Location
					branch_name={branch_name}
					warehouse_name={warehouse_name}
					rack_name={rack_name}
					floor_name={floor_name}
					box_name={box_name}
				/>
			);
		},
	},
];
export const orderColumns = ({
	actionTrxAccess,
	actionProceedToRepair,
	handleAgainstTrx,
	handleProceedToRepair,
	actionDiagnosisNeed,
	handelDiagnosisStatusChange,
}: IOrderColumns = {}): ColumnDef<IOrderTableData>[] => [
	{
		accessorKey: 'is_reclaimed',
		header: 'Reclaimed',
		enableColumnFilter: false,
		cell: (info) => {
			return (
				<div className='flex flex-col gap-2'>
					<StatusButton value={info.getValue() as boolean} />
					<CustomLink
						url={`/work/info/details/${info.row.original.info_uuid}/order/details/${info.row.original.new_order_uuid}`}
						label={info.row.original.new_order_id as string}
						openInNewTab={true}
					/>
				</div>
			);
		},
	},
	{
		accessorKey: 'is_diagnosis_need',
		header: 'Diagnosis \nNeed',
		size: 40,
		enableColumnFilter: false,
		cell: (info) => (
			<Switch
				checked={info.getValue() as boolean}
				onCheckedChange={() => handelDiagnosisStatusChange?.(info.row)}
			/>
		),
		meta: {
			hidden: !actionDiagnosisNeed,
			disableFullFilter: true,
		},
	},
	{
		accessorKey: 'is_proceed_to_repair',
		header: 'Proceed to \nRepair',
		size: 40,
		enableColumnFilter: false,
		cell: (info) => (
			<Switch checked={info.getValue() as boolean} onCheckedChange={() => handleProceedToRepair?.(info.row)} />
		),
		meta: {
			hidden: !actionProceedToRepair,
			disableFullFilter: true,
		},
	},

	{
		accessorFn: (row) => OrderID(row),
		header: 'Order ID',
		enableColumnFilter: false,
		cell: (info) => {
			const uuid = info.row.original.uuid;
			const info_uuid = info.row.original.info_uuid;
			const reclaimed_order_uuid = info.row.original.reclaimed_order_uuid;
			return (
				<OderID
					info_uuid={info_uuid}
					uuid={uuid}
					order_id={info.row.original.order_id}
					reclaimed_order_uuid={reclaimed_order_uuid}
					reclaimed_order_id={info.row.original.reclaimed_order_id}
				/>
			);
		},
	},
	{
		accessorKey: 'info_id',
		header: 'Info ID',
		enableColumnFilter: false,
		cell: (info) => {
			const { info_uuid, user_name, user_phone } = info.row.original;
			return (
				<div className='flex flex-col gap-2'>
					<CustomLink
						url={`/work/info/details/${info_uuid}`}
						label={info.getValue() as string}
						openInNewTab={true}
					/>
					<UserNamePhone user_name={user_name} phone={user_phone} />
				</div>
			);
		},
	},
	{
		accessorFn: (row) => ProductName(row),
		id: 'product',
		header: 'Product',
		size: 170,
		enableColumnFilter: false,
		cell: (info) => {
			const { brand_name, model_name, serial_no } = info.row.original;
			return <Product brand_name={brand_name} model_name={model_name} serial_no={serial_no} />;
		},
	},
	{
		accessorKey: 'quantity',
		header: 'QTY',
		size: 40,
		enableColumnFilter: false,
	},
	{
		accessorFn: (row) => {
			return row.order_problems_name
				.map((item:string) => item)
				.join(', ')
				.replace(/_/g, ' ');
		},
		header: 'Order Problem',
		enableColumnFilter: false,
		size: 180,
		cell: (info) => {
			const { problem_statement } = info.row.original;

			return <Problem problems_name={info.getValue() as string} problem_statement={problem_statement} />;
		},
	},
	{
		accessorKey: 'images',
		header: 'Images',
		enableColumnFilter: false,
		enableSorting: false,
		cell: (info) => {
			const { image_1, image_2, image_3 } = info.row.original;

			return <OrderImages image_1={image_1} image_2={image_2} image_3={image_3} />;
		},
	},
	{
		accessorFn: (row) => {
			return row.accessories_name
				?.map((item) => item)
				.join(', ')
				.replace(/_/g, ' ');
		},
		header: 'Accessories',
		enableColumnFilter: false,
		cell: (info) => info.getValue() as string,
	},
	{
		id: 'action_trx',
		header: 'Section \nTransfer',
		cell: (info) => (
			<Transfer onClick={() => handleAgainstTrx?.(info.row)} disabled={!info.row.original.is_proceed_to_repair} />
		),
		size: 40,
		meta: {
			hidden: !actionTrxAccess,
			disableFullFilter: true,
		},
	},
	{
		accessorFn: (row) => LocationName(row),
		id: 'location',
		header: 'Location',
		enableColumnFilter: false,
		size: 170,
		cell: (info) => {
			const { branch_name, warehouse_name, rack_name, floor_name, box_name } = info.row.original;
			return (
				<Location
					branch_name={branch_name}
					warehouse_name={warehouse_name}
					rack_name={rack_name}
					floor_name={floor_name}
					box_name={box_name}
				/>
			);
		},
	},
];
export const QCColumns = ({
	handelDeliveryStatusChange,
	haveDeliveryAccess,
}: {
	handelDeliveryStatusChange?: (row: Row<any>) => void;
	haveDeliveryAccess?: boolean;
} = {}): ColumnDef<IOrderTableData>[] => [
	{
		accessorKey: 'is_ready_for_delivery',
		header: 'Ready for \nDelivery',
		enableColumnFilter: false,
		cell: (info) => (
			<Switch
				checked={info.getValue() as boolean}
				onCheckedChange={() => handelDeliveryStatusChange?.(info.row)}
				disabled={!haveDeliveryAccess}
			/>
		),
	},
	{
		accessorFn: (row) => OrderID(row),
		header: 'Order ID',
		enableColumnFilter: false,
		cell: (info) => {
			const uuid = info.row.original.uuid;
			const info_uuid = info.row.original.info_uuid;
			const reclaimed_order_uuid = info.row.original.reclaimed_order_uuid;
			return (
				<OderID
					info_uuid={info_uuid}
					uuid={uuid}
					order_id={info.row.original.order_id}
					reclaimed_order_uuid={reclaimed_order_uuid}
					reclaimed_order_id={info.row.original.reclaimed_order_id}
				/>
			);
		},
	},
	{
		accessorKey: 'info_id',
		header: 'Info ID',
		enableColumnFilter: false,
		cell: (info) => {
			const { info_uuid, user_name, user_phone } = info.row.original;
			return (
				<div className='flex flex-col gap-2'>
					<CustomLink
						url={`/work/info/details/${info_uuid}`}
						label={info.getValue() as string}
						openInNewTab={true}
					/>
					<UserNamePhone user_name={user_name} phone={user_phone} />
				</div>
			);
		},
	},
	{
		accessorFn: (row) => ProductName(row),
		id: 'product',
		header: 'Product',
		enableColumnFilter: false,
		cell: (info) => {
			const { brand_name, model_name, serial_no } = info.row.original;
			return <Product brand_name={brand_name} model_name={model_name} serial_no={serial_no} />;
		},
	},
	{
		accessorKey: 'quantity',
		header: 'QTY',
		size: 40,
		enableColumnFilter: false,
	},
	{
		accessorFn: (row) => {
			return row.order_problems_name
				.map((item:string) => item)
				.join(', ')
				.replace(/_/g, ' ');
		},
		header: 'Order Problem',
		enableColumnFilter: false,
		size: 180,
		cell: (info) => {
			const { problem_statement } = info.row.original;

			return <Problem problems_name={info.getValue() as string} problem_statement={problem_statement} />;
		},
	},
	{
		accessorKey: 'images',
		header: 'Images',
		cell: (info) => {
			const { image_1, image_2, image_3 } = info.row.original;

			return <OrderImages image_1={image_1} image_2={image_2} image_3={image_3} />;
		},
	},
	{
		accessorFn: (row) => {
			return row.diagnosis_problems_name
				.map((item) => item)
				.join(', ')
				.replace(/_/g, ' ');
		},
		header: 'Diagnosis Problem',
		enableColumnFilter: false,
		size: 180,
		cell: (info) => {
			const { diagnosis_problem_statement } = info.row.original;

			return (
				<Problem problems_name={info.getValue() as string} problem_statement={diagnosis_problem_statement} />
			);
		},
	},
	{
		accessorFn: (row) => {
			return row.repairing_problems_name
				.map((item) => item)
				.join(', ')
				.replace(/_/g, ' ');
		},
		header: 'Repairing Problem',
		enableColumnFilter: false,
		size: 180,
		cell: (info) => {
			const { repairing_problem_statement } = info.row.original;

			return (
				<Problem problems_name={info.getValue() as string} problem_statement={repairing_problem_statement} />
			);
		},
	},
	{
		accessorFn: (row) => {
			return row.qc_problems_name
				.map((item) => item)
				.join(', ')
				.replace(/_/g, ' ');
		},
		header: 'QC Problem',
		enableColumnFilter: false,
		size: 180,
		cell: (info) => {
			const { qc_problem_statement } = info.row.original;

			return <Problem problems_name={info.getValue() as string} problem_statement={qc_problem_statement} />;
		},
	},
	{
		accessorFn: (row) => {
			return row.accessories_name
				?.map((item) => item)
				.join(', ')
				.replace(/_/g, ' ');
		},
		header: 'Accessories',
		enableColumnFilter: false,
		cell: (info) => info.getValue() as string,
	},
	{
		accessorFn: (row) => LocationName(row),
		id: 'location',
		header: 'Location',
		enableColumnFilter: false,
		size: 170,
		cell: (info) => {
			const { branch_name, warehouse_name, rack_name, floor_name, box_name } = info.row.original;
			return (
				<Location
					branch_name={branch_name}
					warehouse_name={warehouse_name}
					rack_name={rack_name}
					floor_name={floor_name}
					box_name={box_name}
				/>
			);
		},
	},
];
export const RepairingColumns = ({
	handelDeliveryStatusChange,
	haveDeliveryAccess,
	handelQCStatusChange,
	haveQCAccess,
	actionTrxAccess,
	handleAgainstTrx,
}: {
	handelDeliveryStatusChange?: (row: Row<any>) => void;
	haveDeliveryAccess?: boolean;
	handelQCStatusChange?: (row: Row<any>) => void;
	haveQCAccess?: boolean;
	actionTrxAccess?: boolean;
	handleAgainstTrx?: (row: Row<any>) => void;
} = {}): ColumnDef<IOrderTableData>[] => [
	{
		accessorKey: 'is_transferred_for_qc',
		header: 'Transfer For \nQC',
		enableColumnFilter: false,
		size: 80,
		cell: (info) => (
			<Switch
				checked={info.getValue() as boolean}
				onCheckedChange={() => handelQCStatusChange?.(info.row)}
				disabled={!haveQCAccess}
			/>
		),
	},
	{
		accessorKey: 'is_ready_for_delivery',
		header: 'Ready For \nDelivery',
		enableColumnFilter: false,
		size: 80,
		cell: (info) => (
			<Switch
				checked={info.getValue() as boolean}
				onCheckedChange={() => handelDeliveryStatusChange?.(info.row)}
				disabled={!haveDeliveryAccess}
			/>
		),
	},
	{
		accessorFn: (row) => OrderID(row),
		header: 'Order ID',
		enableColumnFilter: false,
		cell: (info) => {
			const uuid = info.row.original.uuid;
			const info_uuid = info.row.original.info_uuid;
			const reclaimed_order_uuid = info.row.original.reclaimed_order_uuid;
			return (
				<OderID
					info_uuid={info_uuid}
					uuid={uuid}
					order_id={info.row.original.order_id}
					reclaimed_order_uuid={reclaimed_order_uuid}
					reclaimed_order_id={info.row.original.reclaimed_order_id}
				/>
			);
		},
	},
	{
		accessorKey: 'info_id',
		header: 'Info ID',
		enableColumnFilter: false,
		cell: (info) => {
			const { info_uuid, user_name, user_phone } = info.row.original;
			return (
				<div className='flex flex-col gap-2'>
					<CustomLink
						url={`/work/info/details/${info_uuid}`}
						label={info.getValue() as string}
						openInNewTab={true}
					/>
					<UserNamePhone user_name={user_name} phone={user_phone} />
				</div>
			);
		},
	},
	{
		id: 'action_trx',
		header: 'Section \nTransfer',
		cell: (info) => (
			<Transfer
				onClick={() => handleAgainstTrx?.(info?.row)}
				disabled={!info.row.original.is_proceed_to_repair}
			/>
		),
		size: 40,
		meta: {
			hidden: !actionTrxAccess,
			disableFullFilter: true,
		},
	},
	{
		accessorFn: (row) => {
			return (
				row.product_transfer
					?.map((item) => item?.product_name + '-' + item?.warehouse_name + '(' + item?.quantity + ')')
					.join(', ') || ''
			);
		},
		header: 'Repairing Item',
		enableColumnFilter: false,
		cell: (info) => {
			const value = info.row.original.product_transfer as ITransferTableData[] | undefined;
			const headers = ['Product', 'Serial', 'Branch', 'Warehouse'];
			return <TableForColumn value={value} headers={headers} />;
		},
	},
	{
		accessorFn: (row) => ProductName(row),
		id: 'product',
		header: 'Product',
		enableColumnFilter: false,
		cell: (info) => {
			const { brand_name, model_name, serial_no } = info.row.original;
			return <Product brand_name={brand_name} model_name={model_name} serial_no={serial_no} />;
		},
	},
	{
		accessorKey: 'quantity',
		header: 'QTY',
		size: 40,
		enableColumnFilter: false,
	},
	{
		accessorFn: (row) => {
			return row.order_problems_name
				.map((item:string) => item)
				.join(', ')
				.replace(/_/g, ' ');
		},
		header: 'Order Problem',
		enableColumnFilter: false,
		size: 180,
		cell: (info) => {
			const { problem_statement } = info.row.original;

			return <Problem problems_name={info.getValue() as string} problem_statement={problem_statement} />;
		},
	},
	{
		accessorKey: 'images',
		header: 'Images',
		cell: (info) => {
			const { image_1, image_2, image_3 } = info.row.original;

			return <OrderImages image_1={image_1} image_2={image_2} image_3={image_3} />;
		},
	},
	{
		accessorFn: (row) => {
			return row.diagnosis_problems_name
				.map((item) => item)
				.join(', ')
				.replace(/_/g, ' ');
		},
		header: 'Diagnosis Problem',
		enableColumnFilter: false,
		size: 180,
		cell: (info) => {
			const { diagnosis_problem_statement } = info.row.original;

			return (
				<Problem problems_name={info.getValue() as string} problem_statement={diagnosis_problem_statement} />
			);
		},
	},
	{
		accessorFn: (row) => {
			return row.repairing_problems_name
				.map((item) => item)
				.join(', ')
				.replace(/_/g, ' ');
		},
		header: 'Repairing Problem',
		enableColumnFilter: false,
		size: 180,
		cell: (info) => {
			const { repairing_problem_statement } = info.row.original;

			return (
				<Problem problems_name={info.getValue() as string} problem_statement={repairing_problem_statement} />
			);
		},
	},
	{
		accessorFn: (row) => {
			return row.accessories_name
				?.map((item) => item)
				.join(', ')
				.replace(/_/g, ' ');
		},
		header: 'Accessories',
		enableColumnFilter: false,
		cell: (info) => info.getValue() as string,
	},
	{
		accessorFn: (row) => LocationName(row),
		id: 'location',
		header: 'Location',
		enableColumnFilter: false,
		size: 170,
		cell: (info) => {
			const { branch_name, warehouse_name, rack_name, floor_name, box_name } = info.row.original;
			return (
				<Location
					branch_name={branch_name}
					warehouse_name={warehouse_name}
					rack_name={rack_name}
					floor_name={floor_name}
					box_name={box_name}
				/>
			);
		},
	},
];
export const ReadyDeliveryColumns = (): ColumnDef<IOrderTableData>[] => [
	{
		accessorKey: 'ready_for_delivery_date',
		header: 'Ready Date',
		size: 40,
		enableColumnFilter: false,
		cell: (info) => <DateTime date={info.getValue() as Date} isTime={false} />,
	},
	{
		accessorKey: 'bill_amount',
		header: 'Bill Amount',
		size: 40,
		enableColumnFilter: false,
	},
	{
		accessorKey: 'advance_pay',
		header: 'Advance Pay',
		size: 40,
		enableColumnFilter: false,
	},
	{
		accessorFn: (row) =>row.bill_amount - row.advance_pay,
		header: 'Remaining',
		size: 40,
		enableColumnFilter: false,
	},
	{
		accessorFn: (row) => OrderID(row),
		header: 'Order ID',
		enableColumnFilter: false,
		cell: (info) => {
			const uuid = info.row.original.uuid;
			const info_uuid = info.row.original.info_uuid;
			const reclaimed_order_uuid = info.row.original.reclaimed_order_uuid;
			return (
				<OderID
					info_uuid={info_uuid}
					uuid={uuid}
					order_id={info.row.original.order_id}
					reclaimed_order_uuid={reclaimed_order_uuid}
					reclaimed_order_id={info.row.original.reclaimed_order_id}
				/>
			);
		},
	},
	{
		accessorKey: 'info_id',
		header: 'Info ID',
		enableColumnFilter: false,
		cell: (info) => {
			const { info_uuid, user_name, user_phone } = info.row.original;
			return (
				<div className='flex flex-col gap-2'>
					<CustomLink
						url={`/work/info/details/${info_uuid}`}
						label={info.getValue() as string}
						openInNewTab={true}
					/>
					<UserNamePhone user_name={user_name} phone={user_phone} />
				</div>
			);
		},
	},
	{
		accessorFn: (row) => ProductName(row),
		id: 'product',
		header: 'Product',
		enableColumnFilter: false,
		cell: (info) => {
			const { brand_name, model_name, serial_no } = info.row.original;
			return <Product brand_name={brand_name} model_name={model_name} serial_no={serial_no} />;
		},
	},
	{
		accessorKey: 'quantity',
		header: 'QTY',
		size: 40,
		enableColumnFilter: false,
	},
	{
		accessorFn: (row) => {
			return row.order_problems_name
				.map((item: string) => item)
				.join(', ')
				.replace(/_/g, ' ');
		},
		id: 'order_problems_name',
		header: 'Order Problem',
		enableColumnFilter: false,
		size: 180,
		cell: (info) => {
			const { problem_statement } = info.row.original;

			return <Problem problems_name={info.getValue() as string} problem_statement={problem_statement} />;
		},
	},
	{
		accessorKey: 'images',
		header: 'Images',
		cell: (info) => {
			const { image_1, image_2, image_3 } = info.row.original;

			return <OrderImages image_1={image_1} image_2={image_2} image_3={image_3} />;
		},
	},
	{
		accessorFn: (row) => {
			return row.diagnosis_problems_name
				.map((item) => item)
				.join(', ')
				.replace(/_/g, ' ');
		},
		id: 'diagnosis_problems_name',
		header: 'Diagnosis Problem',
		enableColumnFilter: false,
		size: 180,
		cell: (info) => {
			const { diagnosis_problem_statement } = info.row.original;

			return (
				<Problem problems_name={info.getValue() as string} problem_statement={diagnosis_problem_statement} />
			);
		},
	},
	{
		accessorFn: (row) => {
			return row.repairing_problems_name
				.map((item) => item)
				.join(', ')
				.replace(/_/g, ' ');
		},
		id: 'repairing_problems_name',
		header: 'Repairing Problem',
		enableColumnFilter: false,
		size: 180,
		cell: (info) => {
			const { repairing_problem_statement } = info.row.original;

			return (
				<Problem problems_name={info.getValue() as string} problem_statement={repairing_problem_statement} />
			);
		},
	},
	{
		accessorFn: (row) => {
			return row.qc_problems_name
				.map((item) => item)
				.join(', ')
				.replace(/_/g, ' ');
		},
		id: 'qc_problems_name',
		header: 'QC Problem',
		enableColumnFilter: false,
		size: 180,
		cell: (info) => {
			const { qc_problem_statement } = info.row.original;

			return <Problem problems_name={info.getValue() as string} problem_statement={qc_problem_statement} />;
		},
	},
	{
		accessorFn: (row) => {
			return row.delivery_problems_name
				.map((item) => item)
				.join(', ')
				.replace(/_/g, ' ');
		},
		id: 'delivery_problems_name',
		header: 'Delivery Problem',
		enableColumnFilter: false,
		size: 180,
		cell: (info) => {
			const { delivery_problem_statement } = info.row.original;

			return <Problem problems_name={info.getValue() as string} problem_statement={delivery_problem_statement} />;
		},
	},
	{
		accessorFn: (row) => {
			return row.accessories_name
				?.map((item) => item)
				.join(', ')
				.replace(/_/g, ' ');
		},
		id: 'accessories_name',
		header: 'Accessories',
		enableColumnFilter: false,
		cell: (info) => info.getValue() as string,
	},

	{
		accessorFn: (row) => LocationName(row),
		id: 'location',
		header: 'Location',
		enableColumnFilter: false,
		size: 170,
		cell: (info) => {
			const { branch_name, warehouse_name, rack_name, floor_name, box_name } = info.row.original;
			return (
				<Location
					branch_name={branch_name}
					warehouse_name={warehouse_name}
					rack_name={rack_name}
					floor_name={floor_name}
					box_name={box_name}
				/>
			);
		},
	},
];
//* Diagnosis Columns
export const diagnosisColumns = ({
	handleProceedToRepair,
}: {
	actionTrxAccess: boolean;
	handleAgainstTrx: (row: Row<any>) => void;
	handleProceedToRepair: (row: Row<any>) => void;
}): ColumnDef<IDiagnosisTableData>[] => [
	// {
	// 	accessorKey: 'diagnosis_id',
	// 	header: 'Diagnosis ID',
	// 	enableColumnFilter: false,
	// },
	{
		accessorFn: (row) => OrderID(row),
		id: 'order_id',
		header: 'Order ID',
		enableColumnFilter: false,
		cell: (info) => {
			const uuid = info.row.original.order_uuid;
			const info_uuid = info.row.original.info_uuid;
			const reclaimed_order_uuid = info.row.original.reclaimed_order_uuid;
			return (
				<OderID
					info_uuid={info_uuid}
					uuid={uuid}
					order_id={info.row.original.order_id}
					reclaimed_order_uuid={reclaimed_order_uuid}
					reclaimed_order_id={info.row.original.reclaimed_order_id}
				/>
			);
		},
	},
	{
		accessorKey: 'info_id',
		header: 'Info ID',
		enableColumnFilter: false,
		cell: (info) => {
			const { info_uuid, user_name, user_phone } = info.row.original;
			return (
				<div className='flex flex-col gap-2'>
					<CustomLink
						url={`/work/info/details/${info_uuid}`}
						label={info.getValue() as string}
						openInNewTab={true}
					/>
					<UserNamePhone user_name={user_name} phone={user_phone} />
				</div>
			);
		},
	},
	{
		accessorFn: (row) => ProductName(row),
		id: 'product',
		header: 'Product',
		size: 170,
		enableColumnFilter: false,
		cell: (info) => {
			const { brand_name, model_name, serial_no } = info.row.original;
			return <Product brand_name={brand_name} model_name={model_name} serial_no={serial_no} />;
		},
	},
	{
		accessorKey: 'quantity',
		header: 'QTY',
		size: 40,
		enableColumnFilter: false,
	},
	{
		accessorFn: (row) => {
			return row.order_problems_name
				.map((item) => item)
				.join(', ')
				.replace(/_/g, ' ');
		},
		id: 'order_problems_name',
		header: 'Order \nProblem',
		enableColumnFilter: false,
		size: 180,
		cell: (info) => {
			const { order_problem_statement } = info.row.original;

			return <Problem problems_name={info.getValue() as string} problem_statement={order_problem_statement} />;
		},
	},
	{
		accessorKey: 'images',
		header: 'Images',
		cell: (info) => {
			const { image_1, image_2, image_3 } = info.row.original;

			return <OrderImages image_1={image_1} image_2={image_2} image_3={image_3} />;
		},
	},
	{
		accessorFn: (row) => {
			return row.diagnosis_problems_name
				.map((item) => item)
				.join(', ')
				.replace(/_/g, ' ');
		},
		header: 'Diagnosis Problem',
		id: 'diagnosis_problem',
		enableColumnFilter: false,
		size: 180,
		cell: (info) => {
			const { problem_statement } = info.row.original;

			return <Problem problems_name={info.getValue() as string} problem_statement={problem_statement} />;
		},
	},

	{
		accessorKey: 'status',
		header: 'Status',
		enableColumnFilter: false,
		size: 180,
		cell: (info) => {
			const status = info.getValue() as string;
			const bgColorClass =
				{
					accepted: 'bg-success',
					rejected: 'bg-red-500',
					not_repairable: 'bg-gray-500',
					pending: 'bg-warning',
					customer_reject: 'bg-red-500',
				}[status.toLowerCase()] || '';

			return (
				<div className='gap-2'>
					<span className={`flex-1 rounded px-2 py-1 capitalize text-white ${bgColorClass}`}>
						{status?.split('_').join(' ')}
					</span>
					<DateTime
						date={
							info.row.original.status_update_date ? new Date(info.row.original.status_update_date) : null
						}
						isTime={false}
					/>
				</div>
			);
		},
	},
	{
		accessorKey: 'proposed_cost',
		header: 'Proposed Cost',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'is_proceed_to_repair',
		header: 'Proceed to \nRepair',
		size: 40,
		enableColumnFilter: false,
		cell: (info) => (
			<Switch checked={info.getValue() as boolean} onCheckedChange={() => handleProceedToRepair?.(info.row)} />
		),
	},
];
//* Section Columns
export const sectionColumns = (): ColumnDef<ISectionTableData>[] => [
	{
		accessorKey: 'name',
		header: 'Name',
		enableColumnFilter: false,
	},
];
//*Process Columns
export const processColumns = (): ColumnDef<IProcessTableData>[] => [
	{
		accessorKey: 'index',
		header: 'Index',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'section_name',
		header: 'Section',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'status',
		header: 'Process Status',
		enableColumnFilter: false,
		cell: (info) => {
			return (
				<>
					<StatusButton value={info.getValue() as boolean} />
					{info.row.original.status_update_date ? (
						<DateTime date={new Date(info.row.original.status_update_date)} isTime={false} />
					) : (
						''
					)}
				</>
			);
		},
	},
	{
		accessorFn: (row) => {
			return row.problems_name
				.map((item) => item)
				.join(', ')
				.replace(/_/g, ' ');
		},
		id: 'problems_name',
		header: 'Order Problem',
		enableColumnFilter: false,
		size: 180,
		cell: (info) => {
			const { problem_statement } = info.row.original;

			return <Problem problems_name={info.getValue() as string} problem_statement={problem_statement} />;
		},
	},
	{
		accessorKey: 'engineer_name',
		header: 'Engineer',
		enableColumnFilter: false,
	},
];
export const zoneColumns = (): ColumnDef<IZoneTableData>[] => [
	{
		accessorKey: 'division',
		header: 'Division',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'name',
		header: 'Name',
		enableColumnFilter: false,
		size: 350,
	},
	{
		accessorKey: 'latitude',
		header: 'latitude',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'longitude',
		header: 'longitude',
		enableColumnFilter: false,
	},
];

//* Accessories Columns
export const accessoriesColumns = (): ColumnDef<IAccessoriesTableData>[] => [
	{
		accessorKey: 'name',
		header: 'Name',
		enableColumnFilter: false,
	},
];
//* Transfer Columns
export const transferColumns = (): ColumnDef<ITransferTableData, unknown>[] => [
	{
		accessorKey: 'product_name',
		header: 'Product',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'serial_no',
		header: 'Serial',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'branch_name',
		header: 'Branch',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'warehouse_name',
		header: 'Warehouse',
		enableColumnFilter: false,
	},
];