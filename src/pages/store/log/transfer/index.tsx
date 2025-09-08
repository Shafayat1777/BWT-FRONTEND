import { lazy, useMemo, useState } from 'react';
import { PageProvider, TableProvider } from '@/context';
import { transferColumns } from '@/pages/store/_config/columns';
import { IStockActionTrx, ITransferTableData } from '@/pages/store/_config/columns/columns.type';
import { useStoreOrderTransfers, useStoreProducts } from '@/pages/store/_config/query';
import { Row } from '@tanstack/react-table';

import { PageInfo } from '@/utils';
import renderSuspenseModals from '@/utils/renderSuspenseModals';

const AddOrUpdate = lazy(() => import('./add-or-update'));
const DeleteModal = lazy(() => import('@core/modal/delete'));
const DeleteAllModal = lazy(() => import('@core/modal/delete/all'));

const Transfer = () => {
	const { data, isLoading, url, deleteData, postData, updateData, refetch } =
		useStoreOrderTransfers<ITransferTableData[]>();

	const { invalidateQuery: invalidateProduct } = useStoreProducts();

	const pageInfo = useMemo(() => new PageInfo('Store/Log -> Order Against Transfer', url, 'store__log'), [url]);

	// Add/Update Modal state
	const [isOpenAddModal, setIsOpenAddModal] = useState(false);

	const [updatedData, setUpdatedData] = useState<IStockActionTrx | null>(null);

	const handleUpdate = (row: Row<ITransferTableData>) => {
		setUpdatedData({
			uuid: row.original.uuid,
			name: row.original.order_id,
			max_quantity: row.original.max_quantity,
			product_uuid: row.original.product_uuid,
			warehouse_uuid: row.original.warehouse_uuid,
		});

		setIsOpenAddModal(true);
	};

	// Delete Modal state
	// Single Delete Item
	const [deleteItem, setDeleteItem] = useState<{
		id: string;
		name: string;
	} | null>(null);

	// Single Delete Handler
	const handleDelete = (row: Row<ITransferTableData>) => {
		setDeleteItem({
			id: row?.original?.uuid,
			name: row?.original?.order_id,
		});
	};

	// Delete All Item
	const [deleteItems, setDeleteItems] = useState<{ id: string; name: string; checked: boolean }[] | null>(null);

	// Delete All Row Handlers
	const handleDeleteAll = (rows: Row<ITransferTableData>[]) => {
		const selectedRows = rows.map((row) => row.original);

		setDeleteItems(
			selectedRows.map((row) => ({
				id: row.uuid,
				name: row.order_id,
				checked: true,
			}))
		);
	};

	// Table Columns
	const columns = transferColumns();

	return (
		<PageProvider pageName={pageInfo.getTab()} pageTitle={pageInfo.getTabName()}>
			<TableProvider
				title={pageInfo.getTitle()}
				columns={columns}
				data={data ?? []}
				isLoading={isLoading}
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
							updateData,
						}}
					/>,

					<DeleteModal
						{...{
							deleteItem,
							setDeleteItem,
							invalidateQueries: invalidateProduct,
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

export default Transfer;
