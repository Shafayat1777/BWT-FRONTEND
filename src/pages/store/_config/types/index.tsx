import { IDefaultAddOrUpdateProps, IDefaultAttributeAddOrUpdateProps, IFileAddOrUpdateProps, IToast } from '@/types';
import { UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import {
	IAccessories,
	IAttributesTableData,
	IBoxTableData,
	IBranchTableData,
	IBrandTableData,
	ICategoryTableData,
	IContactUsTableData,
	IFloorTableData,
	IGroupTableData,
	IInternalTransferTableData,
	IModelTableData,
	IProductTableData,
	IPurchaseEntryTableData,
	IPurchaseReturnEntryTableData,
	IRackTableData,
	IReviewTableData,
	IRoomTableData,
	ISizeTableData,
	IStockTableData,
	IVendorTableData,
	IWarehouseTableData,
} from '../columns/columns.type';
import { IProductEntry, IReview } from '../schema';

//* Group
export interface IGroupAddOrUpdateProps extends IDefaultAddOrUpdateProps {
	updatedData?: IGroupTableData | null;
}
//* Contact Us
export interface IContactUsAddOrUpdateProps extends IDefaultAddOrUpdateProps {
	updatedData?: IContactUsTableData | null;
}
//* Review
export interface IReviewAddOrUpdateProps extends IDefaultAddOrUpdateProps {
	updatedData?: IReviewTableData | null;
}
// }

//* Brand
export interface IBrandAddOrUpdateProps extends IDefaultAddOrUpdateProps {
	updatedData?: IBrandTableData | null;
}

//* Category
export interface ICategoryAddOrUpdateProps extends IDefaultAddOrUpdateProps {
	updatedData?: ICategoryTableData | null;
}

//* Model
export interface IModelAddOrUpdateProps extends IDefaultAddOrUpdateProps {
	updatedData?: IModelTableData | null;
}

//* Size
export interface ISizeAddOrUpdateProps extends IDefaultAddOrUpdateProps {
	updatedData?: ISizeTableData | null;
}

//* Branch
export interface IBranchAddOrUpdateProps extends IDefaultAddOrUpdateProps {
	updatedData?: IBranchTableData | null;
}

//* Vendor
export interface IVendorAddOrUpdateProps extends IDefaultAddOrUpdateProps {
	updatedData?: IVendorTableData | null;
}

//* Stock
export interface IStockAddOrUpdateProps extends IDefaultAddOrUpdateProps {
	updatedData?: IStockTableData | null;
}

//* Product
export interface IProductAddOrUpdateProps extends IDefaultAddOrUpdateProps {
	updatedData?: IProductTableData | null;
}

//* Warehouse
export interface IWarehouseAddOrUpdateProps extends IDefaultAddOrUpdateProps {
	updatedData?: IWarehouseTableData | null;
}

//* Floor
export interface IFloorAddOrUpdateProps extends IDefaultAddOrUpdateProps {
	updatedData?: IFloorTableData | null;
}
//* Rack
export interface IRackAddOrUpdateProps extends IDefaultAddOrUpdateProps {
	updatedData?: IRackTableData | null;
}
//* Box
export interface IBoxAddOrUpdateProps extends IDefaultAddOrUpdateProps {
	updatedData?: IBoxTableData | null;
}
//* Accessories
export interface IAccessoriesAddOrUpdateProps extends IFileAddOrUpdateProps {
	updatedData?: IAccessories | null;
}
//*Room
export interface IRoomAddOrUpdateProps extends IDefaultAddOrUpdateProps {
	updatedData?: IRoomTableData | null;
}

//* Internal Transfer
export interface IInternalTransferAddOrUpdateProps {
	url: string;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setUpdatedData?: React.Dispatch<React.SetStateAction<any | null>>;
	updatedData?: IInternalTransferTableData | null;
	updateData: UseMutationResult<
		IToast,
		AxiosError<IToast, any>,
		{
			url: string;
			updatedData: any;
			isOnCloseNeeded?: boolean;
			onClose?: (() => void) | undefined;
		},
		any
	>;
}

//* Purchase Log
export interface IPurchaseLogAddOrUpdateProps {
	url: string;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setUpdatedData?: React.Dispatch<React.SetStateAction<any | null>>;
	updatedData?: IPurchaseEntryTableData | null;
	updateData: UseMutationResult<
		IToast,
		AxiosError<IToast, any>,
		{
			url: string;
			updatedData: any;
			isOnCloseNeeded?: boolean;
			onClose?: (() => void) | undefined;
		},
		any
	>;
}

//* Purchase Return Log
export interface IPurchaseReturnLogAddOrUpdateProps {
	url: string;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setUpdatedData?: React.Dispatch<React.SetStateAction<any | null>>;
	updatedData?: IPurchaseReturnEntryTableData | null;
	updateData: UseMutationResult<
		IToast,
		AxiosError<IToast, any>,
		{
			url: string;
			updatedData: any;
			isOnCloseNeeded?: boolean;
			onClose?: (() => void) | undefined;
		},
		any
	>;
}

export interface IAttributeAddOrUpdateProps extends IDefaultAttributeAddOrUpdateProps {
	updatedData: IProductEntry['product_variant'][number] | null;
}

export interface IAttributesAddOrUpdateProps extends IDefaultAddOrUpdateProps {
	updatedData: IAttributesTableData | null;
}

export interface IPopSerial {
	order_id: string;
	product_serial: string;
}
