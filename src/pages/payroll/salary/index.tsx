import { lazy, useMemo, useState } from 'react';
import { PageProvider, TableProvider } from '@/context';
import { Row } from '@tanstack/react-table';
import { format } from 'date-fns';
import { FileSpreadsheet } from 'lucide-react';
import { CSVLink } from 'react-csv';
import { useNavigate } from 'react-router-dom';

import MonthPickerPopover from '@/components/others/month-picker-pop-up';

import { PageInfo } from '@/utils';
import renderSuspenseModals from '@/utils/renderSuspenseModals';

import { salaryColumns } from '../_config/columns';
import { ISalaryTableData } from '../_config/columns/columns.type';
import { usePayrollSalary } from '../_config/query';

const AddOrUpdate = lazy(() => import('./add-or-update'));
const DeleteModal = lazy(() => import('@core/modal/delete'));

const ManualEntry = () => {
	const [date, setDate] = useState(new Date());
	const { data, isLoading, url, deleteData, postData, updateData, refetch } = usePayrollSalary<ISalaryTableData[]>(
		`date=${format(date, 'yyyy-MM-dd')}`
	);
	const navigation = useNavigate();

	const pageInfo = useMemo(() => new PageInfo('Payroll/Salary', url, 'payroll__salary'), [url]);

	// Add/Update Modal state
	const [isOpenAddModal, setIsOpenAddModal] = useState(false);

	const handleCreate = () => {
		setIsOpenAddModal(true);
	};

	const [updatedData, setUpdatedData] = useState<ISalaryTableData | null>(null);

	const handleUpdate = (row: Row<ISalaryTableData>) => {
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
	const handleDelete = (row: Row<ISalaryTableData>) => {
		setDeleteItem({
			id: row?.original?.uuid,
			name: row?.original?.employee_name,
		});
	};

	// Table Columns
	const columns = salaryColumns();

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
				toolbarOptions={[
					'advance-filter',
					'all-filter',
					'export-csv',
					'export-pdf',
					'faceted-filter',
					'other',
					'refresh',
					'view',
				]}
				otherToolBarComponents={
					<>
						<MonthPickerPopover date={date} setDate={setDate} />
						<button
							className='flex items-center gap-2 rounded-sm bg-green-600 p-1 px-2'
							onClick={() => {
								navigation('/payroll/salary-upload');
							}}
						>
							<FileSpreadsheet className='size-4 text-slate-100' />
							<span className='text-xs text-slate-100'>Upload</span>.
						</button>
					</>
				}
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
