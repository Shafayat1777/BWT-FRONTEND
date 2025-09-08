import { lazy, useMemo, useState } from 'react';
import { PageProvider, TableProvider } from '@/context';
import { Row } from '@tanstack/react-table';

import { getDateTime, PageInfo } from '@/utils';
import Formdata from '@/utils/formdata';
import renderSuspenseModals from '@/utils/renderSuspenseModals';

import { IManualEntryLogTableData } from '../_config/columns/columns.type';
import { useHrManualEntryLog } from '../_config/query';
import { manualEntryLogColumns } from './_config/columns';

const AddOrUpdate = lazy(() => import('./add-or-update'));

const DeleteModal = lazy(() => import('@core/modal/delete'));
const DeleteAllModal = lazy(() => import('@core/modal/delete/all'));

const Index = () => {
	const [status, setStatus] = useState<boolean | undefined>(undefined);
	const handleChangeStatus = () => setStatus(!status);
	const handleClearStatus = () => setStatus(undefined);

	const { data, isLoading, url, deleteData, postData, updateData, refetch } = useHrManualEntryLog<
		IManualEntryLogTableData[]
	>('type=manual_entry&approval=pending');

	// Add/Update Modal state
	const [isOpenAddModal, setIsOpenAddModal] = useState(false);

	const handleCreate = () => {
		setIsOpenAddModal(true);
	};

	const [updatedData, setUpdatedData] = useState<IManualEntryLogTableData | null>(null);
	const handleUpdate = (row: Row<IManualEntryLogTableData>) => {
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
	const handleDelete = (row: Row<IManualEntryLogTableData>) => {
		setDeleteItem({
			id: row?.original?.uuid,
			name: row?.original?.employee_name,
		});
	};

	// Delete All Item
	const [deleteItems, setDeleteItems] = useState<{ id: string; name: string; checked: boolean }[] | null>(null);

	// Delete All Row Handlers
	const handleDeleteAll = (rows: Row<IManualEntryLogTableData>[]) => {
		const selectedRows = rows.map((row) => row.original);

		setDeleteItems(
			selectedRows.map((row) => ({
				id: row.uuid,
				name: row.employee_name,
				checked: true,
			}))
		);
	};

	const handleApprove = async (row: Row<IManualEntryLogTableData>) => {
		await updateData.mutateAsync({
			url: `/hr/manual-entry/${row.original.uuid}`,
			updatedData: {
				approval: 'approved',
				updated_at: getDateTime(),
			},
		});
	};

	const handleReject = async (row: Row<IManualEntryLogTableData>) => {
		await updateData.mutateAsync({
			url: `/hr/manual-entry/${row.original.uuid}`,
			updatedData: {
				approval: 'rejected',
				updated_at: getDateTime(),
			},
		});
	};

	const types = [
		{
			label: 'Approved',
			value: 'approved',
		},
		{
			label: 'Rejected',
			value: 'rejected',
		},
	];

	// Table Columns
	const columns = manualEntryLogColumns({
		handleApprove,
		handleReject,
		types,
	});

	return (
		<div>
			<TableProvider
				title={'Manual Entry'}
				columns={columns}
				data={data ?? []}
				isLoading={isLoading}
				advanceFilters={[
					{
						label: 'Status',
						state: status,
						onStateChange: handleChangeStatus,
						clear: handleClearStatus,
					},
				]}
				handleRefetch={refetch}
				toolbarOptions={[
					'export-csv',
					'export-pdf',
					'all-filter',
					'date-range',
					'refresh',
					'advance-filter',
					'other',
				]}
				defaultVisibleColumns={{ updated_at: false, created_by_name: false }}
			>
				{/* {renderSuspenseModals([
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
                ])} */}
			</TableProvider>
		</div>
	);
};

export default Index;
