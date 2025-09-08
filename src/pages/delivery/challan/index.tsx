import { lazy, useMemo, useState } from 'react';
import { PageProvider, TableProvider } from '@/context';
import { Row } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import useAccess from '@/hooks/useAccess';

import { getDateTime, PageInfo } from '@/utils';
import renderSuspenseModals from '@/utils/renderSuspenseModals';

import { challanColumns } from '../_config/columns';
import { IChallanTableData } from '../_config/columns/columns.type';
import { type1FacetedFilters } from '../_config/columns/facetedFilters'; // TODO: Import faceted filters (Optional)
import { useDeliveryChallan } from '../_config/query';

const DeleteModal = lazy(() => import('@core/modal/delete'));

const Challan = () => {
	const navigate = useNavigate();
	const { data, isLoading, url, updateData, deleteData, refetch } = useDeliveryChallan<IChallanTableData[]>();

	const pageInfo = useMemo(() => new PageInfo('Delivery/Challan', url, 'delivery__challan'), [url]);
	const pageAccess = useAccess('delivery__challan') as string[];
	const haveDeliveryAccess = pageAccess.includes('click_delivery_complete');

	const handleCreate = () => navigate('/delivery/challan/add');
	const handleUpdate = (row: Row<IChallanTableData>) => {
		navigate(`/delivery/challan/update/${row.original.uuid}`);
	};

	// Delete Modal state
	// Single Delete Item
	const [deleteItem, setDeleteItem] = useState<{
		id: string;
		name: string;
	} | null>(null);

	// Single Delete Handler
	const handleDelete = (row: Row<IChallanTableData>) => {
		setDeleteItem({
			id: row?.original?.uuid,
			name: row?.original?.id,
		});
	};

	const handleDeliveryComplete = async (row: Row<IChallanTableData>) => {
		const is_delivery_complete = !row?.original?.is_delivery_complete;
		const updated_at = getDateTime();

		await updateData.mutateAsync({
			url: `/delivery/challan/${row?.original?.uuid}`,
			updatedData: { is_delivery_complete, updated_at },
		});
	};

	// Table Columns
	const columns = challanColumns(handleDeliveryComplete, haveDeliveryAccess);
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
				])}
			</TableProvider>
		</PageProvider>
	);
};

export default Challan;
