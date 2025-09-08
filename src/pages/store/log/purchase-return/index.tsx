import { lazy, useMemo, useState } from 'react';
import { PageProvider, TableProvider } from '@/context';
import { purchaseReturnEntryColumns } from '@/pages/store/_config/columns';
import { IPurchaseReturnEntryTableData } from '@/pages/store/_config/columns/columns.type';
import { useStorePurchaseReturnEntry } from '@/pages/store/_config/query';
import { Row } from '@tanstack/react-table';

import { PageInfo } from '@/utils';
import renderSuspenseModals from '@/utils/renderSuspenseModals';

const AddOrUpdate = lazy(() => import('./add-or-update'));
const DeleteModal = lazy(() => import('@core/modal/delete'));
const DeleteAllModal = lazy(() => import('@core/modal/delete/all'));

const PurchaseReturnLog = () => {
	const { data, isLoading, url, deleteData, postData, updateData, refetch } =
		useStorePurchaseReturnEntry<IPurchaseReturnEntryTableData[]>();

	const pageInfo = useMemo(() => new PageInfo('Store/Log->Purchase Return', url, 'store__log'), [url]);

	// Add/Update Modal state
	const [isOpenAddModal, setIsOpenAddModal] = useState(false);

	const handleCreate = () => {
		setIsOpenAddModal(true);
	};

	const [updatedData, setUpdatedData] = useState<IPurchaseReturnEntryTableData | null>(null);

	const handleUpdate = (row: Row<IPurchaseReturnEntryTableData>) => {
		setUpdatedData(row.original);
		setIsOpenAddModal(true);
	};

	// Delete Modal state
	// Single Delete Item
	const [deleteItem, setDeleteItem] = useState<{
		id: string;
		name: string;
	} | null>(null);

	// Single Delete Handler
	const handleDelete = (row: Row<IPurchaseReturnEntryTableData>) => {
		setDeleteItem({
			id: row?.original?.uuid,
			name: row?.original?.purchase_return_id,
		});
	};

	// Delete All Item
	const [deleteItems, setDeleteItems] = useState<{ id: string; name: string; checked: boolean }[] | null>(null);

	// Delete All Row Handlers
	const handleDeleteAll = (rows: Row<IPurchaseReturnEntryTableData>[]) => {
		const selectedRows = rows.map((row) => row.original);

		setDeleteItems(
			selectedRows.map((row) => ({
				id: row.uuid,
				name: row.purchase_return_id,
				checked: true,
			}))
		);
	};

	// Table Columns
	const columns = purchaseReturnEntryColumns();

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

export default PurchaseReturnLog;
