import {
	Building2,
	Component,
	FileDigit,
	House,
	MapPin,
	MessageSquareMore,
	Phone,
	Pin,
	Ruler,
	SquareMenu,
	User,
	Warehouse,
} from 'lucide-react';

import ColumnImage from '@/components/core/data-table/_views/column-image';
import { CustomLink } from '@/components/others/link';

import { cn } from '@/lib/utils';

import { TLocationProps, TProblemProps, TProductProps, TStoreProductProps, TWarrantyProps } from '../types';

export const Product = ({ brand_name, model_name, serial_no }: TProductProps) => {
	return (
		<div className='flex flex-col gap-2'>
			{brand_name && (
				<div className='flex items-center gap-1'>
					<Building2 size={16} />
					<span>{brand_name}</span>
				</div>
			)}
			{model_name && (
				<div className='flex items-center gap-1'>
					<Component size={16} />
					<span>{model_name}</span>
				</div>
			)}
			{serial_no && (
				<div className='flex items-center gap-1'>
					<FileDigit size={16} />
					<span>{serial_no}</span>
				</div>
			)}
		</div>
	);
};
export const StoreProduct = ({ name, model_name, category_name, size_name }: TStoreProductProps) => {
	return (
		<div className='flex flex-col gap-2'>
			{name && (
				<div className='flex items-center gap-1'>
					<Building2 size={16} />
					<span className='flex-1'>{name + ' (' + size_name + ')'}</span>
				</div>
			)}
			{model_name && (
				<div className='flex items-center gap-1'>
					<Component size={16} />
					<span className='flex-1'>{model_name}</span>
				</div>
			)}
			{category_name && (
				<div className='flex items-center gap-1'>
					<SquareMenu size={16} />
					<span className='flex-1'>{category_name}</span>
				</div>
			)}
		</div>
	);
};

export const TableForColumn = ({ value, headers }: any) => {
	const rowStyle = 'border border-gray-300 px-2 py-1 text-xs';
	return (
		value?.length !== undefined &&
		value?.length > 0 && (
			<table className='border-2 border-gray-300'>
				<thead>
					<tr className='text-xs text-gray-600'>
						{headers.map((header: any, idx: number) => (
							<th key={idx} className={cn(rowStyle)}>
								{header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{value?.map((item: any, idx: number) => (
						<tr key={idx}>
							<td className={cn(rowStyle)}>{item.product_name}</td>
							<td className={cn(rowStyle)}>{item.serial_no}</td>
							<td className={cn(rowStyle)}>{item.branch_name}</td>
							<td className={cn(rowStyle)}>{item.warehouse_name}</td>
						</tr>
					))}
				</tbody>
			</table>
		)
	);
};
export const Problem = ({ problem_statement, problems_name }: TProblemProps) => {
	return (
		<div className='flex flex-col gap-2'>
			<div className='flex items-center gap-1'>
				<Pin size={14} />
				{problems_name}
			</div>
			{problem_statement && (
				<div className='flex items-center gap-1 text-sm text-gray-500'>
					<MessageSquareMore size={14} />
					{problem_statement}
				</div>
			)}
		</div>
	);
};

export const Location = ({ branch_name, warehouse_name, rack_name, floor_name, box_name }: TLocationProps) => {
	if (!branch_name) return '--';
	return (
		<div className='flex flex-col gap-2'>
			<div className='flex items-center gap-1'>
				<House className='size-4' />
				<span className='inline-block flex-1'>{branch_name}</span>
			</div>
			<div className='flex items-center gap-1'>
				<Warehouse className='size-4' />
				<span className='inline-block flex-1'>{warehouse_name}</span>
			</div>
			{(rack_name || floor_name || box_name) && (
				<div className='flex items-center gap-1'>
					<MapPin className='size-4' />
					<span className='inline-block flex-1 text-sm'>
						{rack_name}, {floor_name}, {box_name}
					</span>
				</div>
			)}
		</div>
	);
};
export const UserNamePhone = ({ user_name, phone }: { user_name: string; phone: string }) => {
	return (
		<div className='relative flex flex-shrink-0 items-center gap-2 overflow-hidden'>
			<div className='flex min-w-0 flex-col items-start gap-1'>
				<div className='flex w-full items-start gap-2 overflow-hidden'>
					<User className='size-4 flex-shrink-0' />
					<span className='line-clamp-1 flex-1 capitalize' title={user_name}>
						{user_name}
					</span>
				</div>
				<div className='flex items-start gap-2'>
					<Phone className='size-4 flex-shrink-0' />
					<span className='truncate text-[.8rem] capitalize' title={phone}>
						{phone}
					</span>
				</div>
			</div>
		</div>
	);
};

export const OrderImages = ({
	image_1,
	image_2,
	image_3,
}: {
	image_1?: string;
	image_2?: string;
	image_3?: string;
}) => {
	return (
		<div className='flex gap-2'>
			{image_1 && <ColumnImage src={image_1 as string} alt={'image_1'} />}
			{image_2 && <ColumnImage src={image_2 as string} alt={'image_2'} />}
			{image_3 && <ColumnImage src={image_3 as string} alt={'image_3'} />}
		</div>
	);
};

export const Address = ({ location, zone_name }: { location: string; zone_name: string }) => {
	return (
		<div className='flex flex-col gap-2'>
			<div className='flex items-center gap-1'>
				<MapPin className='size-4' />
				<span className='inline-block flex-1'>{location}</span>
			</div>
			<div className='flex items-center gap-1'>
				<Pin className='size-4' />
				<span className='inline-block flex-1 text-sm'>{zone_name}</span>
			</div>
		</div>
	);
};

export const OderID = ({
	info_uuid,
	uuid,
	order_id,
	reclaimed_order_uuid,
	reclaimed_order_id,
}: {
	info_uuid: string;
	uuid: string;
	order_id: string;
	reclaimed_order_uuid?: string;
	reclaimed_order_id?: string;
}) => {
	return (
		<div>
			<CustomLink
				url={`/work/info/details/${info_uuid}/order/details/${uuid}`}
				label={order_id as string}
				openInNewTab={true}
			/>
			{reclaimed_order_uuid && (
				<CustomLink
					url={`/work/info/details/${info_uuid}/order/details/${reclaimed_order_uuid}`}
					label={reclaimed_order_id as string}
					openInNewTab={true}
				/>
			)}
		</div>
	);
};
