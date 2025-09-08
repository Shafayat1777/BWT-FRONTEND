import React from 'react';

import { FormField } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CoreForm from '@core/form';

import { cn } from '@/lib/utils';

import { DynamicFieldsProps } from '../../form-dynamic-fields/types';

const DefaultDynamicFields: React.FC<Omit<DynamicFieldsProps, 'title' | 'viewAs' | 'extraButtons' | 'handleAdd'>> = ({
	fields,
	fieldName,
	fieldDefs,
	startIndex = 0,
	form,
	children,
}) => {
	return (
		<div className='overflow-x-auto rounded-b-md border border-t-0'>
			<Table className='w-full'>
				<TableHeader>
					<TableRow className='h-8 divide-x-[1px]'>
						{fieldDefs
							.filter((field) => !field.hidden)
							.map((field) => field.header)
							.map((header) => (
								<TableHead key={header}>{header}</TableHead>
							))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{fields.length === 0 && (
						<TableRow>
							<TableCell className='text-center' colSpan={fieldDefs.length}>
								<p className='text-destructive'>No fields added yet</p>
							</TableCell>
						</TableRow>
					)}
					{fields.length > 0 &&
						fields.map((field, fieldIndex) => (
							<TableRow key={field.id} className='divide-x-[1px] hover:bg-base-150'>
								{fieldDefs
									.filter((fieldDef) => !fieldDef.hidden)
									.map((fieldDef) => {
										if (fieldDef.isLoading) {
											return (
												<TableCell className={cn('first:pl-2 last:pr-2', fieldDef.className)}>
													<Skeleton className='h-8 w-full bg-secondary/10' />
												</TableCell>
											);
										} else {
											return (
												<TableCell
													style={{
														width:
															typeof fieldDef.width === 'string'
																? `${fieldDef.width}px`
																: fieldDef.width,
														maxWidth:
															typeof fieldDef.maxWidth === 'string'
																? `${fieldDef.maxWidth}px`
																: fieldDef.maxWidth,
														minWidth:
															typeof fieldDef.minWidth === 'string'
																? `${fieldDef.minWidth}px`
																: fieldDef.minWidth,
													}}
													className={cn('first:pl-2 last:pr-2', fieldDef.className)}
													key={fieldDef.accessorKey}
												>
													{fieldDef.type === 'readOnly' &&
														field[fieldDef.accessorKey as keyof typeof field]}

													{fieldDef.type === 'custom' && fieldDef.component(fieldIndex)}

													{fieldDef.type === 'join-input-unit' && (
														<FormField
															control={form.control}
															name={`${fieldName}.${fieldIndex + startIndex}.${fieldDef.accessorKey}`}
															render={(props) => (
																<CoreForm.JoinInputUnit
																	unit={fieldDef.unit(fieldIndex + startIndex)}
																	disableLabel
																	disabled={
																		typeof fieldDef.disabled === 'boolean'
																			? fieldDef.disabled
																			: fieldDef.disabled?.(
																					fieldIndex + startIndex
																				)
																	}
																	type={fieldDef.inputType}
																	{...props}
																/>
															)}
														/>
													)}

													{fieldDef.type === 'text' && (
														<FormField
															control={form.control}
															name={`${fieldName}.${fieldIndex + startIndex}.${fieldDef.accessorKey}`}
															render={(props) => (
																<CoreForm.Input
																	type={'text'}
																	disableLabel
																	disabled={
																		typeof fieldDef.disabled === 'boolean'
																			? fieldDef.disabled
																			: fieldDef.disabled?.(
																					fieldIndex + startIndex
																				)
																	}
																	placeholder={fieldDef.placeholder}
																	{...props}
																/>
															)}
														/>
													)}
													{fieldDef.type === 'checkbox' && (
														<FormField
															control={form.control}
															name={`${fieldName}.${fieldIndex + startIndex}.${fieldDef.accessorKey}`}
															render={(props) => (
																<CoreForm.Checkbox
																	disableLabel
																	disabled={
																		typeof fieldDef.disabled === 'boolean'
																			? fieldDef.disabled
																			: fieldDef.disabled?.(
																					fieldIndex + startIndex
																				)
																	}
																	{...props}
																/>
															)}
														/>
													)}

													{fieldDef.type === 'date' && (
														<FormField
															control={form.control}
															name={`${fieldName}.${fieldIndex + startIndex}.${fieldDef.accessorKey}`}
															render={(props) => (
																<CoreForm.DatePicker
																	disableLabel
																	disabled={
																		typeof fieldDef.disabled === 'boolean'
																			? fieldDef.disabled
																			: fieldDef.disabled?.(
																					fieldIndex + startIndex
																				)
																	}
																	{...props}
																/>
															)}
														/>
													)}

													{fieldDef.type === 'number' && (
														<FormField
															control={form.control}
															name={`${fieldName}.${fieldIndex + startIndex}.${fieldDef.accessorKey}`}
															render={(props) => (
																<CoreForm.Input
																	type='number'
																	disableLabel
																	disabled={
																		typeof fieldDef.disabled === 'boolean'
																			? fieldDef.disabled
																			: fieldDef.disabled?.(
																					fieldIndex + startIndex
																				)
																	}
																	placeholder={fieldDef.placeholder}
																	{...props}
																/>
															)}
														/>
													)}
													{fieldDef.type === 'textarea' && (
														<FormField
															control={form.control}
															name={`${fieldName}.${fieldIndex + startIndex}.${fieldDef.accessorKey}`}
															render={(props) => (
																<CoreForm.Textarea
																	disableLabel
																	placeholder={fieldDef.placeholder}
																	disabled={
																		typeof fieldDef.disabled === 'boolean'
																			? fieldDef.disabled
																			: fieldDef.disabled?.(
																					fieldIndex + startIndex
																				)
																	}
																	{...props}
																/>
															)}
														/>
													)}

													{fieldDef.type === 'select' && (
														<FormField
															control={form.control}
															name={`${fieldName}.${fieldIndex + startIndex}.${fieldDef.accessorKey}`}
															render={(props) => (
																<CoreForm.ReactSelect
																	menuPortalTarget={document.body}
																	options={fieldDef.options}
																	placeholder={fieldDef.placeholder}
																	disableLabel
																	unique={fieldDef.unique}
																	excludeOptions={fieldDef.excludeOptions}
																	isDisabled={
																		typeof fieldDef.disabled === 'boolean'
																			? fieldDef.disabled
																			: fieldDef.disabled?.(
																					fieldIndex + startIndex
																				)
																	}
																	onChange={fieldDef.onChange}
																	{...props}
																/>
															)}
														/>
													)}
													{fieldDef.type === 'radio' && (
														<FormField
															control={form.control}
															name={`${fieldName}.${fieldIndex + startIndex}.${fieldDef.accessorKey}`}
															render={(props) => (
																<CoreForm.Radio
																	options={fieldDef.options}
																	placeholder={fieldDef.placeholder}
																	disableLabel
																	disabled={
																		typeof fieldDef.disabled === 'boolean'
																			? fieldDef.disabled
																			: fieldDef.disabled?.(
																					fieldIndex + startIndex
																				)
																	}
																	onChange={fieldDef.onChange}
																	{...props}
																/>
															)}
														/>
													)}

													{fieldDef.type === 'image' && (
														<FormField
															control={form.control}
															name={`${fieldName}.${fieldIndex + startIndex}.${fieldDef.accessorKey}`}
															render={(props) => (
																<CoreForm.FileUpload
																	disableLabel={true}
																	disabled={
																		typeof fieldDef.disabled === 'boolean'
																			? fieldDef.disabled
																			: fieldDef.disabled?.(
																					fieldIndex + startIndex
																				)
																	}
																	isUpdate={fieldDef.isUpdate}
																	{...props}
																/>
															)}
														/>
													)}

													{fieldDef.type === 'file' && (
														<FormField
															control={form.control}
															name={`${fieldName}.${fieldIndex + startIndex}.${fieldDef.accessorKey}`}
															render={(props) => (
																<CoreForm.FileUpload
																	fileType='document'
																	disableLabel={true}
																	errorText='File must be less than 10MB and of type pdf, doc, docx'
																	options={{
																		maxSize: 10000000,
																	}}
																	disabled={
																		typeof fieldDef.disabled === 'boolean'
																			? fieldDef.disabled
																			: fieldDef.disabled?.(
																					fieldIndex + startIndex
																				)
																	}
																	small={true}
																	isUpdate={fieldDef.isUpdate}
																	{...props}
																/>
															)}
														/>
													)}
												</TableCell>
											);
										}
									})}
							</TableRow>
						))}
					{children}
				</TableBody>
			</Table>
		</div>
	);
};

export default DefaultDynamicFields;
