import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

import { API_IMAGE_URL } from '@/lib/secret';
import { cn } from '@/lib/utils';

const ColumnImage: React.FC<{
	src: string;
	alt: string;
	className?: string;
}> = ({ src, alt, className }) => {
	if (!src) return '-';
	return (
		<HoverCard>
			<HoverCardTrigger asChild>
				<Avatar className='size-12 border shadow-sm'>
					<AvatarImage
						src={API_IMAGE_URL + src}
						alt={alt}
						className={cn('object-cover object-top', className)}
					/>
					<AvatarFallback>{alt.split(' ')?.[0]?.at(0) + '' + alt.split(' ')?.[1]?.at(0)}</AvatarFallback>
				</Avatar>
			</HoverCardTrigger>
			<HoverCardContent align='center' className='z-[9999] w-80 p-2'>
				<img className='size-full rounded-lg object-contain' src={API_IMAGE_URL + src} alt={alt} />
			</HoverCardContent>
		</HoverCard>
	);
};

export default ColumnImage;
