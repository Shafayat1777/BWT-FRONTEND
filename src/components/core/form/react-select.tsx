import { isArray } from 'lodash';

import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import ReactSelect from '@/components/ui/react-select';
import { Skeleton } from '@/components/ui/skeleton';

import { FormReactSelectProps, IFormSelectOption } from './types';

const FormReactSelect: React.FC<FormReactSelectProps> = ({
	field,
	label,
	placeholder = 'Select an option',
	optional = false,
	options,
	isDisabled = false,
	disableLabel,
	isMulti = false,
	menuPortalTarget,
	valueType = 'string',
	isLoading = false,
}) => {
	return (
		<FormItem className='w-full space-y-1.5'>
			{!disableLabel && (
				<FormLabel className='flex items-center justify-between capitalize'>
					{label || field.name.split('_').join(' ')}{' '}
					{optional ? <span className='text-xs'>(Optional)</span> : ''}
				</FormLabel>
			)}
			<FormControl>
				{isLoading ? (
					<Skeleton className='bg-gradient h-10 w-full rounded-md border border-input' />
				) : (
					<ReactSelect
						className='min-w-48'
						isMulti={isMulti}
						options={options}
						isDisabled={isDisabled}
						placeholder={placeholder}
						menuPortalTarget={menuPortalTarget}
						{...field}
						value={
							isMulti
								? isArray(field.value)
									? field.value.map((item: any) => {
											return options?.find((option: IFormSelectOption) => option.value === item);
										})
									: []
								: options?.filter((item: IFormSelectOption) => item.value === field.value)
						}
						// value={() => {
						// 	if (!isMulti) {
						// 		return options.filter((item: IFormSelectOption) => item.value === field.value);
						// 	}
						// 	if (isArray(field.value)) {
						// 		return field.value.map((item: any) => {
						// 			return options.find((option: IFormSelectOption) => option.value === item);
						// 		});
						// 	}

						// 	return [];
						// }}
						onChange={(option: any) => {
							if (option === null) {
								if (isMulti) {
									field.onChange([]);
								} else {
									field.onChange('');
								}
								return;
							}
							if (isMulti) {
								field.onChange(option.map((item: any) => item.value));

								return;
							}

							if (valueType === 'number') {
								field.onChange(Number(option.value));
							} else {
								field.onChange(option.value);
							}
						}}
					/>
				)}
			</FormControl>
			<FormMessage />
		</FormItem>
	);
};

export default FormReactSelect;
