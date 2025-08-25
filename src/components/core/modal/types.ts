import { IToast } from '@/types';
import { UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { UseFormReturn } from 'react-hook-form';

export interface IDeleteAllModalProps {
	deleteItems:
		| {
				id: string;
				name: string;
				checked: boolean;
		  }[]
		| null;
	setDeleteItems: React.Dispatch<
		React.SetStateAction<
			| {
					id: string;
					name: string;
					checked: boolean;
			  }[]
			| null
		>
	>;
	url: string;
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
	onClose?: () => void;
}

export interface IDeleteModalProps {
	deleteItem: {
		type?: string;
		url?: string;
		id: string | number | null;
		name: string | null;
	} | null;
	setDeleteItem: React.Dispatch<
		React.SetStateAction<{
			type?: string;
			url?: string;
			id: string;
			name: string;
		} | null>
	>;
	url: string;
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
	needRefresh?: boolean;
	invalidateQueries?: () => void;

	onClose?: () => void;
}

export interface IAddModalProps {
	form: UseFormReturn<any, any, undefined>;
	onSubmit(values: any): void;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	title?: string;
	subtitle?: string;
	children?: React.ReactNode;
	className?: string;
	isSmall?: boolean;
	isLarge?: boolean;
	containerClassName?: string;
}

export interface IRichTextModalProps {
	title: string;
	content: string;
	className?: string;
	isSmall?: boolean;
}
export interface IContentModalProps {
	title: string;
	content: string;
	className?: string;
	isSmall?: boolean;
}
export interface IDetailsModalProps {
	title?: string;
	content: string | React.ReactNode;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	className?: string;
	isSmall?: boolean;
}
