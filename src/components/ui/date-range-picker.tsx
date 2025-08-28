import React, { useEffect, useRef, useState, type FC } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from './button';
import { Calendar } from './calendar';
import { Label } from './label';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { ScrollArea } from './scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import SingleDatePicker from './single-date-picker';
import { Switch } from './switch';

export interface DateRangePickerProps {
	/** Click handler for applying updates from DateRangePicker */
	onUpdate?: (values: { range: DateRange; rangeCompare?: DateRange }) => void;
	/** Initial value for start date */
	initialDateFrom?: Date | string;
	/** Initial value for end date */
	initialDateTo?: Date | string;
	/** Initial value for compare start date */
	initialCompareFrom?: Date | string;
	/** Initial value for compare end date */
	initialCompareTo?: Date | string;
	/** Alignment of popover */
	align?: 'start' | 'center' | 'end';
	/** Locale identifier */
	locale?: string;
	/** Enable compare feature */
	showCompare?: boolean;
	/** Clear handler */
	onClear?: () => void;
	isModal?: boolean;
	isMobile?: boolean;
	className?: string;
	/** Minimum selectable date */
	minDate?: Date;
	/** Maximum selectable date */
	maxDate?: Date;
}

const formatDate = (date: Date, locale: string = 'en-US'): string =>
	date?.toLocaleDateString(locale) || format(date, 'yyyy/MM/dd');

const getDateAdjustedForTimezone = (dateInput: Date | string): Date => {
	if (typeof dateInput === 'string') {
		const [year, month, day] = dateInput.split('-').map(Number);
		return new Date(year, month - 1, day);
	}
	return dateInput;
};

interface DateRange {
	from: Date;
	to: Date | undefined;
}

interface Preset {
	name: string;
	label: string;
}

const PRESETS: Preset[] = [
	{ name: 'lastThreeMonths', label: '3 Months' },
	{ name: 'lastSixMonths', label: '6 Months' },
	{ name: 'today', label: 'Today' },
	{ name: 'yesterday', label: 'Yesterday' },
	{ name: 'last7', label: 'Last 7 days' },
	{ name: 'last14', label: 'Last 14 days' },
	{ name: 'last30', label: 'Last 30 days' },
	{ name: 'thisWeek', label: 'This Week' },
	{ name: 'lastWeek', label: 'Last Week' },
	{ name: 'thisMonth', label: 'This Month' },
	{ name: 'lastMonth', label: 'Last Month' },
	{ name: 'thisYear', label: 'This Year' },
];

export const DateRangePicker: FC<DateRangePickerProps> & { filePath: string } = ({
	initialDateFrom = new Date(new Date().setHours(0, 0, 0, 0)),
	initialDateTo,
	initialCompareFrom,
	initialCompareTo,
	onUpdate,
	align = 'end',
	locale = 'en-US',
	showCompare = false,
	onClear,
	isMobile,
	className,
	minDate,
	maxDate,
}): React.ReactNode => {
	const [isOpen, setIsOpen] = useState(false);
	const [range, setRange] = useState<DateRange>({
		from: getDateAdjustedForTimezone(initialDateFrom),
		to: initialDateTo ? getDateAdjustedForTimezone(initialDateTo) : getDateAdjustedForTimezone(initialDateFrom),
	});
	const [rangeCompare, setRangeCompare] = useState<DateRange | undefined>(
		initialCompareFrom
			? {
					from: new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0)),
					to: initialCompareTo
						? new Date(new Date(initialCompareTo).setHours(0, 0, 0, 0))
						: new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0)),
				}
			: undefined
	);

	const openedRangeRef = useRef<DateRange | undefined>(undefined);
	const openedRangeCompareRef = useRef<DateRange | undefined>(undefined);
	const [selectedPreset, setSelectedPreset] = useState<string | undefined>(undefined);
	const [isSmallScreen, setIsSmallScreen] = useState(
		typeof window !== 'undefined' ? window.innerWidth < 1080 : false
	);

	useEffect(() => {
		if (initialDateFrom && initialDateTo) {
			setRange({
				from: initialDateFrom as Date,
				to: initialDateTo as Date,
			});
		}
	}, [initialDateFrom, initialDateTo]);

	useEffect(() => {
		const handleResize = (): void => {
			setIsSmallScreen(window.innerWidth < 960);
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const getPresetRange = (presetName: string): DateRange => {
		const preset = PRESETS.find(({ name }) => name === presetName);
		if (!preset) throw new Error(`Unknown date range preset: ${presetName}`);
		const from = new Date();
		const to = new Date();
		const first = from.getDate() - from.getDay();

		switch (preset.name) {
			case 'today':
				from.setHours(0, 0, 0, 0);
				to.setHours(23, 59, 59, 999);
				break;
			case 'yesterday':
				from.setDate(from.getDate() - 1);
				from.setHours(0, 0, 0, 0);
				to.setDate(to.getDate() - 1);
				to.setHours(23, 59, 59, 999);
				break;
			case 'last7':
				from.setDate(from.getDate() - 6);
				from.setHours(0, 0, 0, 0);
				to.setHours(23, 59, 59, 999);
				break;
			case 'last14':
				from.setDate(from.getDate() - 13);
				from.setHours(0, 0, 0, 0);
				to.setHours(23, 59, 59, 999);
				break;
			case 'last30':
				from.setDate(from.getDate() - 29);
				from.setHours(0, 0, 0, 0);
				to.setHours(23, 59, 59, 999);
				break;
			case 'thisWeek':
				from.setDate(first);
				from.setHours(0, 0, 0, 0);
				to.setHours(23, 59, 59, 999);
				break;
			case 'lastWeek':
				from.setDate(from.getDate() - 7 - from.getDay());
				to.setDate(to.getDate() - to.getDay() - 1);
				from.setHours(0, 0, 0, 0);
				to.setHours(23, 59, 59, 999);
				break;
			case 'thisMonth':
				from.setDate(1);
				from.setHours(0, 0, 0, 0);
				to.setHours(23, 59, 59, 999);
				break;
			case 'lastMonth':
				from.setMonth(from.getMonth() - 1);
				from.setDate(1);
				from.setHours(0, 0, 0, 0);
				to.setDate(0);
				to.setHours(23, 59, 59, 999);
				break;
			case 'lastThreeMonths':
				from.setDate(from.getDate() - 89);
				from.setHours(0, 0, 0, 0);
				to.setHours(23, 59, 59, 999);
				break;
			case 'lastSixMonths':
				from.setDate(from.getDate() - 179);
				from.setHours(0, 0, 0, 0);
				to.setHours(23, 59, 59, 999);
				break;
			case 'thisYear':
				from.setMonth(0);
				from.setDate(1);
				from.setHours(0, 0, 0, 0);
				to.setMonth(12);
				to.setDate(0);
				to.setHours(23, 59, 59, 999);
				break;
		}
		return { from, to };
	};

	const setPreset = (preset: string): void => {
		const range = getPresetRange(preset);
		setRange(range);
		if (rangeCompare) {
			const rangeCompare = {
				from: new Date(range.from.getFullYear() - 1, range.from.getMonth(), range.from.getDate()),
				to: range.to
					? new Date(range.to.getFullYear() - 1, range.to.getMonth(), range.to.getDate())
					: undefined,
			};
			setRangeCompare(rangeCompare);
		}
	};

	const checkPreset = (): void => {
		for (const preset of PRESETS) {
			const presetRange = getPresetRange(preset.name);

			const normalizedRangeFrom = new Date(range.from);
			normalizedRangeFrom.setHours(0, 0, 0, 0);
			const normalizedPresetFrom = new Date(presetRange.from);
			normalizedPresetFrom.setHours(0, 0, 0, 0);

			const normalizedRangeTo = new Date(range.to ?? range.from);
			normalizedRangeTo.setHours(0, 0, 0, 0);
			const normalizedPresetTo = new Date(presetRange.to ?? presetRange.from);
			normalizedPresetTo.setHours(0, 0, 0, 0);

			if (
				normalizedRangeFrom.getTime() === normalizedPresetFrom.getTime() &&
				normalizedRangeTo.getTime() === normalizedPresetTo.getTime()
			) {
				setSelectedPreset(preset.name);
				return;
			}
		}
		setSelectedPreset(undefined);
	};

	const resetValues = (): void => {
		setRange({
			from: typeof initialDateFrom === 'string' ? getDateAdjustedForTimezone(initialDateFrom) : initialDateFrom,
			to: initialDateTo
				? typeof initialDateTo === 'string'
					? getDateAdjustedForTimezone(initialDateTo)
					: initialDateTo
				: typeof initialDateFrom === 'string'
					? getDateAdjustedForTimezone(initialDateFrom)
					: initialDateFrom,
		});
		setRangeCompare(
			initialCompareFrom
				? {
						from:
							typeof initialCompareFrom === 'string'
								? getDateAdjustedForTimezone(initialCompareFrom)
								: initialCompareFrom,
						to: initialCompareTo
							? typeof initialCompareTo === 'string'
								? getDateAdjustedForTimezone(initialCompareTo)
								: initialCompareTo
							: typeof initialCompareFrom === 'string'
								? getDateAdjustedForTimezone(initialCompareFrom)
								: initialCompareFrom,
					}
				: undefined
		);
	};

	useEffect(() => {
		checkPreset();
	}, [range]);

	const PresetButton = ({
		preset,
		label,
		isSelected,
	}: {
		preset: string;
		label: string;
		isSelected: boolean;
	}): React.ReactNode => (
		<Button
			aria-label={label}
			size={'sm'}
			className={cn(
				'flex w-full justify-start text-left',
				isSelected && 'pointer-events-none bg-primary text-primary-foreground'
			)}
			variant='ghost'
			onClick={() => {
				setPreset(preset);
			}}
		>
			<>{label}</>
		</Button>
	);

	// Fixed areRangesEqual function with proper type checking
	const areRangesEqual = (a?: DateRange, b?: DateRange): boolean => {
		// If either is undefined, they're equal only if both are undefined
		if (!a || !b) return a === b;

		// Ensure both from dates exist and are Date objects
		if (!(a.from instanceof Date) || !(b.from instanceof Date)) return false;

		// Compare from dates
		if (a.from.getTime() !== b.from.getTime()) return false;

		// Handle to dates comparison
		if (!a.to && !b.to) return true; // Both undefined
		if (!a.to || !b.to) return false; // One undefined, one not
		if (!(a.to instanceof Date) || !(b.to instanceof Date)) return false;

		return a.to.getTime() === b.to.getTime();
	};

	useEffect(() => {
		if (isOpen) {
			openedRangeRef.current = range;
			openedRangeCompareRef.current = rangeCompare;
		}
	}, [isOpen]);

	// Create disabled function for calendar
	const isDateDisabled = (date: Date): boolean => {
		if (minDate && date < minDate) return true;
		if (maxDate && date > maxDate) return true;
		return false;
	};

	return (
		<Popover
			modal={true}
			open={isOpen}
			onOpenChange={(open: boolean) => {
				if (!open) {
					resetValues();
				}
				setIsOpen(open);
			}}
		>
			<PopoverTrigger asChild>
				<Button
					aria-label='Open date range picker'
					size={isMobile ? 'icon' : 'sm'}
					variant='gradient'
					className={cn(className)}
				>
					<CalendarIcon className='size-4' />
					<div className={cn('text-right', isMobile && 'hidden')}>
						<div>
							<div>{`${formatDate(range.from, locale)}${
								range.to != null ? ' - ' + formatDate(range.to, locale) : ''
							}`}</div>
						</div>
						{rangeCompare != null && (
							<div className='-mt-1 text-xs opacity-60'>
								<>
									vs. {formatDate(rangeCompare.from, locale)}
									{rangeCompare.to != null ? ` - ${formatDate(rangeCompare.to, locale)}` : ''}
								</>
							</div>
						)}
					</div>
				</Button>
			</PopoverTrigger>
			<PopoverContent align={align} className='w-auto p-0'>
				<div className='flex'>
					<div className='gap flex flex-col'>
						<div className='flex flex-col items-center justify-center gap-2 border-b px-8 py-3 lg:flex-row lg:items-start'>
							{showCompare && (
								<div className='flex items-center space-x-2 py-1 pr-4'>
									<Switch
										defaultChecked={Boolean(rangeCompare)}
										onCheckedChange={(checked: boolean) => {
											if (checked) {
												if (!range.to) {
													setRange({
														from: range.from,
														to: range.from,
													});
												}
												setRangeCompare({
													from: new Date(
														range.from.getFullYear(),
														range.from.getMonth(),
														range.from.getDate() - 365
													),
													to: range.to
														? new Date(
																range.to.getFullYear() - 1,
																range.to.getMonth(),
																range.to.getDate()
															)
														: new Date(
																range.from.getFullYear() - 1,
																range.from.getMonth(),
																range.from.getDate()
															),
												});
											} else {
												setRangeCompare(undefined);
											}
										}}
										id='compare-mode'
									/>
									<Label htmlFor='compare-mode'>Compare</Label>
								</div>
							)}
							<div className='flex flex-col gap-2'>
								<div className='flex gap-2'>
									<SingleDatePicker
										disableIcon
										className='justify-center'
										selected={range?.from}
										minDate={minDate}
										maxDate={maxDate}
										onSelect={(date) => setRange((prevRange) => ({ ...prevRange, from: date }))}
									/>
									<div className='py-1'>-</div>
									<SingleDatePicker
										disableIcon
										className='justify-center'
										selected={range?.to || new Date()}
										minDate={minDate}
										maxDate={maxDate}
										onSelect={(date) => setRange((prevRange) => ({ ...prevRange, to: date }))}
									/>
								</div>
							</div>
						</div>

						<div className='flex flex-col items-center justify-center bg-base-150 py-4 lg:flex-row lg:items-start lg:py-0'>
							{isSmallScreen && (
								<Select
									defaultValue={selectedPreset}
									onValueChange={(value) => {
										setPreset(value);
									}}
								>
									<SelectTrigger className='mx-auto w-[200px]'>
										<SelectValue placeholder='Select...' />
									</SelectTrigger>
									<SelectContent className='z-[999]'>
										{PRESETS.map((preset) => (
											<SelectItem key={preset.name} value={preset.name}>
												{preset.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}

							{!isSmallScreen && (
								<ScrollArea className='m-0 flex h-[300px] w-fit flex-col rounded-none border-r p-4 pl-3'>
									{PRESETS.map((preset) => (
										<div key={preset.name} className='mb-1 flex last:mb-0'>
											<PresetButton
												preset={preset.name}
												label={preset.label}
												isSelected={selectedPreset === preset.name}
											/>
										</div>
									))}
								</ScrollArea>
							)}

							<Calendar
								mode='range'
								onSelect={(value: { from?: Date; to?: Date } | undefined) => {
									if (value?.from != null) {
										setRange({
											from: value.from,
											to: value?.to,
										});
									}
								}}
								selected={range}
								numberOfMonths={isSmallScreen ? 1 : 2}
								defaultMonth={
									new Date(new Date().setMonth(new Date().getMonth() - (isSmallScreen ? 0 : 1)))
								}
								disabled={isDateDisabled}
							/>
						</div>
					</div>
				</div>

				<div className='flex items-center justify-between border-t p-3'>
					{onClear && (
						<Button
							size={'sm'}
							aria-label='Clear Filter'
							onClick={() => {
								setIsOpen(false);
								resetValues();
								onClear();
							}}
							variant='destructive'
						>
							Clear Filter
						</Button>
					)}

					<div className='flex flex-1 justify-end gap-4'>
						<Button
							size={'sm'}
							aria-label='Cancel'
							onClick={() => {
								setIsOpen(false);
								resetValues();
							}}
							variant='outline'
						>
							Cancel
						</Button>
						<Button
							size={'sm'}
							aria-label='Apply'
							variant={'accent'}
							onClick={() => {
								setIsOpen(false);
								if (
									!areRangesEqual(range, openedRangeRef.current) ||
									!areRangesEqual(rangeCompare, openedRangeCompareRef.current)
								) {
									onUpdate?.({ range, rangeCompare });
								}
							}}
						>
							Apply
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};

DateRangePicker.displayName = 'DateRangePicker';
DateRangePicker.filePath = 'libs/shared/ui-kit/src/lib/date-range-picker/date-range-picker.tsx';
