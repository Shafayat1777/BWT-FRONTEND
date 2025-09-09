import { Location, StoreProduct, UserNamePhone } from '@/pages/work/_config/utils/component';
import { LocationName } from '@/pages/work/_config/utils/function';
import { ColumnDef, Row } from '@tanstack/react-table';

import StatusButton from '@/components/buttons/status';
import Transfer from '@/components/buttons/transfer';
import ColumnImage from '@/components/core/data-table/_views/column-image';
import { IFormSelectOption } from '@/components/core/form/types';
import { CustomLink } from '@/components/others/link';
import DateTime from '@/components/ui/date-time';
import ReactSelect from '@/components/ui/react-select';
import { Switch } from '@/components/ui/switch';

import { order_status } from '../../bill-info/utills';
import {
	IAttributesTableData,
	IBillInfo,
	IBoxTableData,
	IBranchTableData,
	IBrandTableData,
	ICategoryTableData,
	IFloorTableData,
	IGroupTableData,
	IInternalTransferTableData,
	IModelTableData,
	IOrdered,
	IProductEntryTableData,
	IProductSpecificationTableData,
	IProductTableData,
	IProductVariantTableData,
	IProductVariantValuesEntryTableData,
	IPurchaseEntryTableData,
	IPurchaseReturnEntryTableData,
	IPurchaseReturnTableData,
	IPurchaseTableData,
	IRackTableData,
	IRoomTableData,
	ISizeTableData,
	IStockTableData,
	ITransferTableData,
	IVendorTableData,
	IWarehouseFetch,
	IWarehouseKey,
	IWarehouseTableData,
} from './columns.type';
import { getWarehouseAndBranch } from './utils';
import { discountUnits } from '../../product-entry-v2/add-or-update/utils';

//* Group Columns
export const groupColumns = (): ColumnDef<IGroupTableData>[] => [
	{
		accessorKey: 'name',
		header: 'Name',
		enableColumnFilter: false,
	},
];

//* Category Columns
export const categoryColumns = (): ColumnDef<ICategoryTableData>[] => [
	{
		accessorKey: 'name',
		header: 'Name',
		enableColumnFilter: false,
	},
];

//* Brand Columns
export const brandColumns = (): ColumnDef<IBrandTableData>[] => [
	{
		accessorKey: 'brand_id',
		header: 'ID',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'name',
		header: 'Name',
		enableColumnFilter: false,
	},
];

//* Model Columns
export const modelColumns = (): ColumnDef<IModelTableData>[] => [
	{
		accessorKey: 'name',
		header: 'Name',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'brand_name',
		header: 'Brand',
		enableColumnFilter: false,
	},
];

//* Attributes Columns
export const attributeColumns = (): ColumnDef<IAttributesTableData>[] => [
	{
		accessorKey: 'name',
		header: 'Name',
		enableColumnFilter: false,
	},
];

//* Size Columns
export const sizeColumns = (): ColumnDef<ISizeTableData>[] => [
	{
		accessorKey: 'name',
		header: 'Name',
		enableColumnFilter: false,
	},
];

//* Vendor Columns
export const vendorColumns = (): ColumnDef<IVendorTableData>[] => [
	{
		accessorKey: 'name',
		header: 'Name',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'brand_name',
		header: 'Brand',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'company_name',
		header: 'Company',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'phone',
		header: 'Phone',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'address',
		header: 'Address',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'description',
		header: 'Description',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'is_active',
		header: 'Active',
		enableColumnFilter: false,
		cell: (info) => {
			return <StatusButton value={info.getValue() as boolean} />;
		},
	},
];

//* Product Columns
export const productColumns = ({
	actionTrxAccess,
	actionOrderAgainstTrxAccess,
	warehouse,
	handleAgainstTrx,
	handleOrderAgainstWarehouse1Trx,
	handleOrderAgainstWarehouse2Trx,
	handleOrderAgainstWarehouse3Trx,
	handleOrderAgainstWarehouse4Trx,
	handleOrderAgainstWarehouse5Trx,
	handleOrderAgainstWarehouse6Trx,
	handleOrderAgainstWarehouse7Trx,
	handleOrderAgainstWarehouse8Trx,
	handleOrderAgainstWarehouse9Trx,
	handleOrderAgainstWarehouse10Trx,
	handleOrderAgainstWarehouse11Trx,
	handleOrderAgainstWarehouse12Trx,
}: {
	actionTrxAccess: boolean;
	actionOrderAgainstTrxAccess: boolean;
	warehouse: IWarehouseFetch;
	handleAgainstTrx: (row: Row<any>) => void;
	handleOrderAgainstWarehouse1Trx: (row: Row<any>) => void;
	handleOrderAgainstWarehouse2Trx: (row: Row<any>) => void;
	handleOrderAgainstWarehouse3Trx: (row: Row<any>) => void;
	handleOrderAgainstWarehouse4Trx: (row: Row<any>) => void;
	handleOrderAgainstWarehouse5Trx: (row: Row<any>) => void;
	handleOrderAgainstWarehouse6Trx: (row: Row<any>) => void;
	handleOrderAgainstWarehouse7Trx: (row: Row<any>) => void;
	handleOrderAgainstWarehouse8Trx: (row: Row<any>) => void;
	handleOrderAgainstWarehouse9Trx: (row: Row<any>) => void;
	handleOrderAgainstWarehouse10Trx: (row: Row<any>) => void;
	handleOrderAgainstWarehouse11Trx: (row: Row<any>) => void;
	handleOrderAgainstWarehouse12Trx: (row: Row<any>) => void;
}): ColumnDef<IProductTableData>[] => {
	const columns: ColumnDef<IProductTableData>[] = [
		{
			accessorKey: 'is_maintaining_stock',
			header: 'Maintain \nStock',
			enableColumnFilter: false,
			size: 40,
			cell: (info) => {
				return <StatusButton value={info.getValue() as boolean} />;
			},
		},
		{
			accessorFn: (row) => {
				return row.name + '-' + row.model_name + '-' + row.category_name + '-' + row.size_name;
			},
			id: 'product',
			header: 'Product',
			enableColumnFilter: false,
			cell: (info) => {
				const { name, model_name, category_name, size_name } = info.row.original;
				return (
					<StoreProduct
						name={name}
						model_name={model_name}
						category_name={category_name}
						size_name={size_name}
					/>
				);
			},
		},
		{
			accessorKey: 'warranty_days',
			header: 'Warranty \nDays',
			size: 40,
			enableColumnFilter: false,
		},
		{
			accessorKey: 'service_warranty_days',
			header: 'Service \nWarranty',
			size: 40,
			enableColumnFilter: false,
		},
		{
			accessorKey: 'type',
			header: 'Type',
			size: 40,
			enableColumnFilter: false,
		},
		{
			id: 'action_trx',
			header: 'Internal \nTransfer',
			cell: (info) => <Transfer onClick={() => handleAgainstTrx(info.row)} />,
			size: 40,
			meta: {
				hidden: !actionTrxAccess,
				disableFullFilter: true,
			},
		},
	];

	const handlerMap = [
		handleOrderAgainstWarehouse1Trx,
		handleOrderAgainstWarehouse2Trx,
		handleOrderAgainstWarehouse3Trx,
		handleOrderAgainstWarehouse4Trx,
		handleOrderAgainstWarehouse5Trx,
		handleOrderAgainstWarehouse6Trx,
		handleOrderAgainstWarehouse7Trx,
		handleOrderAgainstWarehouse8Trx,
		handleOrderAgainstWarehouse9Trx,
		handleOrderAgainstWarehouse10Trx,
		handleOrderAgainstWarehouse11Trx,
		handleOrderAgainstWarehouse12Trx,
	];

	for (let i = 0; i < 12; i++) {
		const warehouseNum = i + 1;
		const accessorKey = `warehouse_${warehouseNum}` as const;

		columns.push({
			accessorKey,
			header: () => {
				const [warehouse_name, branch_name] = getWarehouseAndBranch(warehouse, accessorKey as IWarehouseKey);

				return <Location branch_name={branch_name?.slice(0, -1)} warehouse_name={warehouse_name} />;
			},
			enableColumnFilter: false,
			size: 40,
			cell: (info: any) => {
				return (
					<div className='flex items-center gap-2'>
						<Transfer
							onClick={() => handlerMap[i](info.row)}
							disabled={!actionOrderAgainstTrxAccess || info.getValue() === 0}
						/>
						<span>{info.getValue() as string}</span>
					</div>
				);
			},
		});
	}

	return columns;
};
//? NEW PRODUCT ENTRY ?//
//* Product Entry
export const productEntryColumns = (handlePublished: (row: Row<any>) => void): ColumnDef<IProductEntryTableData>[] => [
	{
		accessorKey: 'is_published',
		header: 'Published',
		enableColumnFilter: false,
		cell: (info) => (
			<Switch checked={info.getValue() as boolean} onCheckedChange={() => handlePublished(info.row)} />
		),
	},
	{
		accessorKey: 'title',
		header: 'Title',
		enableColumnFilter: false,
		cell: (info) => (
			<CustomLink
				url={`/store/product-entry/${info.row.original.uuid}/details`}
				label={info.getValue() as string}
				openInNewTab={true}
			/>
		),
	},
	{
		accessorKey: 'category_name',
		header: 'Category',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'model_name',
		header: 'Model',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'warranty_days',
		header: 'Warranty',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'service_warranty_days',
		header: 'Service Warranty',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'image',
		header: 'Image',
		enableColumnFilter: false,
		cell: (info) => <ColumnImage src={info.getValue() as string} alt={`image`} />,
	},
];

//* Product Variant Details
export const productVariantDetailsColumns = (
	handleAttribute?: (index: number) => void
): ColumnDef<IProductVariantTableData>[] => [
	{
		accessorKey: 'selling_price',
		header: 'Selling Price',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'discount',
		header: 'Discount',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'warehouse_1',
		header: 'Warehouse 1',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'warehouse_2',
		header: 'Warehouse 2',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'warehouse_3',
		header: 'Warehouse 3',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'selling_warehouse',
		header: 'Selling Warehouse',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'product_variant_values_entry',
		header: 'Attributes',
		enableColumnFilter: false,
		cell: (info) =>
			info.getValue() ? (
				<Transfer onClick={() => handleAttribute?.(info.row.index)} />
			) : (
				<StatusButton value={info.getValue() as boolean} />
			),
	},
];
export const productVariantDetailsColumnsV2 = (
	handleAttribute?: (index: number) => void,
	dynamicColumns: string[] = []
): ColumnDef<IProductVariantTableData>[] => {
	const staticColumns: ColumnDef<IProductVariantTableData>[] = [
		{
			accessorKey: 'selling_price',
			header: 'Selling Price',
			enableColumnFilter: false,
		},
		{
			accessorKey: 'discount',
			header: 'Discount',
			enableColumnFilter: false,
			cell: (info) => (
				<span className='flex gap-2'>
					<span>{info.row.original.discount}</span>
					<span>{discountUnits.find((unit) => unit.value === info.row.original.discount_unit)?.label || info.row.original.discount_unit}</span>
				</span>
			),
		},
		{
			accessorKey: 'selling_warehouse',
			header: 'Selling Warehouse',
			enableColumnFilter: false,
		},
	];

	const dynamicColumnDefs: ColumnDef<IProductVariantTableData>[] = dynamicColumns.map((columnName) => ({
		accessorKey: columnName as keyof IProductVariantTableData,
		header: columnName.charAt(0).toUpperCase() + columnName.slice(1).replace(/_/g, ' '),
		enableColumnFilter: false,
	}));
	return [...staticColumns, ...dynamicColumnDefs];
};
//* Product Specification Details
export const productSpecificationDetailsColumns = (): ColumnDef<IProductSpecificationTableData>[] => [
	{
		accessorKey: 'label',
		header: 'Label',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'value',
		header: 'Value',
		enableColumnFilter: false,
	},
];
//* Product Variant Values Entry Details
export const productVariantValuesEntryDetailsColumns = (): ColumnDef<IProductVariantValuesEntryTableData>[] => [
	{
		accessorKey: 'attribute_name',
		header: 'Attribute',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'value',
		header: 'Value',
		enableColumnFilter: false,
	},
];

//? NEW PRODUCT ENTRY ?//
//* Purchase Columns
export const purchaseColumns = (): ColumnDef<IPurchaseTableData>[] => [
	{
		accessorKey: 'purchase_id',
		header: 'ID',
		enableColumnFilter: false,
		cell: (info) => {
			const uuid = info.row.original.uuid;
			return (
				<CustomLink
					url={`/store/purchase/${uuid}/details`}
					label={info.getValue() as string}
					openInNewTab={true}
				/>
			);
		},
	},
	{
		accessorKey: 'vendor_name',
		header: 'Vendor',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'branch_name',
		header: 'Branch',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'date',
		header: 'Date',
		enableColumnFilter: false,
		cell: (info) => <DateTime date={info.getValue() as Date} isTime={false} />,
	},
	{
		accessorKey: 'payment_mode',
		header: 'Payment Mode',
		enableColumnFilter: false,
	},
];
//* Purchase Entry Columns
export const purchaseEntryColumns = (): ColumnDef<IPurchaseEntryTableData>[] => [
	{
		accessorKey: 'product_name',
		header: 'Product',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'serial_no',
		header: 'Serial No',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'price_per_unit',
		header: 'Price Per Unit',
		enableColumnFilter: false,
	},
	{
		accessorFn: (row) => row.price_per_unit * row.quantity,
		header: 'Total(No Discount)',
		enableColumnFilter: false,
		cell: (info) => <span>{info.row.original.price_per_unit * info.row.original.quantity}</span>,
	},
	{
		accessorKey: 'discount',
		header: 'Discount',
		enableColumnFilter: false,
	},
	{
		accessorFn: (row) => row.price_per_unit * row.quantity - row.discount,
		header: 'Total',
		enableColumnFilter: false,
		cell: (info) => (
			<span>{info.row.original.price_per_unit * info.row.original.quantity - info.row.original.discount}</span>
		),
	},
	{
		accessorFn: (row) =>
			LocationName({
				branch_name: row.branch_name ?? '',
				warehouse_name: row.warehouse_name ?? '',
				rack_name: row.rack_name ?? '',
				floor_name: row.floor_name ?? '',
				box_name: row.box_name ?? '',
			}),
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

//* Purchase Return Columns
export const purchaseReturnColumns = (): ColumnDef<IPurchaseReturnTableData>[] => [
	{
		accessorKey: 'purchase_return_id',
		header: 'ID',
		enableColumnFilter: false,
		cell: (info) => {
			const uuid = info.row.original.uuid;
			return (
				<CustomLink
					url={`/store/purchase-return/${uuid}/details`}
					label={info.getValue() as string}
					openInNewTab={true}
				/>
			);
		},
	},
	{
		accessorKey: 'purchase_id',
		header: 'Purchase ID',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'warehouse_name',
		header: 'Warehouse',
		enableColumnFilter: false,
	},
];

//* Purchase Return Entry Columns
export const purchaseReturnEntryColumns = (): ColumnDef<IPurchaseReturnEntryTableData>[] => [
	{
		accessorKey: 'product_name',
		header: 'Product',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'serial_no',
		header: 'Serial No',
		enableColumnFilter: false,
	},
];

//* Stock Columns
export const stockColumns = ({
	actionTrxAccess,
	handleAgainstTrx,
}: {
	actionTrxAccess: boolean;
	handleAgainstTrx: (row: Row<any>) => void;
}): ColumnDef<IStockTableData>[] => [
	{
		accessorKey: 'stock_id',
		header: 'ID',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'product_name',
		header: 'Product',
		enableColumnFilter: false,
	},
	{
		id: 'action_trx',
		header: 'Internal Transfer',
		cell: (info) => <Transfer onClick={() => handleAgainstTrx(info.row)} />,
		size: 40,
		meta: {
			hidden: !actionTrxAccess,
			disableFullFilter: true,
		},
	},
	{
		accessorKey: 'warehouse_1',
		header: 'Warehouse 1',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'warehouse_2',
		header: 'Warehouse 2',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'warehouse_3',
		header: 'Warehouse 3',
		enableColumnFilter: false,
	},
];

//* Branch Columns
export const branchColumns = (): ColumnDef<IBranchTableData>[] => [
	{
		accessorKey: 'name',
		header: 'Name',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'address',
		header: 'Address',
		enableColumnFilter: false,
	},
];

//* Warehouse Columns
export const warehouseColumns = (): ColumnDef<IWarehouseTableData>[] => [
	{
		accessorKey: 'name',
		header: 'Name',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'assigned',
		header: 'Assigned',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'branch_name',
		header: 'Branch',
		enableColumnFilter: false,
	},
];

//* Internal Transfer Columns
export const internalTransferColumns = (): ColumnDef<IInternalTransferTableData>[] => [
	{
		accessorKey: 'internal_transfer_id',
		header: 'ID',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'product_name',
		header: 'Product',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'serial_no',
		header: 'Serial No',
		enableColumnFilter: false,
	},
	{
		accessorFn: (row) =>
			LocationName({
				branch_name: row.from_branch_name,
				warehouse_name: row.from_warehouse_name,
				rack_name: row.rack_name,
				floor_name: row.floor_name,
				box_name: row.box_name,
			}),
		id: 'from_location',
		header: 'From Location',
		enableColumnFilter: false,
		size: 170,
		cell: (info) => {
			const { from_branch_name, from_warehouse_name } = info.row.original;
			return <Location branch_name={from_branch_name} warehouse_name={from_warehouse_name} />;
		},
	},
	{
		accessorFn: (row) =>
			LocationName({
				branch_name: row.to_branch_name,
				warehouse_name: row.to_warehouse_name,
				rack_name: row.rack_name,
				floor_name: row.floor_name,
				box_name: row.box_name,
			}),
		id: 'to_location',
		header: 'To Location',
		enableColumnFilter: false,
		size: 170,
		cell: (info) => {
			const { to_branch_name, to_warehouse_name, rack_name, floor_name, box_name } = info.row.original;
			return (
				<Location
					branch_name={to_branch_name}
					warehouse_name={to_warehouse_name}
					rack_name={rack_name}
					floor_name={floor_name}
					box_name={box_name}
				/>
			);
		},
	},
	{
		accessorKey: 'quantity',
		header: 'Quantity',
		enableColumnFilter: false,
	},
];
//* Transfer Columns
export const transferColumns = (): ColumnDef<ITransferTableData, unknown>[] => [
	{
		accessorKey: 'order_id',
		header: 'ID',
		enableColumnFilter: false,
		cell: (info) => {
			const uuid = info.row.original.order_uuid;
			const info_uuid = info.row.original.info_uuid;
			return (
				<CustomLink
					url={`/work/info/details/${info_uuid}/order/details/${uuid}`}
					label={info.getValue() as string}
					openInNewTab={true}
				/>
			);
		},
	},
	{
		accessorKey: 'info_id',
		header: 'Info ID',
		enableColumnFilter: false,
		cell: (info) => {
			const uuid = info.row.original.info_uuid;
			return (
				<CustomLink url={`/work/info/details/${uuid}`} label={info.getValue() as string} openInNewTab={true} />
			);
		},
	},
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
		accessorFn: (row) =>
			LocationName({
				branch_name: row.branch_name ?? '',
				warehouse_name: row.warehouse_name ?? '',
			}),
		id: 'location',
		header: 'Location',
		enableColumnFilter: false,
		size: 170,
		cell: (info) => {
			const { branch_name, warehouse_name } = info.row.original;
			return <Location branch_name={branch_name!} warehouse_name={warehouse_name} />;
		},
	},
];
//* Room Columns
export const roomColumns = (): ColumnDef<IRoomTableData>[] => [
	{
		accessorKey: 'name',
		header: 'Name',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'warehouse_name',
		header: 'Warehouse',
		enableColumnFilter: false,
	},
];

//* Rack Columns
export const rackColumns = (): ColumnDef<IRackTableData>[] => [
	{
		accessorKey: 'name',
		header: 'Name',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'room_name',
		header: 'Room',
		enableColumnFilter: false,
	},
];

//* Floor Columns
export const floorColumns = (): ColumnDef<IFloorTableData>[] => [
	{
		accessorKey: 'name',
		header: 'Name',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'rack_name',
		header: 'Rack',
		enableColumnFilter: false,
	},
];

//* Box Columns
export const boxColumns = (): ColumnDef<IBoxTableData>[] => [
	{
		accessorKey: 'name',
		header: 'Name',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'floor_name',
		header: 'Rack',
		enableColumnFilter: false,
	},
];

//* Bill
export const billColumns = (
	handleStatus: (row: Row<any>, value: number) => void,
	handlePaid: (row: Row<any>) => void
): ColumnDef<IBillInfo>[] => [
	{
		accessorKey: 'bill_id',
		header: 'ID',
		enableColumnFilter: false,
		cell: (info) => {
			const uuid = info.row.original.uuid;
			return (
				<CustomLink
					url={`/store/product-order/${uuid}/details`}
					label={info.getValue() as string}
					openInNewTab={true}
				/>
			);
		},
	},
	{
		accessorKey: 'bill_status',
		header: 'Status',
		enableColumnFilter: false,
		cell: (info) => {
			return (
				<ReactSelect
					value={order_status?.find((item) => item.value === info.getValue())}
					options={order_status}
					menuPortalTarget={document.body}
					styles={{
						menuPortal: (base) => ({ ...base, zIndex: 999 }),
					}}
					isClearable={false}
					onChange={(value: any) => handleStatus(info.row, value.value as number)}
				/>
			);
		},
	},
	{
		accessorKey: 'is_ship_different',
		header: 'Ship Different',
		enableColumnFilter: false,
		cell: (info) => <StatusButton value={info.getValue() as boolean} />,
	},
	{
		accessorKey: 'is_paid',
		header: 'Paid',
		enableColumnFilter: false,
		cell: (info) => <Switch checked={info.getValue() as boolean} onCheckedChange={() => handlePaid(info.row)} />,
	},
	{
		accessorFn: (row) => row.name + ' - ' + row.phone,
		header: 'Customer',
		size: 200,
		enableColumnFilter: false,
		cell: (info) => {
			const { name, phone } = info.row.original;

			return (
				<div className='flex items-center gap-2'>
					<UserNamePhone user_name={name} phone={phone} />
				</div>
			);
		},
	},
	{
		accessorKey: 'email',
		header: 'Email',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'address',
		header: 'Address',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'city',
		header: 'City',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'district',
		header: 'District',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'note',
		header: 'Note',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'payment_method',
		header: 'Payment Method',
		enableColumnFilter: false,
	},
];
interface IOrderDetailsColumnsProps {
	dynamicColumns?: string[];
}

export const OrderDetailsColumns = ({ dynamicColumns = [] }: IOrderDetailsColumnsProps = {}): ColumnDef<IOrdered>[] => {
	const baseColumns: ColumnDef<IOrdered>[] = [
		{
			accessorKey: 'product_title',
			header: 'Product',
			enableColumnFilter: false,
			size: 200,
		},
	];

	// Generate dynamic columns for variant attributes
	const variantColumns: ColumnDef<IOrdered>[] = dynamicColumns.map((columnName) => ({
		accessorKey: columnName as keyof IOrdered,
		header: columnName.charAt(0) + columnName.slice(1),
		enableColumnFilter: false,
		cell: (info) => {
			const value = info.getValue();

			return <span>{value as string}</span>;
		},
	}));

	const endColumns: ColumnDef<IOrdered>[] = [
		{
			accessorKey: 'quantity',
			header: 'Quantity',
			enableColumnFilter: false,
			cell: (info) => {
				const value = info.getValue() as number;
				return <span className='font-medium'>{value}</span>;
			},
		},
		{
			accessorKey: 'selling_price',
			header: 'Selling Price',
			enableColumnFilter: false,
			cell: (info) => {
				const value = info.getValue() as number;
				return <span>{value.toLocaleString()}</span>;
			},
		},
		{
			accessorFn: (row) => row.quantity * row.selling_price,
			header: 'Total',
			enableColumnFilter: false,
			cell: (info) => {
				const value = info.getValue() as number;
				return <span>{value.toLocaleString()}</span>;
			},
		},

		{
			accessorKey: 'product_serial',
			header: 'Serial',
			enableColumnFilter: false,
		},
	];

	return [...baseColumns, ...variantColumns, ...endColumns];
};
