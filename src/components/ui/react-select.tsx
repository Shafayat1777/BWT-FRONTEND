import { forwardRef } from 'react';
import { ChevronDown, X } from 'lucide-react';
import Select, { ClassNamesConfig, components, Props, StylesConfig } from 'react-select';

import { cn } from '@/lib/utils';

const selectStyles: StylesConfig = {
	input: (base) => ({
		...base,
	}),

	multiValueLabel(base) {
		return {
			...base,
			whiteSpace: 'normal',
			overflow: 'visible',
		};
	},
};

const classNames = (extraControlClassName?: string): ClassNamesConfig => ({
	control: ({ isFocused, isDisabled }) =>
		cn(
			'bg-gradient min-h-10 rounded-md border border-input px-3 py-2 text-sm text-foreground',
			isFocused && 'outline outline-2 outline-offset-2 outline-secondary',
			isDisabled &&
				'cursor-not-allowed border-destructive/50 !from-destructive/5 !to-destructive/5 text-destructive',
			extraControlClassName
		),
	placeholder: () => 'text-muted-foreground text-sm',
	input: () => 'grow',
	singleValue: () => 'grow',
	multiValue: () => 'border border-input px-2 rounded bg-base-200',
	valueContainer: () => 'flex flex-wrap gap-2',
	menu: () => 'bg-base overflow-hidden  rounded shadow-2xl text-sm border border-input p-1',
	option: ({ isFocused, isSelected }) =>
		cn(
			'rounded px-3 py-1.5 text-sm text-foreground',
			isFocused && 'bg-base-200',
			isSelected && 'before:mr-1 before:content-["✔"]'
		),
	noOptionsMessage: () => 'text-destructive text-sm p-2 bg-destructive/5 border border-destructive/20 rounded',
});

export type Ref = any;
const sortOptionsWithSelectedFirst = (options: any[], selectedValues: any) => {
	if (!selectedValues) return options;

	const selectedArray = Array.isArray(selectedValues) ? selectedValues : [selectedValues];
	const selectedValueSet = new Set(selectedArray?.map((item) => item?.value));

	return options?.sort((a, b) => {
		const aSelected = selectedValueSet.has(a.value);
		const bSelected = selectedValueSet.has(b.value);

		if (aSelected && !bSelected) return -1;
		if (!aSelected && bSelected) return 1;
		return 0;
	});
};
const ReactSelect = forwardRef<Ref, Props & { extraControlClassName?: string }>(
	(
		{
			options,
			placeholder,
			isMulti = false,
			isClearable = true,
			isSearchable = true,
			isDisabled = false,
			extraControlClassName,
			value,
			...props
		},
		ref
	) => {
		return (
			<Select
				ref={ref}
				unstyled
				classNamePrefix={'react-select-'}
				classNames={classNames(extraControlClassName)}
				styles={selectStyles}
				components={{
					ClearIndicator: (props) => (
						<components.ClearIndicator className='mr-1 border-r border-r-input pr-1' {...props}>
							<X className='size-5 font-medium text-destructive' />
						</components.ClearIndicator>
					),

					MultiValueRemove: (props) => (
						<components.MultiValueRemove {...props}>
							<X className='ml-1 size-4 font-medium text-destructive' />
						</components.MultiValueRemove>
					),

					DropdownIndicator: (props) => (
						<components.DropdownIndicator {...props}>
							<ChevronDown
								className={cn(
									'size-5 transform text-secondary/50 transition-transform duration-300',
									props.selectProps.menuIsOpen && 'rotate-90'
								)}
							/>
						</components.DropdownIndicator>
					),
				}}
				isMulti={isMulti}
				isDisabled={isDisabled}
				isClearable={isClearable}
				isSearchable={isSearchable}
				options={sortOptionsWithSelectedFirst(options as any, value)}
				value={value}
				placeholder={placeholder}
				{...props}
			/>
		);
	}
);

// const ReactSelect: React.FC<Props & { extraControlClassName?: string }> = ({
// 	options,
// 	placeholder,
// 	isMulti = false,
// 	isClearable = true,
// 	isSearchable = true,
// 	isDisabled = false,
// 	extraControlClassName,
// 	...props
// }) => {
// 	return (
// 		<Select
// 			unstyled
// 			classNamePrefix={'react-select-'}
// 			classNames={classNames(extraControlClassName)}
// 			styles={selectStyles}
// 			components={{
// 				ClearIndicator: (props) => (
// 					<components.ClearIndicator
// 						className='mr-1 border-r border-r-input pr-1'
// 						{...props}>
// 						<X className='size-5 font-medium text-destructive' />
// 					</components.ClearIndicator>
// 				),

// 				MultiValueRemove: (props) => (
// 					<components.MultiValueRemove {...props}>
// 						<X className='ml-1 size-4 font-medium text-destructive' />
// 					</components.MultiValueRemove>
// 				),

// 				DropdownIndicator: (props) => (
// 					<components.DropdownIndicator {...props}>
// 						<ChevronDown
// 							className={cn(
// 								'size-5 transform text-secondary/50 transition-transform duration-300',
// 								props.selectProps.menuIsOpen && 'rotate-90'
// 							)}
// 						/>
// 					</components.DropdownIndicator>
// 				),
// 			}}
// 			isMulti={isMulti}
// 			isDisabled={isDisabled}
// 			isClearable={isClearable}
// 			isSearchable={isSearchable}
// 			options={options}
// 			placeholder={placeholder}
// 			{...props}
// 		/>
// 	);
// };

export default ReactSelect;
