import { lazy, useMemo, useState } from 'react';
import { PageProvider, TableProvider } from '@/context';
import { Row } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';

import { PageInfo } from '@/utils';
import renderSuspenseModals from '@/utils/renderSuspenseModals';

import { processColumns } from '../../_config/columns';
import { IOrderTableData, IProcessTableData } from '../../_config/columns/columns.type';
import { useWorkProcesses } from '../../_config/query';

const AddOrUpdate = lazy(() => import('./add-or-update'));
const DeleteModal = lazy(() => import('@core/modal/delete'));

const EntryTable: React.FC<{ data?: IOrderTableData; isLoading?: any }> = ({ data, isLoading }) => {
	const navigate = useNavigate();
	const { url, deleteData, postData, updateData, refetch } = useWorkProcesses<IProcessTableData[]>();

	const pageInfo = useMemo(() => new PageInfo('Process', url, 'work__process'), [url]);

	// Add/Update Modal state
	const [isOpenAddModal, setIsOpenAddModal] = useState(false);

	const handleCreate = () => {
		navigate(
			`/work/transfer-section/${data?.info_uuid}/${data?.diagnosis?.diagnosis_id}/${data?.uuid}/scanner`
		);
	};

	const [updatedData, setUpdatedData] = useState<IProcessTableData | null>(null);

	const handleUpdate = (row: Row<IProcessTableData>) => {
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
	const handleDelete = (row: Row<IProcessTableData>) => {
		setDeleteItem({
			id: row?.original?.uuid,
			name: row?.original?.process_id,
		});
	};

	// Table Columns
	const columns = processColumns();

	return (
		<PageProvider pageName={pageInfo.getTab()} pageTitle={pageInfo.getTabName()}>
			<TableProvider
				title={pageInfo.getTitle()}
				columns={columns}
				data={data?.process ?? []}
				isLoading={isLoading}
				handleCreate={handleCreate}
				handleUpdate={handleUpdate}
				handleDelete={handleDelete}
				handleRefetch={refetch}
				defaultSorting={[{ id: 'index', desc: false }]}
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
							needRefresh: true,
						}}
					/>,
				])}
			</TableProvider>
		</PageProvider>
	);
};

export default EntryTable;
