//
import React from 'react';
import { CheckboxProps } from '@radix-ui/react-checkbox';
import { OTPInputProps } from 'input-otp';
import { DayPickerProps } from 'react-day-picker';
import { DropzoneOptions } from 'react-dropzone';
import { ControllerFieldState, ControllerRenderProps, UseFormReturn, UseFormStateReturn } from 'react-hook-form';

import { InputProps } from '@/components/ui/input';
import { TextareaProps } from '@/components/ui/textarea';

// * form-textarea
export interface FormTextareaProps extends TextareaProps {
	field: ControllerRenderProps<any, any>;
	fieldState: ControllerFieldState;
	formState: UseFormStateReturn<any>;
	label?: string;
	placeholder?: string;
	optional?: boolean;
	disableLabel?: boolean;
}
export interface Color {
	h: number;
	s: number;
	v: number;
	r: number;
	g: number;
	b: number;
	a: number;
	hex: string;
	rgba: string;
}
// * form-select
export interface IFormSelectOption {
	label: string | number;
	value: string | number;
}

export interface FormSelectProps {
	field: ControllerRenderProps<any, any>;
	fieldState: ControllerFieldState;
	formState: UseFormStateReturn<any>;
	label?: string;
	placeholder?: string;
	optional?: boolean;
	options: IFormSelectOption[];
	isDisabled?: boolean;
	disableLabel?: boolean;
	valueType?: 'string' | 'number';
	onChange?: (value: any) => void;
}

// * form-section
export interface IFormSectionProps {
	title?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
	extraHeader?: React.ReactNode;
}

// * form-react-select
export interface IFormSelectOption {
	label: string | number;
	value: string | number;
}

export interface FormReactSelectProps {
	field: ControllerRenderProps<any, any>;
	fieldState: ControllerFieldState;
	formState: UseFormStateReturn<any>;
	label?: string;
	placeholder?: string;
	optional?: boolean;
	options: IFormSelectOption[];
	isDisabled?: boolean;
	disableLabel?: boolean;
	isMulti?: boolean;
	menuPortalTarget?: any;
	valueType?: 'string' | 'number';
}

// * form-multi-select
export interface IFormSelectOption {
	label: string | number;
	value: string | number;
}

export interface FormMultiSelectProps {
	field: ControllerRenderProps<any, any>;
	fieldState: ControllerFieldState;
	formState: UseFormStateReturn<any>;
	label?: string;
	placeholder?: string;
	optional?: boolean;
	options: IFormSelectOption[];
	isDisabled?: boolean;
	disableLabel?: boolean;
}

// * form-join-input-unit
export interface FormJoinInputUnitProps extends InputProps {
	field: ControllerRenderProps<any, any>;
	fieldState: ControllerFieldState;
	formState: UseFormStateReturn<any>;
	label?: string;
	subLabel?: string;
	placeholder?: string;
	optional?: boolean;
	icon?: React.ReactNode;
	unit: string;
	disableLabel?: boolean;
	disabled?: boolean;
}

// * form-join-input-select
export interface FormJoinInputSelectProps extends InputProps {
	field: ControllerRenderProps<any, any>;
	fieldState: ControllerFieldState;
	formState: UseFormStateReturn<any>;
	label?: string;
	subLabel?: string;
	placeholder?: string;
	optional?: boolean;
	icon?: React.ReactNode;
	selectField: {
		name: string;
		options: IFormSelectOption[];
		isDisabled?: boolean;
	};
}

// * form-input
export interface FormInputProps extends InputProps {
	field: ControllerRenderProps<any, any>;
	fieldState: ControllerFieldState;
	formState: UseFormStateReturn<any>;
	label?: string;
	subLabel?: string;
	placeholder?: string;
	optional?: boolean;
	icon?: React.ReactNode;
	disableLabel?: boolean;
}

// * form-switch
export interface FormSwitchProps extends CheckboxProps {
	field: ControllerRenderProps<any, any>;
	fieldState: ControllerFieldState;
	formState: UseFormStateReturn<any>;
	label?: string;
	placeholder?: string;
	optional?: boolean;
	icon?: React.ReactNode;
	disableLabel?: boolean;
	labelClassName?: string;
	isBoxed?: boolean;
}

// * form-phone
export type FormOtpProps = Omit<OTPInputProps, 'children'> & {
	field: ControllerRenderProps<any, any>;
	fieldState: ControllerFieldState;
	formState: UseFormStateReturn<any>;
	label?: string;
	subLabel?: string;
	optional?: boolean;
	disableLabel?: boolean;
};

// * form-date-picker
export interface FormDatePickerProps {
	field: ControllerRenderProps<any, any>;
	fieldState: ControllerFieldState;
	formState: UseFormStateReturn<any>;
	label?: string;
	subLabel?: string;
	placeholder?: string;
	optional?: boolean;
	icon?: React.ReactNode;
	disableLabel?: boolean;
	className?: string;
	calendarProps?: DayPickerProps;
	disabled?: boolean;
}

// * form-checkbox
export interface FormCheckboxProps extends CheckboxProps {
	field: ControllerRenderProps<any, any>;
	fieldState: ControllerFieldState;
	formState: UseFormStateReturn<any>;
	label?: string;
	placeholder?: string;
	optional?: boolean;
	icon?: React.ReactNode;
	disableLabel?: boolean;
	labelClassName?: string;
	isBoxed?: boolean;
}

// * form-add-edit-wrapper
export interface IFormAddEditWrapperProps {
	children: React.ReactNode;
	form: UseFormReturn<any, any, undefined>;
	onSubmit(values: any): void;
	title?: string;
	isSubmitDisable?: boolean;
}
// * form-file-upload
export interface FormFileUploadProps extends InputProps {
	field: ControllerRenderProps<any, any>;
	fieldState: ControllerFieldState;
	formState: UseFormStateReturn<any>;
	label?: string;
	subLabel?: string;
	placeholder?: string;
	optional?: boolean;
	disableLabel?: boolean;
	options?: DropzoneOptions;
	isUpdate?: boolean;
	fileType?: 'image' | 'document' | 'all' | 'video' | 'audio';
	errorText?: string;
}
