import { lazy, useMemo, useState } from 'react';
import { PageProvider, TableProvider } from '@/context';
import { Row } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import useAccess from '@/hooks/useAccess';

import { useOtherWarehouse } from '@/lib/common-queries/other';
import { PageInfo } from '@/utils';
import renderSuspenseModals from '@/utils/renderSuspenseModals';

import { productColumns } from '../_config/columns';
import { IProductTableData, IStockActionTrx } from '../_config/columns/columns.type';
import { useStoreProducts } from '../_config/query';

const AgainstTrx = lazy(() => import('./trx'));

const AddOrUpdate = lazy(() => import('./add-or-update'));
const DeleteModal = lazy(() => import('@core/modal/delete'));
const DeleteAllModal = lazy(() => import('@core/modal/delete/all'));

const Product = () => {
	const navigate = useNavigate();
	const { data, isLoading, url, deleteData, postData, updateData, refetch } = useStoreProducts<IProductTableData[]>();
	const { data: warehouse } = useOtherWarehouse<{ label: string; value: string; assigned: string }[]>();
	const pageInfo = useMemo(() => new PageInfo('Store/Product', url, 'store__product'), [url]);
	const pageAccess = useAccess(pageInfo.getTab() as string) as string[];
	const actionTrxAccess = pageAccess.includes('click_trx');
	const actionOrderAgainstTrxAccess = pageAccess.includes('click_order_trx');
	// Add/Update Modal state
	const [isOpenAddModal, setIsOpenAddModal] = useState(false);

	const handleCreate = () => {
		setIsOpenAddModal(true);
	};

	const [updatedData, setUpdatedData] = useState<IProductTableData | null>(null);

	const handleUpdate = (row: Row<IProductTableData>) => {
		setUpdatedData({ ...row.original });
		setIsOpenAddModal(true);
	};

	// Delete Modal state
	// Single Delete Item
	const [deleteItem, setDeleteItem] = useState<{
		id: string;
		name: string;
	} | null>(null);

	// Single Delete Handler
	const handleDelete = (row: Row<IProductTableData>) => {
		setDeleteItem({
			id: row?.original?.uuid,
			name: row?.original?.name,
		});
	};

	// Delete All Item
	const [deleteItems, setDeleteItems] = useState<{ id: string; name: string; checked: boolean }[] | null>(null);

	// Delete All Row Handlers
	const handleDeleteAll = (rows: Row<IProductTableData>[]) => {
		const selectedRows = rows.map((row) => row.original);

		setDeleteItems(
			selectedRows.map((row) => ({
				id: row.uuid,
				name: row.name,
				checked: true,
			}))
		);
	};
	// Action Trx Modal state
	const [isOpenActionTrxModal, setIsOpenActionTrxModal] = useState(false);
	const [updateActionTrxData, setUpdateActionTrxData] = useState<IStockActionTrx | null>(null);

	const handleAgainstTrx = (row: Row<IProductTableData>) => {
		setUpdateActionTrxData({
			uuid: row.original.uuid,
			name: row.original.name,
		});
		setIsOpenActionTrxModal(true);
		navigate(`/store/internal-transfer/${row.original.uuid}`);
	};
	
	const handleOrderAgainstWarehouseTrx = (
		row: Row<IProductTableData>,
		warehouseKey:
			| 'warehouse_1'
			| 'warehouse_2'
			| 'warehouse_3'
			| 'warehouse_4'
			| 'warehouse_5'
			| 'warehouse_5'
			| 'warehouse_6'
			| 'warehouse_7'
			| 'warehouse_8'
			| 'warehouse_9'
			| 'warehouse_10'
			| 'warehouse_11'
			| 'warehouse_12',
		warehouseUuidKey:
			| 'warehouse_1_uuid'
			| 'warehouse_2_uuid'
			| 'warehouse_3_uuid'
			| 'warehouse_4_uuid'
			| 'warehouse_5_uuid'
			| 'warehouse_6_uuid'
			| 'warehouse_7_uuid'
			| 'warehouse_8_uuid'
			| 'warehouse_9_uuid'
			| 'warehouse_10_uuid'
			| 'warehouse_11_uuid'
			| 'warehouse_12_uuid'
	) => {
		navigate(`/store/product/${row.original.uuid}/order-against-warehouse-trx/${row.original[warehouseUuidKey]}`);
	};

	// Table Columns
	const columns = productColumns({
		actionTrxAccess,
		actionOrderAgainstTrxAccess,
		warehouse,
		handleAgainstTrx,
		handleOrderAgainstWarehouse1Trx: (row) =>
			handleOrderAgainstWarehouseTrx(row, 'warehouse_1', 'warehouse_1_uuid'),
		handleOrderAgainstWarehouse2Trx: (row) =>
			handleOrderAgainstWarehouseTrx(row, 'warehouse_2', 'warehouse_2_uuid'),
		handleOrderAgainstWarehouse3Trx: (row) =>
			handleOrderAgainstWarehouseTrx(row, 'warehouse_3', 'warehouse_3_uuid'),
		handleOrderAgainstWarehouse4Trx: (row) =>
			handleOrderAgainstWarehouseTrx(row, 'warehouse_4', 'warehouse_4_uuid'),
		handleOrderAgainstWarehouse5Trx: (row) =>
			handleOrderAgainstWarehouseTrx(row, 'warehouse_5', 'warehouse_5_uuid'),
		handleOrderAgainstWarehouse6Trx: (row) =>
			handleOrderAgainstWarehouseTrx(row, 'warehouse_6', 'warehouse_6_uuid'),
		handleOrderAgainstWarehouse7Trx: (row) =>
			handleOrderAgainstWarehouseTrx(row, 'warehouse_7', 'warehouse_7_uuid'),
		handleOrderAgainstWarehouse8Trx: (row) =>
			handleOrderAgainstWarehouseTrx(row, 'warehouse_8', 'warehouse_8_uuid'),
		handleOrderAgainstWarehouse9Trx: (row) =>
			handleOrderAgainstWarehouseTrx(row, 'warehouse_9', 'warehouse_9_uuid'),
		handleOrderAgainstWarehouse10Trx: (row) =>
			handleOrderAgainstWarehouseTrx(row, 'warehouse_10', 'warehouse_10_uuid'),
		handleOrderAgainstWarehouse11Trx: (row) =>
			handleOrderAgainstWarehouseTrx(row, 'warehouse_11', 'warehouse_11_uuid'),
		handleOrderAgainstWarehouse12Trx: (row) =>
			handleOrderAgainstWarehouseTrx(row, 'warehouse_12', 'warehouse_12_uuid'),
	});

	return (
		<PageProvider pageName={pageInfo.getTab()} pageTitle={pageInfo.getTabName()}>
			<TableProvider
				title={pageInfo.getTitle()}
				columns={columns}
				data={data ?? []}
				isLoading={isLoading}
				handleCreate={handleCreate}
				handleUpdate={handleUpdate}
				handleDelete={handleDelete}
				handleRefetch={refetch}
				handleDeleteAll={handleDeleteAll}
				defaultVisibleColumns={{ updated_at: false, created_by_name: false }}
			>
				{renderSuspenseModals([
					<AddOrUpdate
						{...{
							url,
							open: isOpenAddModal,
							setOpen: setIsOpenAddModal,
							updatedData,
							setUpdatedData,
							postData,
							updateData,
						}}
					/>,

					<DeleteModal
						{...{
							deleteItem,
							setDeleteItem,
							url,
							deleteData,
						}}
					/>,
					<DeleteAllModal
						{...{
							deleteItems,
							setDeleteItems,
							url,
							deleteData,
						}}
					/>,
				])}
			</TableProvider>
		</PageProvider>
	);
};

export default Product;
