import { lazy, useMemo, useState } from 'react';
import { PageProvider, TableProvider } from '@/context';
import { Row } from '@tanstack/react-table';
import useAccess from '@/hooks/useAccess';

import ReactSelect from '@/components/ui/react-select';

import { getDateTime, PageInfo } from '@/utils';
import renderSuspenseModals from '@/utils/renderSuspenseModals';

import { userColumns } from '../_config/columns';
import { IPageAssign, IResetPassword, IUserTableData } from '../_config/columns/columns.type';
import { useHrUsers } from '../_config/query';

const AddOrUpdate = lazy(() => import('./add-or-update'));
const ResetPassword = lazy(() => import('./reset-password'));
const PageAssign = lazy(() => import('./page-assign'));
const DeleteModal = lazy(() => import('@core/modal/delete'));
const DeleteAllModal = lazy(() => import('@core/modal/delete/all'));

const User = () => {
	const [status, setStatus] = useState<boolean | undefined>(undefined);
	const handleChangeStatus = () => setStatus(!status);
	const handleClearStatus = () => setStatus(undefined);
	const [type, setType] = useState('customer');
	let query;
	if (type && status !== undefined) {
		query = `status=${status}&user_type=${type}`;
	} else if (type) {
		query = `user_type=${type}`;
	} else if (status !== undefined) {
		query = `status=${status}`;
	}

	const { data, isLoading, url, deleteData, postData, updateData, refetch } = useHrUsers<IUserTableData[]>(query);

	const pageInfo = useMemo(() => new PageInfo('Admin/User', url, 'admin__user'), [url]);

	const pageAccess = useAccess(pageInfo.getTab() as string) as string[];
	const statusAccess = pageAccess.includes('click_status');
	const resetPasswordAccess = pageAccess.includes('click_reset_password');
	const pageAssignAccess = pageAccess.includes('click_page_assign');
	const ratingChangeAccess = pageAccess.includes('click_rating_change');
	const typeOptions = [
		{
			label: 'Customer',
			value: 'customer',
		},
		{
			label: 'Vendor',
			value: 'vendor',
		},
		{
			label: 'Employee',
			value: 'employee',
		},
	];

	// Add/Update Modal state
	const [isOpenAddModal, setIsOpenAddModal] = useState(false);

	const handleCreate = () => {
		setIsOpenAddModal(true);
	};

	const [updatedData, setUpdatedData] = useState<IUserTableData | null>(null);
	const handleUpdate = (row: Row<IUserTableData>) => {
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
	const handleDelete = (row: Row<IUserTableData>) => {
		setDeleteItem({
			id: row?.original?.uuid,
			name: row?.original?.name,
		});
	};

	// Delete All Item
	const [deleteItems, setDeleteItems] = useState<{ id: string; name: string; checked: boolean }[] | null>(null);

	// Delete All Row Handlers
	const handleDeleteAll = (rows: Row<IUserTableData>[]) => {
		const selectedRows = rows.map((row) => row.original);

		setDeleteItems(
			selectedRows.map((row) => ({
				id: row.uuid,
				name: row.name,
				checked: true,
			}))
		);
	};

	// Action Trx Modal state
	const [isOpenResetPasswordModal, setIsOpenResetPasswordModal] = useState(false);
	const [updateResetPasswordData, setUpdateResetPasswordData] = useState<IResetPassword | null>(null);

	// Reset Password Handler
	const handleResetPassword = (row: Row<IUserTableData>) => {
		setUpdateResetPasswordData({
			uuid: row.original.uuid,
			name: row.original.name,
		});
		setIsOpenResetPasswordModal(true);
	};

	// Action Against Order Modal state
	const [isOpenPageAssignModal, setIsOpenPageAssignModal] = useState(false);
	const [updatePageAssignData, setUpdatePageAssignData] = useState<IPageAssign | null>(null);

	// Page Assign Handler
	const handlePageAssign = (row: Row<IUserTableData>) => {
		setUpdatePageAssignData({
			uuid: row.original.uuid,
			name: row.original.name,
		});
		setIsOpenPageAssignModal(true);
	};

	// Status Handler
	const handleStatus = async (row: Row<IUserTableData>) => {
		const status = Number(row?.original?.status) === 1 ? 0 : 1;
		const updated_at = getDateTime();

		await updateData.mutateAsync({
			url: `/hr/user/status/${row?.original?.uuid}`,
			updatedData: { status, updated_at },
		});
	};
	const handlePriceRating = async (row: Row<IUserTableData>, value: number) => {
		const price = value;
		const updated_at = getDateTime();

		await updateData.mutateAsync({
			url: `/hr/user/rating-price/${row?.original?.uuid}`,
			updatedData: { price, updated_at },
		});
	};
	const handleRating = async (row: Row<IUserTableData>, value: number) => {
		const rating = value;
		const updated_at = getDateTime();

		await updateData.mutateAsync({
			url: `/hr/user/rating-price/${row?.original?.uuid}`,
			updatedData: { rating, updated_at },
		});
	};

	// Table Columns
	const columns = userColumns({
		statusAccess,
		handleStatus,
		ratingChangeAccess,
		resetPasswordAccess,
		handleResetPassword,
		pageAssignAccess,
		handlePageAssign,
		handlePriceRating,
		handleRating,
	});

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
				otherToolBarComponents={
					<ReactSelect
						options={typeOptions || []}
						value={typeOptions?.find((option) => option.value === type)}
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
							url: '/hr/user',
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
							url: '/hr/user',
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

					<ResetPassword
						{...{
							open: isOpenResetPasswordModal,
							setOpen: setIsOpenResetPasswordModal,
							updatedData: updateResetPasswordData,
							setUpdatedData: setUpdateResetPasswordData,
							updateData,
							url: `/hr/user/password/${updateResetPasswordData?.uuid}`,
						}}
					/>,
					<PageAssign
						{...{
							open: isOpenPageAssignModal,
							setOpen: setIsOpenPageAssignModal,
							updatedData: updatePageAssignData,
							setUpdatedData: setUpdatePageAssignData,
							updateData,
							url: `/hr/user/can-access/${updatePageAssignData?.uuid}`,
						}}
					/>,
				])}
			</TableProvider>
		</PageProvider>
	);
};

export default User;
