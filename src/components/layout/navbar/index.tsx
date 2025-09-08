import { Scan } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import useLayout from '@/hooks/useLayout';

import BrandLogo from '@/components/others/brand-logo';
import GlobalBreadcrumbs from '@/components/others/global-breadcrumbs';

import { cn } from '@/lib/utils';

import SidebarCollapse from '../sidebar/collapse';
import SidebarMobileToggle from '../sidebar/mobile/toggle';

const Navbar = () => {
	const { isCollapsed, setIsCollapsed } = useLayout();
	const { pathname } = useLocation();
	const navigation = useNavigate();
	const homePage = pathname === '/';
	return (
		<div className='w-full border-b'>
			<div className='flex flex-col'>
				{/* Mobile View */}
				<div
					className={cn(
						'flex items-center justify-between gap-4 border-b bg-background px-4 py-1 md:hidden',
						homePage && 'border-none'
					)}
				>
					<BrandLogo className={'w-fit text-primary'} />
					<SidebarMobileToggle />
				</div>

				{/* Desktop View */}
				<div
					className={cn(
						'flex w-full items-center gap-6 px-4 py-1 md:px-0 md:py-0', // note w-full
						pathname === '/' && 'hidden md:block'
					)}
				>
					<div
						className='hidden w-fit cursor-pointer items-center border-r border-secondary/10 p-2 hover:bg-gray-300 md:flex'
						onClick={() => setIsCollapsed((prev) => !prev)}
					>
						<SidebarCollapse isCollapsed={isCollapsed} />
					</div>

					{!homePage && <GlobalBreadcrumbs />}

					<button
						className='ml-auto mr-2 flex gap-2 rounded-sm p-1 px-2 text-xs text-green-700 outline outline-1'
						
						onClick={() => navigation('/work/scanner')}
					>
						Scan
						<Scan size={16} />
					</button>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
