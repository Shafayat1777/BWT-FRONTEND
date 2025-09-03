import { lazy } from 'react';
import { Column } from '@/pages/test';
import Accessories from '@/pages/work/accessories';
import Zone from '@/pages/work/delivery-zone';
import Diagnosis from '@/pages/work/diagonsis';
import Info from '@/pages/work/info';
import InfoEntry from '@/pages/work/info/add-or-update';
import InfoDetails from '@/pages/work/info/details';
import IsReadyForDelivery from '@/pages/work/is-ready-deliver';
import Order from '@/pages/work/order';
import OrderDetails from '@/pages/work/order/details/';
import Process from '@/pages/work/order/details/process';
import Problem from '@/pages/work/problem';
import QC from '@/pages/work/qc';
import Repairing from '@/pages/work/repairing';
import RepairingEntry from '@/pages/work/repairing/add-or-update';
import Section from '@/pages/work/section';
import { IRoute } from '@/types';

import Chat from '@/components/others/message';

const User = lazy(() => import('@/pages/hr/user'));

const workRoutes: IRoute[] = [
	{
		name: 'Work',
		children: [
			{
				name: 'User',
				path: '/hr/user',
				element: <User />,
				page_name: 'admin__user',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_status',
					'click_reset_password',
					'click_page_assign',
					'click_rating_change',
					'create_employee',
				],
			},
			{
				name: 'Info',
				path: '/work/info',
				element: <Info />,
				page_name: 'work__info',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_contact_with_customer_override',
				],
			},

			{
				name: 'Info Entry',
				path: '/work/info/entry',
				element: <InfoEntry />,
				page_name: 'work__info_entry',
				hidden: true,
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Info Update',
				path: '/work/info/:uuid/update',
				element: <InfoEntry />,
				page_name: 'work__info_update',
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
				name: 'Order',
				path: '/work/order',
				element: <Order />,
				page_name: 'work__order',
				actions: ['read', 'update', 'delete', 'click_trx', 'click_proceed_to_repair', 'click_diagnosis_need'],
			},
			{
				name: 'Order Details',
				path: '/work/info/details/:info_uuid/order/details/:uuid',
				element: <OrderDetails />,
				page_name: 'work__order_details',
				hidden: true,
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_transfer_qc',
					'click_transfer_delivery',
					'click_proceed_to_repair',
					'click_diagnosis_need',
				],
			},
			{
				name: 'Diagnosis',
				path: '/work/diagnosis',
				element: <Diagnosis />,
				page_name: 'work__diagnosis',
				actions: ['read', 'update', 'delete', 'click_trx'],
			},
			{
				name: 'Repairing',
				path: '/work/repairing',
				element: <Repairing />,
				page_name: 'work__repairing',
				actions: [
					'read',
					'update',
					'click_transfer_qc',
					'click_transfer_delivery',
					'click_order_transfer',
					'click_trx',
				],
			},
			// {
			// 	name: 'chat',
			// 	path: '/work/chat',
			// 	element: <Chat />,
			// 	page_name: 'work__chat',
			// 	actions: ['create', 'read', 'update', 'delete'],
			// },
			{
				name: 'Repairing Update',
				path: '/work/repairing/update/:uuid',
				element: <RepairingEntry />,
				page_name: 'work__repairing_update',
				hidden: true,
				actions: ['read', 'update', 'delete'],
			},
			{
				name: 'QC',
				path: '/work/qc',
				element: <QC />,
				page_name: 'work__qc',
				actions: ['read', 'update', 'click_transfer_delivery'],
			},
			{
				name: 'Process',
				path: '/work/process',
				element: <Process />,
				hidden: true,
				page_name: 'work__process',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Ready For Delivery',
				path: '/work/ready-for-delivery',
				element: <IsReadyForDelivery />,
				page_name: 'work__is_ready_for_delivery',
				actions: ['read', 'update'],
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
					{
						name: 'Zone',
						path: '/work/zone',
						element: <Zone />,
						page_name: 'work__zone',
						actions: ['create', 'read', 'update', 'delete'],
					},
					{
						name: 'Accessories',
						path: '/work/accessory',
						element: <Accessories />,
						page_name: 'work__accessory',
						actions: ['create', 'read', 'update', 'delete'],
					},
				],
			},
		],
	},
];
export default workRoutes;
