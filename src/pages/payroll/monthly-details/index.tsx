import { lazy, useMemo, useState } from 'react';
import { PageProvider, TableProvider } from '@/context';
import { Row } from '@tanstack/react-table';
import { format, getMonth, getYear } from 'date-fns';
import { FileSpreadsheet } from 'lucide-react';
import { CSVLink } from 'react-csv';
import { useNavigate } from 'react-router-dom';

import { CustomDatePicker } from '@/components/buttons/CustomDatePicker';
import MonthPickerPopover from '@/components/others/month-picker-pop-up';

import { PageInfo } from '@/utils';
import renderSuspenseModals from '@/utils/renderSuspenseModals';

import { monthlyDetailsColumns } from '../_config/columns';
import { IMonthlyDetailsTableData } from '../_config/columns/columns.type';
import { usePayrollMonthlyDetails } from '../_config/query';

const Payment = lazy(() => import('./payment'));

const ManualEntry = () => {
	const navigate = useNavigate();
	const [date, setDate] = useState<Date>(new Date());
	const [isOpenAddModal, setIsOpenAddModal] = useState(false);
	const [updatedData, setUpdatedData] = useState({});
	const { data, postData, isLoading, url, refetch } = usePayrollMonthlyDetails<IMonthlyDetailsTableData[]>(
		date.getFullYear(),
		date.getMonth() + 1
	);

	const pageInfo = useMemo(() => new PageInfo('Payroll/Monthly Details', url, 'payroll__monthly_details'), [url]);

	const handleRedirect = (row: IMonthlyDetailsTableData) => {
		navigate(`/payroll/monthly-employee-details/${row.employee_uuid}/${date.getFullYear()}/${date.getMonth() + 1}`);
	};

	const handlePayment = (row: Row<IMonthlyDetailsTableData>) => {
		setUpdatedData({ ...row.original, current_year: getYear(date), current_month: getMonth(date) + 1 });
		setIsOpenAddModal(true);
	};

	// Table Columns
	const columns = monthlyDetailsColumns({ handleRedirect, handlePayment });
	const headerData = [
		'employee_uuid',
		'employee_name',
		'joining_date',
		'joining_amount',
		'total_salary',
		'present_days',
		'late_days',
		'week_days',
		'absent_days',
		'total_holidays',
		'total_days',
		'gross_salary',
		'total_advance_salary',
		'others_deduction',
		'net_payable',
		'loan_amount',
		'month',
		'year',
		'type',
		'amount',
	];

	const csvData = [
		headerData,
		...(data?.map((row) =>
			headerData?.map((columnName) => {
				// Add conditions for month and year columns
				if (columnName === 'month') {
					return getMonth(date) + 1;
				}
				if (columnName === 'total_holidays') {
					return row.total_general_holidays + row.total_special_holidays;
				}
				if (columnName === 'loan_amount') {
					return row.total_loan_amount - row.total_paid_loan_amount;
				}
				if( columnName === 'amount') {
					return 0;
				}
				if (columnName === 'year') {
					return getYear(date);
				}
				if (columnName === 'net_payable') {
					return Math.ceil(row.net_payable);
				}
				return row[columnName as keyof IMonthlyDetailsTableData];
			})
		) || []),
	];

	return (
		<PageProvider pageName={pageInfo.getTab()} pageTitle={pageInfo.getTabName()}>
			<div className='flex flex-col gap-8'>
				<TableProvider
					title={pageInfo.getTitle()}
					columns={columns}
					data={data ?? []}
					isLoading={isLoading}
					handleRefetch={refetch}
					toolbarOptions={[
						'advance-filter',
						'all-filter',
						'export-pdf',
						'faceted-filter',
						'other',
						'refresh',
						'view',
					]}
					defaultVisibleColumns={{
						updated_at: false,
						created_by_name: false,
						created_at: false,
						actions: false,
						remarks: false,
					}}
					otherToolBarComponents={
						<>
							<MonthPickerPopover date={date} setDate={setDate} maxDate={new Date()} />
							<CSVLink
								title={`${format(date, 'MMM yyyy')} Monthly Details`}
								type='button'
								className='btn btn-warning btn-xs flex gap-1 rounded bg-primary p-2'
								data={csvData}
							>
								<FileSpreadsheet className='size-4 text-white' />
								<span className='text-xs text-slate-100'>Excel</span>
							</CSVLink>
						</>
					}
					rightColumnPinning={['payment']}
				>
					{renderSuspenseModals([
						<Payment
							{...{
								url: '/hr/salary-entry',
								open: isOpenAddModal,
								setOpen: setIsOpenAddModal,
								updatedData,
								setUpdatedData,
								postData,
							}}
						/>,
					])}
				</TableProvider>
			</div>
		</PageProvider>
	);
};

export default ManualEntry;
