import { Column } from '@/pages/test';
import Diagnosis from '@/pages/work/diagonsis';
import Order from '@/pages/work/order';
import OrderEntry from '@/pages/work/order/add-or-update';
import InfoDetails from '@/pages/work/order/details';
import OrderDetails from '@/pages/work/order/details/order-details';
import Problem from '@/pages/work/problem';
import Section from '@/pages/work/section';
import { IRoute } from '@/types';

const workRoutes: IRoute[] = [
	{
		name: 'Work',
		children: [
			{
				name: 'Order',
				path: '/work/order',
				element: <Order />,
				page_name: 'work__order',
				actions: ['create', 'read', 'update', 'delete', 'click_trx'],
			},
			{
				name: 'Order Entry',
				path: '/work/order/entry',
				element: <OrderEntry />,
				page_name: 'work__order_entry',
				hidden: true,
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Order Update',
				path: '/work/order/:uuid/update',
				element: <OrderEntry />,
				page_name: 'work__order_update',
				hidden: true,
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Info Details',
				path: '/work/info/details/:uuid',
				element: <InfoDetails />,
				page_name: 'work__info_details',
				hidden: true,
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Order Details',
				path: '/work/info/details/:info_uuid/order/details/:uuid',
				element: <OrderDetails />,
				page_name: 'work__order_details',
				hidden: true,
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Diagnosis',
				path: '/work/diagnosis',
				element: <Diagnosis />,
				page_name: 'work__diagnosis',
				actions: ['read', 'update', 'delete', 'click_trx'],
			},
			{
				name: 'Transfer Process Section',
				path: '/work/transfer-section/:info_uuid/:diagnosis_uuid/:order_uuid',
				element: <Column />,
				hidden: true,
				page_name: 'work_transfer',
				actions: ['create', 'read', 'update', 'delete'],
			},
			// {
			// 	name: 'Test',
			// 	path: '/work/test',
			// 	element: <Column />,
			// 	page_name: 'work__order',
			// 	actions: ['create', 'read', 'update', 'delete'],
			// },
			{
				name: 'Library',
				children: [
					{
						name: 'Problem',
						path: '/work/problem',
						element: <Problem />,
						page_name: 'work__problem',
						actions: ['create', 'read', 'update', 'delete'],
					},
					{
						name: 'Section',
						path: '/work/section',
						element: <Section />,
						page_name: 'work__section',
						actions: ['create', 'read', 'update', 'delete'],
					},
				],
			},
		],
	},
];
export default workRoutes;
