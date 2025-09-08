import React from 'react';
import { Check, X } from 'lucide-react';

import { Button, ButtonProps } from '../ui/button';

interface StatusButtonProps {
	value: number | boolean;
	buttonProps?: ButtonProps;
}

const StatusButton: React.FC<StatusButtonProps> = ({ value = 0, buttonProps }) => {
	const valueIsBoolean = typeof value === 'boolean';

	if (valueIsBoolean) {
		return (
			<Button
				className='size-5 rounded-full'
				size={'icon'}
				variant={value === true ? 'accent' : 'destructive'}
				{...buttonProps}
			>
				{value === true ? <Check className='size-4' /> : <X className='size-4' />}
			</Button>
		);
	}

	return (
		<Button
			className='size-5 rounded-full'
			size={'icon'}
			variant={value === 0 ? 'destructive' : 'accent'}
			{...buttonProps}
		>
			{value === 0 ? <X className='size-4' /> : <Check className='size-4' />}
		</Button>
	);
};

export default StatusButton;
