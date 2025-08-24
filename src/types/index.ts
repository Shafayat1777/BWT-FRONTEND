import { UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { RouteObject } from 'react-router-dom';



import { IFormSelectOption } from '@/components/core/form/types';
import { UseFormReturn } from 'react-hook-form';
import { IProductEntry } from '@/pages/store/_config/schema';





export * from './table-filter-ssr';

export type IAuthResponse = {
	status: number;
	type: string;
	message: string;
	token: string;
	user: IUser;
	can_access: { [key: string]: string };
};

export type IToast = {
	status: number;
	type: 'create' | 'insert' | 'delete' | 'error' | 'warning' | 'update' | string;
	message: string;
};

export type IResponse<T> = {
	toast: IToast;
	data: T;
	pagination: IPagination;
};

export type IParams = {
	start_date?: Date | string | undefined;
	end_date?: Date | string | undefined;
	status?: boolean | undefined;
};

export type IStartEndDateProps = {
	start_date: Date | undefined;
	end_date: Date | undefined;
};

export type IUser = {
	uuid: string;
	name: string;
	department: string;
	employee_uuid: string;
	user_type: 'employee' | 'customer' | 'vendor';
};

export type IRoute = RouteObject & {
	name: string;
	children?: IRoute[];
	hidden?: boolean;
	page_name?: string;
	actions?: string[];
	disableCollapse?: boolean;
	page_type?: {
		type: 'library' | 'entry' | 'update' | 'normal' | 'custom';
		name: string;
	};
};

export type ITableFacetedFilter = {
	id: string;
	title: string;
	options: {
		label: string;
		value: string;
		icon?: React.ComponentType<{ className?: string }>;
	}[];
};

export type ITableAdvanceFilter = {
	state: boolean | undefined;
	options?: IFormSelectOption[];
	label: string;
	onStateChange: (type?: string) => void;
	clear: () => void;
};

export type IToolbarOptions =
	| 'all'
	| 'all-filter'
	| 'view'
	| 'date-range'
	| 'faceted-filter'
	| 'advance-filter'
	| 'export-csv'
	| 'export-pdf'
	| 'refresh'
	| 'new-entry'
	| 'other';

export type IDeleteModal = {
	id: string;
	name: string;
} | null;

export interface IDefaultAddOrUpdateProps {
	url: string;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;

	setUpdatedData?: React.Dispatch<React.SetStateAction<any | null>>;
	postData: UseMutationResult<
		IToast,
		AxiosError<IToast, any>,
		{
			url: string;
			newData: any;
			isOnCloseNeeded?: boolean;
			onClose?: (() => void) | undefined;
		},
		any
	>;
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

export interface IDefaultAttributeAddOrUpdateProps {
	url: string;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setUpdatedData?: React.Dispatch<React.SetStateAction<any | null>>;
	postData: UseMutationResult<
		IToast,
		AxiosError<IToast, any>,
		{
			url: string;
			newData: any;
			isOnCloseNeeded?: boolean;
			onClose?: (() => void) | undefined;
		},
		any
	>;
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
	deleteData: UseMutationResult<
		IToast,
		AxiosError<IToast, any>,
		{
			url: string;
			isOnCloseNeeded?: boolean;
			onClose?: (() => void) | undefined;
		},
		void
	>;
	form: UseFormReturn<IProductEntry>;
}

export interface IDefaultAddProps {
	url: string;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;

	setUpdatedData?: React.Dispatch<React.SetStateAction<any | null>>;
	postData: UseMutationResult<
		IToast,
		AxiosError<IToast, any>,
		{
			url: string;
			newData: any;
			isOnCloseNeeded?: boolean;
			onClose?: (() => void) | undefined;
		},
		any
	>;
}
export interface IDefaultUpdateProps {
	url: string;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;

	setUpdatedData?: React.Dispatch<React.SetStateAction<any | null>>;
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
export interface IFileAddOrUpdateProps {
	url: string;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;

	setUpdatedData?: React.Dispatch<React.SetStateAction<any | null>>;
	imagePostData: UseMutationResult<
		IToast,
		AxiosError<IToast, any>,
		{
			url: string;
			newData: any;
			isOnCloseNeeded?: boolean;
			onClose?: (() => void) | undefined;
		},
		any
	>;
	imageUpdateData: UseMutationResult<
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

export type IPaginationQuery = {
	page: string;
	limit: string;
	orderby: 'asc' | 'desc';
	sort: string;
	q: string;
	start_date: string | undefined;
	end_date: string | undefined;
	is_pagination?: string;
	[key: string]: string | number | undefined;
};

export type IPagination = {
	total_record: number;
	current_page: number;
	total_page: number;
	next_page: number | null;
	prev_page: number | null;
};

export type IStatus = 'pending' | 'approved' | 'rejected';