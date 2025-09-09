import { z } from 'zod';

import {
	BOOLEAN_OPTIONAL,
	BOOLEAN_REQUIRED,
	NUMBER_DOUBLE_REQUIRED,
	PHONE_NUMBER_REQUIRED,
	STRING,
	STRING_ARRAY,
	STRING_ARRAY_OPTIONAL,
	STRING_NULLABLE,
	STRING_OPTIONAL,
	STRING_REQUIRED,
} from '@/utils/validators';

const customIssue = (message: string, path: string) => ({
	code: z.ZodIssueCode.custom,
	message: message,
	path: [path],
});

//*Order Schema
export const ORDER_SCHEMA = z
	.object({
		uuid: STRING_OPTIONAL,
		is_diagnosis_need: BOOLEAN_REQUIRED.default(false),
		is_transferred_for_qc: BOOLEAN_OPTIONAL.default(false),
		is_ready_for_delivery: BOOLEAN_OPTIONAL.default(false),
		is_proceed_to_repair: BOOLEAN_REQUIRED.default(false),
		brand_uuid: STRING_REQUIRED,
		model_uuid: STRING_REQUIRED,
		model_id: STRING_OPTIONAL,
		quantity: NUMBER_DOUBLE_REQUIRED,
		serial_no: STRING_OPTIONAL,
		problems_uuid: STRING_ARRAY,
		problem_statement: STRING_REQUIRED,
		accessories: STRING_ARRAY_OPTIONAL,
		warehouse_uuid: STRING_NULLABLE,
		rack_uuid: STRING_NULLABLE,
		floor_uuid: STRING_NULLABLE,
		box_uuid: STRING_NULLABLE,
		remarks: STRING_NULLABLE,

		// This is for the customer Order form
		image_1: z.instanceof(File).or(STRING_NULLABLE).optional(),

		image_2: z.instanceof(File).or(STRING_NULLABLE).optional(),

		image_3: z.instanceof(File).or(STRING_NULLABLE).optional(),
	})
	.superRefine((data, ctx) => {
		if (data?.problems_uuid.length === 0) {
			ctx.addIssue(customIssue('Required', 'problems_uuid'));
		}
	});
export const ORDER_NULL: Partial<IOrder> = {
	is_diagnosis_need: false,
	is_transferred_for_qc: false,
	is_ready_for_delivery: false,
	is_proceed_to_repair: false,
	brand_uuid: '',
	model_uuid: undefined,
	serial_no: '',
	quantity: 1,
	problems_uuid: [],
	problem_statement: '',
	accessories: [],
	warehouse_uuid: null,
	rack_uuid: null,
	floor_uuid: null,
	box_uuid: null,
	remarks: null,

	image_1: null,
	image_2: null,
	image_3: null,
};
export type IOrder = z.infer<typeof ORDER_SCHEMA>;

//* Info Schema
const ORDER_SCHEMA_FOR_INFO = (ORDER_SCHEMA as any)._def.schema.omit({
	model_uuid: STRING_OPTIONAL,
	brand_uuid: STRING_OPTIONAL,
	is_transferred_for_qc: true,
	is_ready_for_delivery: true,
});
export const INFO_SCHEMA = z
	.object({
		uuid: STRING_OPTIONAL,
		name: STRING_REQUIRED,
		phone: PHONE_NUMBER_REQUIRED,
		where_they_find_us: z.enum(['whatsapp', 'instagram', 'facebook', 'youtube', 'person', 'none']).optional(),
		location: STRING_REQUIRED,
		remarks: STRING_NULLABLE,
		service_type: z.enum(['monitor', 'display', 'all_in_one', 'accessories']).optional(),
		order_entry: z.array(ORDER_SCHEMA_FOR_INFO),
	})
	.superRefine((data, ctx) => {
		data?.order_entry.forEach((order, index) => {
			const serviceType = order?.data?.service_type;
			const hasModelUuid = !!order?.model_uuid;
			const hasBrandUuid = !!order?.brand_uuid;
			if (serviceType && serviceType !== 'accessories' && !hasModelUuid) {
				ctx.addIssue(customIssue('Required', `order_entry.${index}.model_uuid`));
			}
			if (serviceType && serviceType !== 'accessories' && !hasBrandUuid) {
				ctx.addIssue(customIssue('Required', `order_entry.${index}.brand_uuid`));
			}
		});
	});

export const INFO_NULL: Partial<IInfo> = {
	uuid: '',
	where_they_find_us: 'none',
	name: '',
	phone: '',
	location: '',
	order_entry: [ORDER_NULL as IOrder],
	remarks: null,
};

export type IInfo = z.infer<typeof INFO_SCHEMA>;

//* Diagnosis Schema
export const DIAGNOSIS_SCHEMA = z.object({
	problems_uuid: STRING_ARRAY,
	problem_statement: STRING_NULLABLE,
	customer_problem_statement: STRING_NULLABLE,
	status: z.enum(['pending', 'rejected', 'accepted', 'not_repairable']),
	proposed_cost: NUMBER_DOUBLE_REQUIRED,
	is_proceed_to_repair: BOOLEAN_OPTIONAL.default(false),
	remarks: STRING_NULLABLE,
	customer_remarks: STRING_NULLABLE,
});
export const DIAGNOSIS_NULL: Partial<IDiagnosis> = {
	problems_uuid: [],
	problem_statement: null,
	customer_problem_statement: null,
	status: 'pending',
	proposed_cost: 0,
	is_proceed_to_repair: false,
	remarks: null,
};
export type IDiagnosis = z.infer<typeof DIAGNOSIS_SCHEMA>;

//* Section Schema
export const SECTION_SCHEMA = z.object({
	uuid: STRING_OPTIONAL,
	name: STRING_OPTIONAL,
	remarks: STRING_NULLABLE,
});
export const SECTION_NULL: Partial<ISection> = {
	uuid: '',
	name: '',
	remarks: null,
};
export type ISection = z.infer<typeof SECTION_SCHEMA>;

//* Problem Schema
export const PROBLEM_SCHEMA = z.object({
	uuid: STRING_OPTIONAL,
	name: STRING_REQUIRED,
	category: z.enum(['customer', 'employee']),
	remarks: STRING_NULLABLE,
});
export const PROBLEM_NULL: Partial<IProblem> = {
	uuid: '',
	name: '',
	category: 'customer',
	remarks: null,
};
export type IProblem = z.infer<typeof PROBLEM_SCHEMA>;
//* Process Schema
export const PROCESS_SCHEMA = z.object({
	problems_uuid: STRING_ARRAY_OPTIONAL,
	problem_statement: STRING_NULLABLE,
	status: BOOLEAN_OPTIONAL,
	status_update_date: STRING_NULLABLE,
	is_transferred_for_qc: BOOLEAN_OPTIONAL,
	is_ready_for_delivery: BOOLEAN_OPTIONAL,
	warehouse_uuid: STRING_REQUIRED,
	rack_uuid: STRING_NULLABLE,
	floor_uuid: STRING_NULLABLE,
	box_uuid: STRING_NULLABLE,
	remarks: STRING_NULLABLE,
});

export const PROCESS_NULL: Partial<IWorkProcess> = {
	problems_uuid: [],
	problem_statement: null,
	status: undefined,
	status_update_date: undefined,
	is_transferred_for_qc: undefined,
	is_ready_for_delivery: undefined,
	warehouse_uuid: undefined,
	rack_uuid: undefined,
	floor_uuid: undefined,
	box_uuid: undefined,
	remarks: null,
};
export type IWorkProcess = z.infer<typeof PROCESS_SCHEMA>;

//* Transfer Process Section Schema
export const TRANSFER_PROCESS_SECTION_SCHEMA = z.object({
	entry: z.array(
		z.object({
			uuid: STRING_OPTIONAL,
			section_uuid: STRING_OPTIONAL,
			remarks: STRING_NULLABLE,
		})
	),
});
export const TRANSFER_PROCESS_SECTION_NULL: Partial<IWorkTransfer> = {
	entry: [
		{
			uuid: undefined,
			section_uuid: '',
			remarks: null,
		},
	],
};
export type IWorkTransfer = z.infer<typeof TRANSFER_PROCESS_SECTION_SCHEMA>;

//* Zone Schema
export const ZONE_SCHEMA = z.object({
	name: STRING_OPTIONAL,
	division: STRING_REQUIRED,
	latitude: STRING_OPTIONAL,
	longitude: STRING_OPTIONAL,
	remarks: STRING_NULLABLE,
});
export const ZONE_NULL: Partial<IWorkZone> = {
	name: '',
	division: '',
	latitude: undefined,
	longitude: undefined,
	remarks: null,
};
export type IWorkZone = z.infer<typeof ZONE_SCHEMA>;

//* Accessories Schema
export const ACCESSORIES_SCHEMA = z.object({
	uuid: STRING_OPTIONAL,
	name: STRING_OPTIONAL,
	remarks: STRING_NULLABLE,
});
export const ACCESSORIES_NULL: Partial<IAccessories> = {
	uuid: '',
	name: '',
	remarks: null,
};
export type IAccessories = z.infer<typeof ACCESSORIES_SCHEMA>;
