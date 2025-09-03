import { useMemo } from 'react';
import { PageProvider, TableProvider } from '@/context';
import { Row } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import useAccess from '@/hooks/useAccess';

import { getDateTime, PageInfo } from '@/utils';
import Formdata from '@/utils/formdata';

import { RepairingColumns } from '../_config/columns';
import { IOrderTableData } from '../_config/columns/columns.type';
import { useWorkRepairing } from '../_config/query';

const Order = () => {
	const { data, isLoading, url, updateData, refetch } = useWorkRepairing<IOrderTableData[]>();
	const navigate = useNavigate();

	const pageInfo = useMemo(() => new PageInfo('Work/Repairing', url, 'work__repairing'), [url]);
	const pageAccess = useAccess('work__repairing') as string[];
	const haveDeliveryAccess = pageAccess?.includes('click_transfer_delivery');
	const haveQCAccess = pageAccess?.includes('click_transfer_qc');
	const actionTrxAccess = pageAccess.includes('click_trx');

	// Add/Update Modal state

	const handleUpdate = (row: Row<IOrderTableData>) => {
		navigate(`/work/repairing/update/${row.original.uuid}`);
	};

	// Table Columns

	const handelDeliveryStatusChange = async (row: Row<IOrderTableData>) => {
		const formData = {
			is_ready_for_delivery: !row.original.is_ready_for_delivery,
			ready_for_delivery_date: row.original.is_ready_for_delivery ? null : getDateTime(),
		};
		await updateData.mutateAsync({
			url: `/work/order-without-form/${row.original.uuid}`,
			updatedData: formData,
			isOnCloseNeeded: false,
		});
	};

	const handelQCStatusChange = async (row: Row<IOrderTableData>) => {
		await updateData.mutateAsync({
			url: `/work/order-without-form/${row.original.uuid}`,
			updatedData: {
				is_transferred_for_qc: !row.original.is_transferred_for_qc,
			},
			isOnCloseNeeded: false,
		});
	};
	const handleAgainstTrx = (row: Row<IOrderTableData>) => {
		navigate(`/work/transfer-section/${row.original.info_uuid}/${null}/${row.original.uuid}`);
	};
	const columns = RepairingColumns({
		handelDeliveryStatusChange,
		haveDeliveryAccess,
		handelQCStatusChange,
		haveQCAccess,
		actionTrxAccess,
		handleAgainstTrx,
	});

	return (
		<PageProvider pageName={pageInfo.getTab()} pageTitle={pageInfo.getTabName()}>
			<TableProvider
				title={pageInfo.getTitle()}
				columns={columns}
				data={data ?? []}
				isLoading={isLoading}
				handleUpdate={handleUpdate}
				handleRefetch={refetch}
				defaultVisibleColumns={{ updated_at: false, created_at: false, created_by_name: false }}
			></TableProvider>
		</PageProvider>
	);
};

export default Order;
