import React from 'react';

import { cn } from '@/lib/utils';

import { IFormSectionProps } from './types';

const FormSection: React.FC<IFormSectionProps> = ({ children, className, title, extraHeader }) => {
	if (title) {
		return (
			<div className='overflow-hidden rounded-md shadow-sm '>
				<div className='flex flex-col justify-between gap-4 bg-primary py-2 pl-4 pr-2 sm:flex-row sm:items-center'>
					<h3 className='text-lg font-medium text-primary-foreground w-auto'>{title}</h3>
					{extraHeader}
				</div>
				<div
					className={cn(
						'grid grid-cols-1 gap-2.5 rounded-b-md border bg-base p-2.5 sm:grid-cols-1 sm:gap-4 lg:grid-cols-3 lg:p-4',
						className
					)}
				>
					{children}
				</div>
			</div>
		);
	}
	return (
		<div
			className={cn(
				'grid grid-cols-1 gap-2.5 rounded-md border bg-base p-4 shadow-sm sm:grid-cols-2 sm:gap-4 lg:grid-cols-3',
				className
			)}
		>
			{children}
		</div>
	);
};

export default FormSection;
