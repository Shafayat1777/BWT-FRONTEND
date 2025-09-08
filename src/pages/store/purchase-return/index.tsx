import { lazy, useMemo, useState } from 'react';
import { PageProvider, TableProvider } from '@/context';
import { Row } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';

import { getRandomPreviousDate, PageInfo } from '@/utils';
import renderSuspenseModals from '@/utils/renderSuspenseModals';

import { purchaseReturnColumns } from '../_config/columns';
import { IPurchaseReturnTableData } from '../_config/columns/columns.type';
import { type1FacetedFilters } from '../_config/columns/facetedFilters'; // TODO: Import faceted filters (Optional)
import { useStorePurchaseReturn } from '../_config/query';

const DeleteModal = lazy(() => import('@core/modal/delete'));
const DeleteAllModal = lazy(() => import('@core/modal/delete/all'));

const PurchaseReturn = () => {
	const navigate = useNavigate();
	const { data, isLoading, url, deleteData, refetch } = useStorePurchaseReturn<IPurchaseReturnTableData[]>();

	const pageInfo = useMemo(() => new PageInfo('Store/Purchase Return', url, 'store__purchase_return'), [url]);

	const handleCreate = () => navigate('/store/purchase-return/add');
	const handleUpdate = (row: Row<IPurchaseReturnTableData>) => {
		navigate(`/store/purchase-return/${row.original.uuid}/update`);
	};

	// Delete Modal state
	// Single Delete Item
	const [deleteItem, setDeleteItem] = useState<{
		id: string;
		name: string;
	} | null>(null);

	// Single Delete Handler
	const handleDelete = (row: Row<IPurchaseReturnTableData>) => {
		setDeleteItem({
			id: row?.original?.uuid,
			name: row?.original?.id,
		});
	};

	// Delete All Item
	const [deleteItems, setDeleteItems] = useState<{ id: string; name: string; checked: boolean }[] | null>(null);

	// Delete All Row Handlers
	const handleDeleteAll = (rows: Row<IPurchaseReturnTableData>[]) => {
		const selectedRows = rows.map((row) => row.original);

		setDeleteItems(
			selectedRows.map((row) => ({
				id: row.uuid,
				name: row.id,
				checked: true,
			}))
		);
	};

	// Table Columns
	const columns = purchaseReturnColumns();
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
				// TODO: Update facetedFilters (OPTIONAL)
				facetedFilters={type1FacetedFilters}
				defaultVisibleColumns={{ updated_at: false, created_by_name: false }}
			>
				{renderSuspenseModals([
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

export default PurchaseReturn;
