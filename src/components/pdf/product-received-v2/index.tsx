import { it } from 'node:test';
import { IInfoTableData } from '@/pages/work/_config/columns/columns.type';
import { format } from 'date-fns';
import { Italic } from 'lucide-react';
import { TDocumentDefinitions } from 'pdfmake/interfaces'; // Import proper type
import QRCode from 'qrcode';

import { DEFAULT_FONT_SIZE, xMargin } from '@/components/pdf/ui';
import { banglaRegex, DEFAULT_A4_PAGE, getTable } from '@/components/pdf/utils';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

export default async function Index(data: IInfoTableData, user: any, baseUrl: string) {
	const headerHeight = 75;
	const footerHeight = 20;

	const GenerateQRCode = await QRCode.toString(`${baseUrl}order/${data?.uuid}`);

	// Process data
	data?.order_entry?.forEach((item) => {
		item.product = `${item.brand_name.toUpperCase()}: ${item.model_name.toUpperCase()} ${item.serial_no == null ? '' : '(SN: ' + item.serial_no})`;
		item.accessoriesString = item.accessories_name?.join(', ');
		item.unit = 'Pcs';
	});
	const problem_statement = data?.order_entry.map((item) => item.problem_statement);
	const node = [
		getTable('index', '#', 'center'),
		getTable('order_id', 'O/N'),
		getTable('product', 'Product'),
		getTable('accessoriesString', 'Accessories'),
		getTable('order_problems_name', 'Problems'),
		getTable('quantity', 'Qty', 'right'),
		getTable('unit', 'Unit'),
	];

	// Properly typed document definition
	const docDefinition: TDocumentDefinitions = {
		...DEFAULT_A4_PAGE({
			xMargin,
			headerHeight,
			footerHeight,
		}),

		pageMargins: [xMargin, headerHeight + 20, xMargin, footerHeight + 20] as [number, number, number, number],

		info: {
			title: `Product Received Pdf of ${data?.user_name}-${data?.user_phone}-RCV_Date: ${data?.received_date}`,
			author: 'Bismillah World Technology',
		},

		header: getPageHeader(data, user, GenerateQRCode),

		footer: (currentPage: number, pageCount: number) => ({
			table: getPageFooter({ currentPage, pageCount, data, user }),
			margin: [xMargin, 2] as [number, number],
			fontSize: DEFAULT_FONT_SIZE,
		}),

		// * Main content remains the same
		content: [
			{
				table: {
					widths: ['*'],
					body: [
						[
							{
								text: `Info ID: ${data?.info_id}`,
								bold: true,
								fontSize: DEFAULT_FONT_SIZE + 2,
								alignment: 'center',
								border: [false, false, false, false],
							},
						],
						[
							{
								table: {
									widths: [50, '*', 55, '*'],
									body: [
										[
											{ text: `Name:`, fontSize: DEFAULT_FONT_SIZE - 2, bold: true },
											{
												text: data?.user_name,
												fontSize: DEFAULT_FONT_SIZE - 2,
												font: `${banglaRegex.test(data?.user_name) ? 'Bangla' : 'Roboto'}`,
											},
											{
												text: `Branch: `,
												bold: true,
												fontSize: DEFAULT_FONT_SIZE - 2,
											},
											{ text: data?.branch_name, fontSize: DEFAULT_FONT_SIZE - 2 },
										],
										[
											{
												text: `Contact No: `,
												bold: true,
												fontSize: DEFAULT_FONT_SIZE - 2,
											},
											{ text: data?.user_phone, fontSize: DEFAULT_FONT_SIZE - 2 },

											{
												text: `Received By: `,
												bold: true,
												fontSize: DEFAULT_FONT_SIZE - 2,
											},
											{ text: data?.received_by_name, fontSize: DEFAULT_FONT_SIZE - 2 },
										],
										[
											{
												text: `Address: `,
												bold: true,
												fontSize: DEFAULT_FONT_SIZE - 2,
											},
											{
												text: data?.location,
												fontSize: DEFAULT_FONT_SIZE - 2,
												font: `${banglaRegex.test(data?.location) ? 'Bangla' : 'Roboto'}`,
											},
											{
												text: `Received At: `,
												bold: true,
												fontSize: DEFAULT_FONT_SIZE - 2,
											},
											{
												text: data?.received_date
													? format(data?.received_date, 'dd MMM, yyyy')
													: '',
												fontSize: DEFAULT_FONT_SIZE - 2,
											},
										],
									],
								},
								layout: 'noBorders',
								border: [false, false, false, false],
							},
						],
					],
				},
			},
			{ text: '\n' },
			{
				table: {
					headerRows: 1,
					widths: [15, 50, '*', '*', '*', 30, 30],
					body: [
						node.map((col) => ({
							text: col.name,
							style: col.headerStyle,
							alignment: col.alignment,
							fontSize: DEFAULT_FONT_SIZE - 2,
							bold: true,
						})),
						...(data?.order_entry || []).map((item, index) =>
							node.map((nodeItem) => {
								if (nodeItem.field === 'order_problems_name') {
									return {
										stack: [
											{
												text: [{ text: item.order_problems_name || '' }],
												fontSize: DEFAULT_FONT_SIZE - 2,
												margin: [0, 0, 0, 2],
											},
											{
												text: [{ text: item.problem_statement || '', italics: true }],
												fontSize: DEFAULT_FONT_SIZE - 3,
											},
										],
										alignment: nodeItem.alignment,
									};
								}
								return {
									text: nodeItem.field === 'index' ? index + 1 : (item as any)[nodeItem.field],
									style: nodeItem.cellStyle,
									fontSize: DEFAULT_FONT_SIZE - 2,
									alignment: nodeItem.alignment,
								};
							})
						),
					],
				},
			},
			{ text: '\n' },

			{
				text: [{ text: 'Remarks: ', bold: true }, { text: data?.remarks || '' }],
				fontSize: DEFAULT_FONT_SIZE - 2,
			},
			{ text: '\n' },
			{ text: 'Terms and Conditions', bold: true, fontSize: DEFAULT_FONT_SIZE - 2 },
			{
				ul: [
					'We are not liable for any data loss/corruption or software recovery issues during The repair process.',
					'We are not responsible for damage or death of any parts while repairing and adding spare parts or cleaning dust',
					'Service and Spare parts warranty will not cover any kind of physical or external damage.',
					'The customer will have to take al responsibility during the product delivery, and no complaints are accepted after the delivery is made.',
					'Customer will be notified if any inconsistency is found during product diagnosis, and the customer must accept it',
					'After servicing, If the repaired product is not collected within 30 ays by the customer, then We will not be liable for any kinds of issues related to that product.',
					'Service product is only released in presence of the Original Customer Receipt.',
					'If the customer wants to refuse the service after the product s received, the diagnosis charge will be applicable.',
					'STEL management reserves the right to modify or discontinue any Service (or any part or content thereof) at any time without prior notice.',
				],
				fontSize: DEFAULT_FONT_SIZE - 2,
				alignment: 'justify',
			},
			{
				table: {
					widths: ['*', 10, '*'],
					body: [
						[
							{
								text: `\n\n\n\n`,
								fontSize: DEFAULT_FONT_SIZE - 2,
								bold: true,
								border: [false, false, false, false],
							},
							{
								text: `\n\n\n\n`,
								fontSize: DEFAULT_FONT_SIZE - 2,
								bold: true,
								border: [false, false, false, false],
							},
							{
								text: `\n\n\n\n`,
								fontSize: DEFAULT_FONT_SIZE - 2,
								bold: true,
								border: [false, false, false, false],
							},
						],
						[
							{
								text: `Customer Signature`,
								fontSize: DEFAULT_FONT_SIZE - 2,
								alignment: 'center',
								border: [false, true, false, false],
							},
							{
								text: ``,
								fontSize: DEFAULT_FONT_SIZE - 2,
								bold: true,
								border: [false, false, false, false],
							},
							{
								text: 'Sales/Receiver Person Signature',
								fontSize: DEFAULT_FONT_SIZE - 2,
								alignment: 'center',
								border: [false, true, false, false],
							},
						],
					],
				},
			},
		],
	};

	const pdfDocGenerator = pdfMake.createPdf(docDefinition);
	return pdfDocGenerator;
}
