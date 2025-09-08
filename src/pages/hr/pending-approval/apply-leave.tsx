import { lazy, useMemo, useState } from 'react';
import { PageProvider, TableProvider } from '@/context';
import { Row } from '@tanstack/react-table';

import { getDateTime, PageInfo } from '@/utils';
import Formdata from '@/utils/formdata';
import renderSuspenseModals from '@/utils/renderSuspenseModals';

import { IApplyLeaveLogTableData } from '../_config/columns/columns.type';
import { useHrApplyLeaveLog } from '../_config/query';
import { ILeaveApply } from '../leave/_config/schema';
import { applyLeaveLogColumns } from './_config/columns';

const AddOrUpdate = lazy(() => import('./add-or-update'));

const DeleteModal = lazy(() => import('@core/modal/delete'));
const DeleteAllModal = lazy(() => import('@core/modal/delete/all'));

const Index = () => {
	const [status, setStatus] = useState<boolean | undefined>(undefined);
	const handleChangeStatus = () => setStatus(!status);
	const handleClearStatus = () => setStatus(undefined);

	const { data, isLoading, url, deleteData, postData, updateData, imageUpdateData, refetch } =
		useHrApplyLeaveLog<IApplyLeaveLogTableData[]>('approval=pending');

	// Add/Update Modal state
	const [isOpenAddModal, setIsOpenAddModal] = useState(false);

	const handleCreate = () => {
		setIsOpenAddModal(true);
	};

	const [updatedData, setUpdatedData] = useState<IApplyLeaveLogTableData | null>(null);
	const handleUpdate = (row: Row<IApplyLeaveLogTableData>) => {
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
	const handleDelete = (row: Row<IApplyLeaveLogTableData>) => {
		setDeleteItem({
			id: row?.original?.uuid,
			name: row?.original?.employee_name,
		});
	};

	// Delete All Item
	const [deleteItems, setDeleteItems] = useState<{ id: string; name: string; checked: boolean }[] | null>(null);

	// Delete All Row Handlers
	const handleDeleteAll = (rows: Row<IApplyLeaveLogTableData>[]) => {
		const selectedRows = rows.map((row) => row.original);

		setDeleteItems(
			selectedRows.map((row) => ({
				id: row.uuid,
				name: row.employee_name,
				checked: true,
			}))
		);
	};

	const handleApprove = async (row: Row<IApplyLeaveLogTableData>) => {
		const formData = Formdata({
			approval: 'approved',
			updated_at: getDateTime(),
		});

		await imageUpdateData.mutateAsync({
			url: `/hr/apply-leave/${row.original.uuid}`,
			updatedData: formData,
		});
	};

	const handleReject = async (row: Row<IApplyLeaveLogTableData>) => {
		const formData = Formdata({
			approval: 'rejected',
			updated_at: getDateTime(),
		});

		await imageUpdateData.mutateAsync({
			url: `/hr/apply-leave/${row.original.uuid}`,
			updatedData: formData,
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
	const columns = applyLeaveLogColumns({
		handleApprove,
		handleReject,
		types,
	});

	return (
		<div>
			<TableProvider
				title={'Apply Leave'}
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
