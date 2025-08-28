import React from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

import { DynamicFieldsProps } from '../types';

interface IProps extends Pick<DynamicFieldsProps, 'handleAdd' | 'extraHeader' | 'title' | 'containerClassName'> {
	children: React.ReactNode;
	extraButton?: React.ReactNode;
}

const DynamicFieldContainer: React.FC<IProps> = ({
	title,
	extraHeader,
	handleAdd,
	children,
	containerClassName,
	extraButton,
}) => {
	return (
		<div className='overflow-hidden rounded-t-md shadow-sm'>
			<div className='flex items-center justify-between bg-primary py-2 pl-4 pr-2'>
				<h3 className='text-lg font-medium text-primary-foreground'>{title || 'Dynamic Fields'}</h3>

				<div className='flex items-center gap-4'>
					{extraHeader}
					{handleAdd && (
						<Button
							onClick={handleAdd}
							type='button'
							variant={'gradient-accent'}
							size={'xs'}
							className='gap-1 rounded'
						>
							<Plus className='size-4' />
							New
						</Button>
					)}
					{extraButton}
				</div>
			</div>

			<div className={cn('rounded-md rounded-t-none border bg-base', containerClassName)}>{children}</div>
		</div>
	);
};

export default DynamicFieldContainer;
