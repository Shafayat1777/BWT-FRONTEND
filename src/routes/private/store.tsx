import { lazy } from 'react';
import { IRoute } from '@/types';

const Group = lazy(() => import('@/pages/store/group'));
const Category = lazy(() => import('@/pages/store/category'));
const Brand = lazy(() => import('@/pages/store/brand'));
const Model = lazy(() => import('@/pages/store/model'));
const Size = lazy(() => import('@/pages/store/size'));
const Vendor = lazy(() => import('@/pages/store/vendor'));
const Product = lazy(() => import('@/pages/store/product'));
const Stock = lazy(() => import('@/pages/store/stock'));
const Branch = lazy(() => import('@/pages/store/branch'));
const Warehouse = lazy(() => import('@/pages/store/warehouse'));
const Rack = lazy(() => import('@/pages/store/rack'));
const Floor = lazy(() => import('@/pages/store/floor'));
const Box = lazy(() => import('@/pages/store/box'));
const Purchase = lazy(() => import('@/pages/store/purchase'));
const PurchaseAddOrUpdate = lazy(() => import('@/pages/store/purchase/add-or-update'));
const PurchaseDetails = lazy(() => import('@/pages/store/purchase/details'));
const PurchaseReturn = lazy(() => import('@/pages/store/purchase-return'));
const PurchaseReturnAddOrUpdate = lazy(() => import('@/pages/store/purchase-return/add-or-update'));
const PurchaseReturnDetails = lazy(() => import('@/pages/store/purchase-return/details'));
const Log = lazy(() => import('@/pages/store/log'));
const ProductTransferOrderAgainst = lazy(() => import('@/pages/store/product/trx-against-order'));
const ProductInternalTransfer = lazy(() => import('@/pages/store/product/trx'));
const Attributes = lazy(() => import('@/pages/store/attributes'));
const ProductEntry = lazy(() => import('@/pages/store/product-entry'));
const ProductEntryAddOrUpdate = lazy(() => import('@/pages/store/product-entry/add-or-update'));
const ProductEntryDetails = lazy(() => import('@/pages/store/product-entry/details'));

const StoreRoutes: IRoute[] = [
	{
		name: 'Store',
		children: [
			{
				name: 'Product Entry',
				path: '/store/product-entry',
				element: <ProductEntry />,
				page_name: 'store__product_entry',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Product Entry Add',
				path: '/store/product-entry/add',
				element: <ProductEntryAddOrUpdate />,
				hidden: true,
				page_name: 'store__product_entry_add',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Product Entry Update',
				path: '/store/product-entry/:uuid/update',
				element: <ProductEntryAddOrUpdate />,
				hidden: true,
				page_name: 'store__product_entry_update',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Product Entry Details',
				path: '/store/product-entry/:uuid/details',
				element: <ProductEntryDetails />,
				hidden: true,
				page_name: 'store__product_entry_details',
				actions: ['read'],
			},
			{
				name: 'Product',
				path: '/store/product',
				element: <Product />,
				page_name: 'store__product',
				actions: ['create', 'read', 'update', 'delete', 'click_trx', 'click_order_trx'],
			},
			{
				name: 'Product Order Transfer',
				path: '/store/product/:uuid/order-against-warehouse-trx/:warehouse_uuid',
				element: <ProductTransferOrderAgainst />,
				hidden: true,
				page_name: 'store__product_transfer_order_against',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Product Internal Transfer',
				path: '/store/internal-transfer/:uuid',
				element: <ProductInternalTransfer />,
				hidden: true,
				page_name: 'store__product_internal_transfer',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Purchase',
				path: '/store/purchase',
				element: <Purchase />,
				page_name: 'store__purchase',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Purchase Add',
				path: '/store/purchase/add',
				element: <PurchaseAddOrUpdate />,
				page_name: 'store__purchase_add',
				hidden: true,
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Purchase Update',
				path: '/store/purchase/:uuid/update',
				element: <PurchaseAddOrUpdate />,
				page_name: 'store__purchase_update',
				hidden: true,
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Purchase Details',
				path: '/store/purchase/:uuid/details',
				element: <PurchaseDetails />,
				page_name: 'store__purchase_details',
				hidden: true,
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Purchase Return',
				path: '/store/purchase-return',
				element: <PurchaseReturn />,
				page_name: 'store__purchase_return',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Purchase Return Add',
				path: '/store/purchase-return/add',
				element: <PurchaseReturnAddOrUpdate />,
				page_name: 'store__purchase_return_add',
				hidden: true,
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Purchase Return Update',
				path: '/store/purchase-return/:uuid/update',
				element: <PurchaseReturnAddOrUpdate />,
				page_name: 'store__purchase_return_update',
				hidden: true,
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Purchase Return Details',
				path: '/store/purchase-return/:uuid/details',
				element: <PurchaseReturnDetails />,
				page_name: 'store__purchase_return_details',
				hidden: true,
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Library',
				children: [
					{
						name: 'Vendor',
						path: '/store/vendor',
						element: <Vendor />,
						page_name: 'store__vendor',
						actions: ['create', 'read', 'update', 'delete'],
					},
					{
						name: 'Size',
						path: '/store/size',
						element: <Size />,
						page_name: 'store__size',
						actions: ['create', 'read', 'update', 'delete'],
					},
					{
						name: 'Model',
						path: '/store/model',
						element: <Model />,
						page_name: 'store__model',
						actions: ['create', 'read', 'update', 'delete'],
					},
					{
						name: 'Brand',
						path: '/store/brand',
						element: <Brand />,
						page_name: 'store__brand',
						actions: ['create', 'read', 'update', 'delete'],
					},
					{
						name: 'Category',
						path: '/store/category',
						element: <Category />,
						page_name: 'store__category',
						actions: ['create', 'read', 'update', 'delete'],
					},
					{
						name: 'Group',
						path: '/store/group',
						element: <Group />,
						page_name: 'store__group',
						actions: ['create', 'read', 'update', 'delete'],
					},

					// {
					// 	name: 'Room',
					// 	path: '/store/room',
					// 	element: <Room />,
					// 	page_name: 'store__room',
					// 	actions: ['create', 'read', 'update', 'delete'],
					// },
					{
						name: 'Box',
						path: '/store/box',
						element: <Box />,
						page_name: 'store__box',
						actions: ['create', 'read', 'update', 'delete'],
					},
					{
						name: 'Floor',
						path: '/store/floor',
						element: <Floor />,
						page_name: 'store__floor',
						actions: ['create', 'read', 'update', 'delete'],
					},
					{
						name: 'Rack',
						path: '/store/rack',
						element: <Rack />,
						page_name: 'store__rack',
						actions: ['create', 'read', 'update', 'delete'],
					},
					{
						name: 'Warehouse',
						path: '/store/warehouse',
						element: <Warehouse />,
						page_name: 'store__warehouse',
						actions: ['create', 'read', 'update', 'delete'],
					},
					{
						name: 'Branch',
						path: '/store/branch',
						element: <Branch />,
						page_name: 'store__branch',
						actions: ['create', 'read', 'update', 'delete'],
					},
					{
						name: 'Attributes',
						path: '/store/attributes',
						element: <Attributes />,
						page_name: 'store__attributes',
						actions: ['create', 'read', 'update', 'delete'],
					},
				],
			},
			{
				name: 'Log',
				path: '/store/log',
				element: <Log />,
				page_name: 'store__log',
				actions: [
					'read',
					'update',
					'delete',
					'click_internal_transfer_update',
					'click_internal_transfer_delete',
					'click_order_transfer_update',
					'click_order_transfer_delete',
				],
			},
		],
	},
];
export default StoreRoutes;
