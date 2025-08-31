import DataTableEntry from '@/components/core/data-table/entry';
import { DetailsModal } from '@core/modal';

import { productVariantValuesEntryDetailsColumns } from '../../_config/columns';
import { IProductVariantValuesEntryTableData } from '../../_config/columns/columns.type';

const SerialModal: React.FC<{
	data: IProductVariantValuesEntryTableData[];
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ data, open, setOpen }) => {
	const onClose = () => {
		setOpen((prev: boolean) => !prev);
	};

	const columns = productVariantValuesEntryDetailsColumns();

	return (
		<DetailsModal
			isSmall
			open={open}
			setOpen={onClose}
			content={
				<DataTableEntry
					title={'Attributes'}
					columns={columns}
					data={data ?? []}
					defaultVisibleColumns={{ created_by_name: false, created_at: false, updated_at: false }}
				></DataTableEntry>
			}
		/>
	);
};

export default SerialModal;
