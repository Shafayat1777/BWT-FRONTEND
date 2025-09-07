import { useEffect, useRef, useState } from 'react';
import { useSymbologyScanner } from '@use-symbology-scanner/react';
import { useSearchParams } from 'react-router-dom';
import useAccess from '@/hooks/useAccess';

import { IFormSelectOption } from '@/components/core/form/types';
import SectionContainer from '@/components/others/section-container';
import ReactSelect from '@/components/ui/react-select';

import { useOtherOrder } from '@/lib/common-queries/other';

import { IOrderTableData } from '../_config/columns/columns.type';
import { useWorkOrderByDetails } from '../_config/query';
import Information from '../order/details/information';
import Transfer from '../order/details/transfer';
import EntryTable from './process';

const Scanner = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [order, setOrder] = useState(() => searchParams.get('order') || '');
	const [isScannerFocused, setIsScannerFocused] = useState(true);
	const [activeElement, setActiveElement] = useState<Element | null>(null);
	const [lastScanTime, setLastScanTime] = useState<number>(0);
	const [scanCount, setScanCount] = useState(0);
	const { data, isLoading, updateData } = useWorkOrderByDetails<IOrderTableData>(order as string);
	const { data: orderList } = useOtherOrder<IFormSelectOption[]>();
	const ref = useRef<HTMLDivElement>(null);
	const hiddenInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const updateActiveElement = () => {
			setActiveElement(document.activeElement);
		};
		document.addEventListener('focusin', updateActiveElement);
		document.addEventListener('focusout', updateActiveElement);
		updateActiveElement();
		return () => {
			document.removeEventListener('focusin', updateActiveElement);
			document.removeEventListener('focusout', updateActiveElement);
		};
	}, []);
	const isScannerActuallyActive = isScannerFocused && activeElement === hiddenInputRef.current;
	const handleOrderChange = (selectedOption: any) => {
		const newOrder = selectedOption?.value || '';
		setOrder(newOrder);
		setSearchParams(
			(prev) => {
				if (newOrder) {
					prev.set('order', newOrder);
				} else {
					prev.delete('order');
				}
				return prev;
			},
			{ replace: true }
		);
	};

	useEffect(() => {
		const urlOrder = searchParams.get('order') || '';
		if (urlOrder !== order) {
			setOrder(urlOrder);
		}
	}, [searchParams]);
	useEffect(() => {
		document.title = 'Scanner';
	}, []);

	useEffect(() => {
		if (isScannerFocused && hiddenInputRef.current) {
			hiddenInputRef.current.focus();
		} else if (!isScannerFocused && hiddenInputRef.current) {
			hiddenInputRef.current.blur();
		}
	}, [isScannerFocused]);

	useEffect(() => {
		if (hiddenInputRef.current) {
			setTimeout(() => {
				hiddenInputRef.current?.focus();
			}, 100);
		}
	}, []);

	const toggleScannerFocus = () => {
		const newFocusState = !isScannerFocused;
		setIsScannerFocused(newFocusState);
		if (newFocusState && hiddenInputRef.current) {
			setTimeout(() => {
				hiddenInputRef.current?.focus();
			}, 50);
		} else if (!newFocusState && hiddenInputRef.current) {
			hiddenInputRef.current.blur();
		}
	};

	const forceFocus = () => {
		if (hiddenInputRef.current) {
			hiddenInputRef.current.focus();
		}
	};

	const handleContainerClick = (e: React.MouseEvent) => {
		if (!isScannerFocused) return;
		const target = e.target as HTMLElement;
		const isInteractiveElement = target.matches(
			'input, select, button, textarea, [contenteditable="true"], [role="button"]'
		);
		if (!isInteractiveElement) {
			setTimeout(() => {
				if (hiddenInputRef.current && isScannerFocused) {
					hiddenInputRef.current.focus();
				}
			}, 10);
		}
	};
	const handleSymbol = (symbol: any, matchedSymbologies: any) => {
		const now = Date.now();
		setOrder(symbol);
		setLastScanTime(now);
		setScanCount((prev) => prev + 1);

		if (hiddenInputRef.current) {
			hiddenInputRef.current.value = '';
			if (isScannerFocused) {
				setTimeout(() => {
					hiddenInputRef.current?.focus();
				}, 10);
			}
		}

		setSearchParams(
			(prev) => {
				prev.set('order', symbol);
				return prev;
			},
			{ replace: true }
		);
	};

	const handleHiddenInputBlur = (e: React.FocusEvent) => {
		if (!isScannerFocused) return;

		const relatedTarget = e.relatedTarget as HTMLElement;
		if (!relatedTarget || !relatedTarget.matches('input, select, button, textarea, [contenteditable="true"]')) {
			setTimeout(() => {
				if (hiddenInputRef.current && isScannerFocused) {
					hiddenInputRef.current.focus();
				}
			}, 10);
		}
	};

	useSymbologyScanner(handleSymbol, {
		target: ref,
		eventOptions: { capture: true, passive: false },
		scannerOptions: {
			maxDelay: 150,
			prefix: '',
			suffix: '',
		},
	});
	if (isLoading) return <div>Loading...</div>;
	return (
		<div className='space-y-8' ref={ref} onClick={handleContainerClick}>
			<div className='relative'>
				<input
					ref={hiddenInputRef}
					type='text'
					style={{
						position: 'absolute',
						left: '-9999px',
						width: '1px',
						height: '1px',
						opacity: 0,
					}}
					onBlur={handleHiddenInputBlur}
					aria-label='Barcode scanner input'
					autoComplete='off'
				/>
				<div className='mb-6 flex gap-8 rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
					<div className='flex-1/3 mb-4 gap-3 py-4'>
						<button
							onClick={toggleScannerFocus}
							className={`flex items-center gap-2 rounded-lg px-4 py-2.5 font-semibold shadow-sm transition-all duration-200 ${
								isScannerActuallyActive
									? 'bg-green-500 text-white ring-2 ring-green-200 hover:bg-green-600 hover:shadow-md'
									: 'border border-gray-300 bg-gray-200 text-gray-700 hover:bg-gray-300'
							}`}
							type='button'
						>
							<div
								className={`h-2 w-2 rounded-full ${
									isScannerActuallyActive ? 'animate-pulse bg-green-200' : 'bg-gray-500'
								}`}
							></div>
							{isScannerActuallyActive ? 'Scanner Active' : 'Scanner Inactive'}
						</button>
						<p className='py-2 text-xs text-gray-500'>
							{isScannerFocused ? 'Tap to stop' : 'Tap to scan.'}
						</p>
					</div>

					<div className='flex flex-1 flex-col gap-1'>
						<label className='block text-sm font-semibold text-gray-700' htmlFor='order-select'>
							Order List
						</label>

						<ReactSelect
							inputId='order-select'
							options={orderList || []}
							value={orderList?.find((option) => option.value === order) || null}
							placeholder='Select an order...'
							isClearable
							isSearchable
							menuPortalTarget={document.body}
							isDisabled={isScannerFocused}
							onChange={handleOrderChange}
							onMenuOpen={() => {
								if (hiddenInputRef.current && isScannerFocused) {
									hiddenInputRef.current.blur();
								}
							}}
							onMenuClose={() => {
								if (hiddenInputRef.current && isScannerFocused) {
									setTimeout(() => {
										hiddenInputRef.current?.focus();
									}, 100);
								}
							}}
						/>

						<p className='text-xs text-gray-500'>
							{isScannerFocused
								? 'You can only select an order using the scanner.'
								: "You can select an order manually or use the scanner when it's active."}
						</p>
					</div>
				</div>

				<div className='space-y-3'></div>
			</div>
			{data && <Information data={data as IOrderTableData} updateData={updateData} />}
			{data?.is_proceed_to_repair && (
				<>
					<Transfer data={data as IOrderTableData} isLoading={isLoading} order_uuid={data.uuid} />
					<EntryTable data={data as IOrderTableData} isLoading={isLoading} />
				</>
			)}
		</div>
	);
};
export default Scanner;
