import { lazy, useMemo, useState } from 'react';
import { PageProvider, TableProvider } from '@/context';
import { Row } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';

import { PageInfo } from '@/utils';
import renderSuspenseModals from '@/utils/renderSuspenseModals';

import { productEntryColumns } from '../_config/columns';
import { IProductEntryTableData } from '../_config/columns/columns.type';
import { type1FacetedFilters } from '../_config/columns/facetedFilters';
import { useStoreProducts } from '../_config/query';

const DeleteModal = lazy(() => import('@core/modal/delete'));
const DeleteAllModal = lazy(() => import('@core/modal/delete/all'));

const Purchase = () => {
	const navigate = useNavigate();
	const { data, isLoading, url, deleteData, refetch } = useStoreProducts<IProductEntryTableData[]>();

	const pageInfo = useMemo(
		() => new PageInfo('Store/Product Entry', '/store/product-entry', 'store__product_entry'),
		[]
	);

	const handleCreate = () => navigate('/store/product-entry/add');
	const handleUpdate = (row: Row<IProductEntryTableData>) => {
		navigate(`/store/product-entry/${row.original.uuid}/update`);
	};

	// Delete Modal state
	// Single Delete Item
	const [deleteItem, setDeleteItem] = useState<{
		id: string;
		name: string;
	} | null>(null);

	// Single Delete Handler
	const handleDelete = (row: Row<IProductEntryTableData>) => {
		setDeleteItem({
			id: row?.original?.uuid,
			name: row?.original?.title,
		});
	};

	// Delete All Item
	const [deleteItems, setDeleteItems] = useState<{ id: string; name: string; checked: boolean }[] | null>(null);

	// Delete All Row Handlers
	const handleDeleteAll = (rows: Row<IProductEntryTableData>[]) => {
		const selectedRows = rows.map((row) => row.original);

		setDeleteItems(
			selectedRows.map((row) => ({
				id: row.uuid,
				name: row.title,
				checked: true,
			}))
		);
	};

	// Table Columns
	const columns = productEntryColumns();

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

export default Purchase;
