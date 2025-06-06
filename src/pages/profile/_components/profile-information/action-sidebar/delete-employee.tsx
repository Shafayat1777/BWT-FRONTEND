import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

const DeleteEmployee = () => {
	return (
		<Button variant={'outline'} className={`h-auto w-full justify-start px-4 py-2`}>
			<Trash2 className='mr-1 size-4' />
			<span className='text-sm'>Delete Employee</span>
		</Button>
	);
};

export default DeleteEmployee;
