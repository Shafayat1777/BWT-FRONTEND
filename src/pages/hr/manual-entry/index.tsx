import { lazy, useMemo, useState } from 'react';
import { PageProvider, TableProvider } from '@/context';
import { Row } from '@tanstack/react-table';

import ReactSelect from '@/components/ui/react-select';

import { PageInfo } from '@/utils';
import renderSuspenseModals from '@/utils/renderSuspenseModals';

import { manualEntryColumns } from '../_config/columns';
import { IManualEntryTableData } from '../_config/columns/columns.type';
import { useHrManualEntry } from '../_config/query';

const AddOrUpdate = lazy(() => import('./add-or-update'));
const DeleteModal = lazy(() => import('@core/modal/delete'));

const ManualEntry = () => {
	const [type, setType] = useState('all');
	const status = [
		{
			value: 'all',
			label: 'All',
		},
		{
			value: 'pending',
			label: 'Pending',
		},
		{
			value: 'approved',
			label: 'Approved',
		},
		{
			value: 'rejected',
			label: 'Rejected',
		},
	];
	const { data, isLoading, url, deleteData, postData, updateData, refetch } = useHrManualEntry<
		IManualEntryTableData[]
	>(`${type === 'all' ? '' : `approval=${type}`}`);

	const pageInfo = useMemo(() => new PageInfo('HR/Manual Entry', url, 'admin__manual_entry'), [url]);

	// Add/Update Modal state
	const [isOpenAddModal, setIsOpenAddModal] = useState(false);

	const handleCreate = () => {
		setIsOpenAddModal(true);
	};

	const [updatedData, setUpdatedData] = useState<IManualEntryTableData | null>(null);

	const handleUpdate = (row: Row<IManualEntryTableData>) => {
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
	const handleDelete = (row: Row<IManualEntryTableData>) => {
		setDeleteItem({
			id: row?.original?.uuid,
			name: row?.original?.employee_name,
		});
	};

	// Table Columns
	const columns = manualEntryColumns();

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
				otherToolBarComponents={
					<ReactSelect
						options={status || []}
						value={status?.find((option) => option.value === type)}
						menuPortalTarget={document.body}
						styles={{
							menuPortal: (base) => ({ ...base, zIndex: 999 }),
							control: (base) => ({ ...base, minWidth: 120 }),
						}}
						onChange={(e: any) => {
							setType(e?.value);
						}}
					/>
				}
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
				])}
			</TableProvider>
		</PageProvider>
	);
};

export default ManualEntry;
