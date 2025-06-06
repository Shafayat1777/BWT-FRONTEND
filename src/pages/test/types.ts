import { StringOrTemplateHeader } from '@tanstack/react-table';
import { FieldArrayWithId, UseFormReturn } from 'react-hook-form';

import { IFormSelectOption } from '@core/form/types';

type FieldReadonly = {
	type: 'readOnly';
};
type FieldCustom = {
	type: 'custom';
	component: (index: number) => React.ReactNode;
};

type FieldText = {
	type: 'text';
	// inputType?: 'text' | 'number';
	placeholder?: string;
};
type FieldTextArea = {
	type: 'textarea';
	placeholder?: string;
};
type FieldNumber = {
	type: 'number';
	placeholder?: string;
};

type FieldSelect = {
	type: 'select';
	placeholder?: string;
	options: IFormSelectOption[];
};

type FieldJoinInputUnit = {
	type: 'join-input-unit';
	placeholder?: string;
	unit: (index: number) => string;
	inputType?: string;
};

export type FieldDef = {
	header: string;
	accessorKey: string;
	className?: string;
	isLoading?: boolean;
	hidden?: boolean;
} & (FieldText | FieldNumber | FieldSelect | FieldReadonly | FieldCustom | FieldJoinInputUnit | FieldTextArea);

export interface KanbanProps {
	title: string;
	form: UseFormReturn<any>;
	fieldName: string;
	fieldDefs: FieldDef[];
	extraHeader?: React.ReactNode;
	handleAdd?: () => void;
	fields: FieldArrayWithId<any>[];
}

export interface ICard {
	uuid: string;
	section_uuid: string;
	index?: number;
	remarks?: string;
	handleDragStart?: (e: React.DragEvent<HTMLDivElement>, card: ICard) => void;
}

export interface ColumnProps {
	title: string;
	headingColor: string;
	cards: { title: string; id: string; column: string }[];
	column: string;
	setCards: React.Dispatch<React.SetStateAction<ICard[]>>;
}

export interface IAddCard {
	setCards: React.Dispatch<React.SetStateAction<ICard[]>>;
}
export interface AddCardFormData {
	uuid?: string;
	section_uuid: string;
	remarks: string | null;
}
export interface WorkSectionData {
	info_id: string;
	order_id: string;
	diagnosis_id: string;
	entry: ICard[];
}
export interface DynamicFieldsProps {
	title: string;
	form: UseFormReturn<any>;
	fieldName: string;
	fieldDefs: FieldDef[];
	extraHeader?: React.ReactNode;
	handleAdd?: () => void;
	fields: FieldArrayWithId<any>[];
	viewAs?: 'default' | 'spreadsheet';
}
