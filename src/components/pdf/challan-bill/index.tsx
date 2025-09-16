import { IChallanTableData } from '@/pages/delivery/_config/columns/columns.type';
import { formatDate } from 'date-fns';
import QRCode from 'qrcode';

import { DEFAULT_FONT_SIZE, xMargin } from '@/components/pdf/ui';
import { banglaRegex, DEFAULT_A4_PAGE, getTable } from '@/components/pdf/utils';

import { getDateTime } from '@/utils';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

export default async function Index(data: IChallanTableData, user: any, baseURl: string) {
	const headerHeight = 100;
	const footerHeight = 20;
	let grand_total = 0;
	data?.challan_entries?.forEach((item) => {
		item.description = `${item.brand_name}, ${item.model_name} - SN: ${item.serial_no}`;
		item.unit = 'Pcs';
		grand_total += Number(item.bill_amount);
	});
	const GenerateQRCode = await QRCode.toString(`${baseURl}order/${data?.uuid}`);
	const node = [
		getTable('index', '#', 'center'),
		getTable('description', 'Product Name'),
		getTable('accessories_name', 'Accessories'),
		getTable('quantity', 'Qty', 'right'),
		getTable('unit', 'Unit'),
		getTable('bill_amount', 'Amount', 'right'),
	];
	const pdfDocGenerator = pdfMake.createPdf({
		...DEFAULT_A4_PAGE({
			xMargin,
			headerHeight,
			footerHeight,
		}),
		info: {
			title: `Delivery Challan Pdf of ${data?.customer_name}-${data?.customer_phone}-RCV_Date: ${getDateTime()}`,
			author: 'Bismillash World Technology',
		},
		// * Page Header - Simplified structure
		header: getPageHeader(data, user, GenerateQRCode),

		// * Page Footer
		footer: (currentPage: number, pageCount: number) => getPageFooter({ currentPage, pageCount, data, user }),

		// * Main Table
		content: [
			{
				text: 'BILL INVOICE',
				fontSize: DEFAULT_FONT_SIZE + 4,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 10],
				decoration: 'underline',
			},
			{
				text: `Challan No:${data?.challan_no}`,
				bold: true,
				fontSize: DEFAULT_FONT_SIZE + 2,
				alignment: 'center',
			},
			{ text: '\n' },
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							{
								table: {
									widths: [80, '*'],
									body: [
										[
											{ text: `Customer Name:`, fontSize: DEFAULT_FONT_SIZE - 2, bold: true },
											{
												text: data?.customer_name,
												fontSize: DEFAULT_FONT_SIZE - 2,
												font: `${banglaRegex.test(data?.customer_name) ? 'Bangla' : 'Roboto'}`,
											},
										],
										[
											{
												text: `Contact No: `,
												bold: true,
												fontSize: DEFAULT_FONT_SIZE - 2,
											},
											{ text: data?.customer_phone, fontSize: DEFAULT_FONT_SIZE - 2 },
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
										],
										[
											{
												text: `Zone: `,
												bold: true,
												fontSize: DEFAULT_FONT_SIZE - 2,
											},
											{ text: data?.zone_name, fontSize: DEFAULT_FONT_SIZE - 2 },
										],
										[
											{
												text: `Sales Person: `,
												bold: true,
												fontSize: DEFAULT_FONT_SIZE - 2,
											},
											{ text: user?.name, fontSize: DEFAULT_FONT_SIZE - 2 },
										],
									],
								},
								layout: 'noBorders',
							},
							{
								table: {
									widths: [80, '*'],
									body: [
										[
											{
												text: 'Date:',
												bold: true,
												fontSize: DEFAULT_FONT_SIZE - 2,
											},
											{
												text: formatDate(data?.created_at, 'dd-MMM-yyyy'),
												fontSize: DEFAULT_FONT_SIZE - 2,
											},
										],
										[
											{
												text: 'Status:',
												bold: true,
												fontSize: DEFAULT_FONT_SIZE - 2,
											},
											{
												text: '',
												fontSize: DEFAULT_FONT_SIZE - 2,
											},
										],
										[
											{
												text: 'Challan Branch:',
												bold: true,
												fontSize: DEFAULT_FONT_SIZE - 2,
											},
											{
												text: data?.branch_name,
												fontSize: DEFAULT_FONT_SIZE - 2,
											},
										],
										[
											{
												text: 'Approved By:',
												bold: true,
												fontSize: DEFAULT_FONT_SIZE - 2,
											},
											{
												text: user?.name,
												fontSize: DEFAULT_FONT_SIZE - 2,
											},
										],
										[
											{
												text: 'Sales Mode:',
												bold: true,
												fontSize: DEFAULT_FONT_SIZE - 2,
											},
											{
												text: data?.payment_method,
												fontSize: DEFAULT_FONT_SIZE - 2,
											},
										],
									],
								},
								layout: 'noBorders',
							},
						],
					],
				},
				layout: 'noBorders',
			},
			{ text: '\n' },
			{
				table: {
					headerRows: 1,
					widths: [15, '*', 150, 50, 30, 40],
					body: [
						node.map((col) => ({
							text: col.name,
							style: col.headerStyle,
							alignment: col.alignment,
							fontSize: DEFAULT_FONT_SIZE - 2,
							bold: true,
						})),
						...(data?.challan_entries || []).map((item, index) =>
							node.map((nodeItem) => ({
								text:
									nodeItem.field === 'index'
										? index + 1
										: nodeItem.field === 'accessories'
											? item.accessories_name.join(', ')
											: (item as any)[nodeItem.field],
								style: nodeItem.cellStyle,
								fontSize: DEFAULT_FONT_SIZE - 2,
								alignment: nodeItem.alignment,
							}))
						),
						[
							{
								text: 'Grand Total',
								style: 'tableHeader',
								fontSize: DEFAULT_FONT_SIZE - 2,
								alignment: 'right',
								bold: true,
								colSpan: 5,
							},
							{},
							{},
							{},
							{},
							{
								text: grand_total,
								style: 'tableCell',
								fontSize: DEFAULT_FONT_SIZE - 2,
								alignment: 'right',
							},
						],
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
	});

	return pdfDocGenerator;
}
