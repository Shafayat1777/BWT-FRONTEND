import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IFormSelectOption } from '@/components/core/form/types';
import { BarcodeScanner } from '@/components/others/barcode-scanner';
import ReactSelect from '@/components/ui/react-select';
import { useOtherOrder } from '@/lib/common-queries/other';
import { IOrderTableData } from '../_config/columns/columns.type';
import { useWorkOrderByDetails } from '../_config/query';
import Information from '../order/details/information';
import Transfer from '../order/details/transfer';
import EntryTable from './process';

const Scanner: React.FC = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [order, setOrder] = useState(() => searchParams.get('order') || '');
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const { data, isLoading, updateData } = useWorkOrderByDetails<IOrderTableData>(order as string);
	const { data: orderList } = useOtherOrder<IFormSelectOption[]>();

	const handleModernScan = (code: string) => {
		setOrder(code);
		setSearchParams(
			(prev) => {
				prev.set('order', code);
				return prev;
			},
			{ replace: true }
		);
	};

	const handleOrderChange = (newValue: any) => {
		const selectedOption = newValue as IFormSelectOption | null;
		const newOrder = selectedOption?.value || '';
		setOrder(newOrder as string);
		setSearchParams(
			(prev) => {
				if (newOrder) prev.set('order', newOrder as string);
				else prev.delete('order');
				return prev;
			},
			{ replace: true }
		);
	};

	const handleMenuOpen = () => {
		setIsDropdownOpen(true);
		document.body.setAttribute('data-dropdown-open', 'true');
	};

	const handleMenuClose = () => {
		setIsDropdownOpen(false);
		document.body.removeAttribute('data-dropdown-open');
		setTimeout(() => {
			const scannerElement = document.querySelector('.modern-barcode-scanner') as HTMLElement;
			if (scannerElement) {
				scannerElement.focus();
			}
		}, 100);
	};

	useEffect(() => {
		const urlOrder = searchParams.get('order') || '';
		if (urlOrder !== order) setOrder(urlOrder);
	}, [searchParams]);

	useEffect(() => {
		document.title = 'Order Scanner';
	}, []);

	if (isLoading) return <div>Loading...</div>;

	return (
		<div className='space-y-4'>
			<BarcodeScanner onScanComplete={handleModernScan} disabled={isDropdownOpen} title='Order Scanner'>
				<div className='flex flex-1 flex-col bg-transparent'>
					<label className='mb-1.5 text-sm font-medium text-gray-700'>Order</label>
					<ReactSelect
						options={orderList || []}
						value={orderList?.find((opt) => opt.value === order) || null}
						onChange={handleOrderChange}
						onMenuOpen={handleMenuOpen}
						onMenuClose={handleMenuClose}
						placeholder='Select order manually...'
						isClearable
						isSearchable
						className='max-w-md flex-1'
						menuPortalTarget={document.body}
						styles={{
							menuPortal: (base) => ({ ...base, zIndex: 9999 }),
						}}
					/>
					<p className='ml-1 mt-1 text-xs text-gray-500'>
						You can select an order manually or use the scanner when it's active.
					</p>
				</div>
			</BarcodeScanner>
			{data && <Information data={data} updateData={updateData} />}
			{data?.is_proceed_to_repair && (
				<>
					<Transfer data={data} isLoading={isLoading} order_uuid={data.uuid} />
					<EntryTable data={data} isLoading={isLoading} />
				</>
			)}
		</div>
	);
};

export default Scanner;
