import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import useTableSSR from '@/hooks/useTableSSR';

import PaginateButtons from '@/components/core/data-table/_helpers/paginate-buttons';
import { Button } from '@/components/ui/button';
import DebouncedInput from '@/components/ui/debounce-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function TablePagination() {
	const [searchParams] = useSearchParams();
	const { table, pagination, handleSearchParams, enableRowSelection } = useTableSSR();

	return (
		<div className='sticky bottom-0 left-0 right-0 z-50 bg-base shadow-lg'>
			<div className='flex w-full items-center justify-between overflow-hidden border-t border-secondary/10 px-6 py-3'>
				{enableRowSelection === true ? (
					<div className='flex-1 text-sm text-muted-foreground'>
						{table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length}{' '}
						row(s) selected.
					</div>
				) : null}
				<div className='flex flex-1 items-center justify-between space-x-6 lg:space-x-8'>
					<div className='flex items-center space-x-4'>
						<div className='flex items-center space-x-2'>
							<p className='text-sm font-medium'>Rows per page</p>
							<Select
								value={searchParams.get('limit') || '10'}
								onValueChange={(value) => {
									handleSearchParams({ limit: value });
								}}
							>
								<SelectTrigger aria-label='Rows per page' className='h-8 w-[70px]'>
									<SelectValue placeholder={searchParams.get('limit') || '10'} />
								</SelectTrigger>
								<SelectContent side='top'>
									{[10, 20, 30, 40, 50, 100].map((pageSize) => (
										<SelectItem key={pageSize} value={`${pageSize}`}>
											{pageSize}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className='flex items-center space-x-2'>
							<p className='text-sm font-medium'>Go to page</p>
							<DebouncedInput
								disabled={pagination?.total_page === 1}
								type='number'
								value={searchParams.get('page') || ''}
								min={1}
								max={pagination?.total_page}
								onChange={(value) => {
									handleSearchParams({ page: value.toString() });
								}}
								className='h-8 w-20 border'
								placeholder='1'
							/>
						</div>
					</div>

					<PaginateButtons
						onChange={(index) => {
							handleSearchParams({ page: `${index + 1}` });
						}}
						currentPage={searchParams.get('page') ? Number(searchParams.get('page')) - 1 : 0}
						totalPages={pagination?.total_page}
					/>
					<div className='flex items-center space-x-2'>
						<Button
							aria-label='Go to first page'
							variant='outline'
							className='hidden h-8 w-8 p-0 lg:flex'
							onClick={() => handleSearchParams({ page: '1' })}
							disabled={pagination?.current_page === 1}
						>
							<span className='sr-only'>Go to first page</span>
							<ChevronsLeft className='h-4 w-4' />
						</Button>
						<Button
							aria-label='Go to previous page'
							variant='outline'
							className='h-8 w-8 p-0'
							onClick={() => {
								handleSearchParams({ page: `${pagination?.current_page - 1}` });
							}}
							disabled={pagination?.current_page === 1}
						>
							<span className='sr-only'>Go to previous page</span>
							<ChevronLeft className='h-4 w-4' />
						</Button>
						<Button
							aria-label='Go to next page'
							variant='outline'
							className='h-8 w-8 p-0'
							onClick={() => {
								handleSearchParams({ page: `${pagination?.current_page + 1}` });
							}}
							disabled={pagination?.current_page === pagination?.total_page}
						>
							<span className='sr-only'>Go to next page</span>
							<ChevronRight className='h-4 w-4' />
						</Button>
						<Button
							aria-label='Go to last page'
							variant='outline'
							className='hidden h-8 w-8 p-0 lg:flex'
							onClick={() => {
								handleSearchParams({ page: `${pagination?.total_page}` });
							}}
							disabled={pagination?.current_page === pagination?.total_page}
						>
							<span className='sr-only'>Go to last page</span>
							<ChevronsRight className='h-4 w-4' />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
