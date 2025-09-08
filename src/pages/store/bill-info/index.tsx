import { lazy, useMemo, useState } from 'react';
import { PageProvider, TableProvider } from '@/context';
import { Row } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';

import { getDateTime, getRandomPreviousDate, PageInfo } from '@/utils';
import renderSuspenseModals from '@/utils/renderSuspenseModals';

import { billColumns } from '../_config/columns';
import { IBillInfo } from '../_config/columns/columns.type';
import { type1FacetedFilters } from '../_config/columns/facetedFilters';
import { useStoreBillInfo } from '../_config/query';

const DeleteModal = lazy(() => import('@core/modal/delete'));

const Purchase = () => {
	const navigate = useNavigate();
	const { data, isLoading, url, updateData, deleteData, refetch } = useStoreBillInfo<IBillInfo[]>();

	const pageInfo = useMemo(() => new PageInfo('Store/Product Order', url, 'store__product_order'), [url]);

	// const handleCreate = () => navigate('/store/purchase/add');
	const handleUpdate = (row: Row<IBillInfo>) => {
		navigate(`/store/product-order/${row.original.uuid}/update`);
	};

	// Delete Modal state
	// Single Delete Item
	const [deleteItem, setDeleteItem] = useState<{
		id: string;
		name: string;
	} | null>(null);

	// Single Delete Handler
	const handleDelete = (row: Row<IBillInfo>) => {
		setDeleteItem({
			id: row?.original?.uuid,
			name: row?.original?.bill_id,
		});
	};
	const handleStatus = async (row: Row<IBillInfo>, value: number) => {
		const bill_status = value;
		const updated_at = getDateTime();

		await updateData.mutateAsync({
			url: `/store/bill-info/${row?.original?.uuid}`,
			updatedData: { bill_status, updated_at },
		});
	};
	const handlePaid = async (row: Row<IBillInfo>) => {
		const updated_at = getDateTime();
		const is_paid = !row?.original?.is_paid;

		await updateData.mutateAsync({
			url: `/store/bill-info/${row?.original?.uuid}`,
			updatedData: { is_paid, updated_at },
		});
	};
	// Table Columns
	const columns = billColumns(handleStatus, handlePaid);
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
				])}
			</TableProvider>
		</PageProvider>
	);
};

export default Purchase;
