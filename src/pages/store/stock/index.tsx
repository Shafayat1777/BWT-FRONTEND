import { lazy, useMemo, useState } from 'react';
import { PageProvider, TableProvider } from '@/context';
import { Row } from '@tanstack/react-table';
import useAccess from '@/hooks/useAccess';

import { PageInfo } from '@/utils';
import renderSuspenseModals from '@/utils/renderSuspenseModals';

import { stockColumns } from '../_config/columns';
import { IStockActionTrx, IStockTableData } from '../_config/columns/columns.type';
import { useStoreStocks } from '../_config/query';

const AgainstTrx = lazy(() => import('./trx'));
const AddOrUpdate = lazy(() => import('./add-or-update'));
const DeleteModal = lazy(() => import('@core/modal/delete'));
const DeleteAllModal = lazy(() => import('@core/modal/delete/all'));

const Stock = () => {
	const { data, isLoading, url, deleteData, postData, updateData, refetch } = useStoreStocks<IStockTableData[]>();

	const pageInfo = useMemo(() => new PageInfo('Store/Stock', url, 'store__stock'), [url]);

	const pageAccess = useAccess(pageInfo.getTab() as string) as string[];
	const actionTrxAccess = pageAccess.includes('click_trx');

	// Add/Update Modal state
	const [isOpenAddModal, setIsOpenAddModal] = useState(false);

	const handleCreate = () => {
		setIsOpenAddModal(true);
	};

	const [updatedData, setUpdatedData] = useState<IStockTableData | null>(null);

	const handleUpdate = (row: Row<IStockTableData>) => {
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
	const handleDelete = (row: Row<IStockTableData>) => {
		setDeleteItem({
			id: row?.original?.uuid,
			name: row?.original?.stock_id,
		});
	};

	// Delete All Item
	const [deleteItems, setDeleteItems] = useState<{ id: string; name: string; checked: boolean }[] | null>(null);

	// Delete All Row Handlers
	const handleDeleteAll = (rows: Row<IStockTableData>[]) => {
		const selectedRows = rows.map((row) => row.original);

		setDeleteItems(
			selectedRows.map((row) => ({
				id: row.uuid,
				name: row.stock_id,
				checked: true,
			}))
		);
	};

	// Action Trx Modal state
	const [isOpenActionTrxModal, setIsOpenActionTrxModal] = useState(false);
	const [updateActionTrxData, setUpdateActionTrxData] = useState<IStockActionTrx | null>(null);

	const handleAgainstTrx = (row: Row<IStockTableData>) => {
		setUpdateActionTrxData({
			uuid: row.original.uuid,
			name: row.original.product_name,
		});
		setIsOpenActionTrxModal(true);
	};

	// Table Columns
	const columns = stockColumns({ actionTrxAccess, handleAgainstTrx });

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
					<AgainstTrx
						{...{
							open: isOpenActionTrxModal,
							setOpen: setIsOpenActionTrxModal,
							updatedData: updateActionTrxData,
							setUpdatedData: setUpdateActionTrxData,
							postData,
							url: '/store/internal-transfer',
						}}
					/>,
				])}
			</TableProvider>
		</PageProvider>
	);
};

export default Stock;
