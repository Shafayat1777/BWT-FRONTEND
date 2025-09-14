import { lazy, useMemo, useState } from 'react';
import { PageProvider, TableProvider } from '@/context';
import { Row } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';

import { getDateTime, getRandomPreviousDate, PageInfo } from '@/utils';
import renderSuspenseModals from '@/utils/renderSuspenseModals';

import { accessoriesColumns } from '../_config/columns';
import { IAccessories } from '../_config/columns/columns.type';
import { type1FacetedFilters } from '../_config/columns/facetedFilters';
import { useAccessories } from '../_config/query';

const AddOrUpdate = lazy(() => import('./add-or-update'));
const DeleteModal = lazy(() => import('@core/modal/delete'));

const Purchase = () => {
	const navigate = useNavigate();
	const { data, isLoading, url, imagePostData, imageUpdateData, updateData, deleteData, refetch } =
		useAccessories<IAccessories[]>();

	const pageInfo = useMemo(() => new PageInfo('Store/Accessories Order', url, 'store__accessories_order'), [url]);

	const [isOpenAddModal, setIsOpenAddModal] = useState(false);
	// const handleCreate = () => navigate('/store/purchase/add');
	const [updatedData, setUpdatedData] = useState<IAccessories | null>(null);

	const handleUpdate = (row: Row<IAccessories>) => {
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
	const handleDelete = (row: Row<IAccessories>) => {
		setDeleteItem({
			id: row?.original?.uuid,
			name: row?.original?.accessories_id,
		});
	};
	const handleStatus = async (row: Row<IAccessories>, value: number) => {
		const status = value;
		const updated_at = getDateTime();

		await updateData.mutateAsync({
			url: `/store/accessories-without-form/${row?.original?.uuid}`,
			updatedData: { status, updated_at },
		});
	};

	// Table Columns
	const columns = accessoriesColumns(handleStatus);
	return (
		<PageProvider pageName={pageInfo.getTab()} pageTitle={pageInfo.getTabName()}>
			<TableProvider
				title={pageInfo.getTitle()}
				columns={columns}
				data={data ?? []}
				isLoading={isLoading}
				handleDelete={handleDelete}
				handleRefetch={refetch}
				facetedFilters={type1FacetedFilters}
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
							imagePostData,
							imageUpdateData,
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
				])}
			</TableProvider>
		</PageProvider>
	);
};

export default Purchase;
