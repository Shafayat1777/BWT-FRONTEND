import { it } from 'node:test';
import { IBillInfo } from '@/pages/store/_config/columns/columns.type';
import { format } from 'date-fns';
import { Italic } from 'lucide-react';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import QRCode from 'qrcode';

import { DEFAULT_FONT_SIZE, xMargin } from '@/components/pdf/ui';
import { banglaRegex, DEFAULT_A4_PAGE, getTable } from '@/components/pdf/utils';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

export default async function Index(data: IBillInfo, user: any, baseUrl: string) {
	const headerHeight = 75;
	const footerHeight = 20;

	const GenerateQRCode = await QRCode.toString(`${baseUrl}order/${data?.uuid}`);

	// Get formatted attributes for an item
	const getFormattedProductWithAttributes = (item: any) => {
		const productTitle = item.product_title || '';

		if (!item.product_variant_values_entry || item.product_variant_values_entry.length === 0) {
			return { text: productTitle };
		}

		const attributes = item.product_variant_values_entry
			.map((variant: any) => `${variant.attribute_name}: ${variant.value}`)
			.join(', ');

		if (!attributes) {
			return { text: productTitle };
		}

		// Return structured text with product title and italic attributes
		return {
			text: [{ text: productTitle }, { text: `\n${attributes}`, italics: true, fontSize: DEFAULT_FONT_SIZE - 3 }],
		};
	};

	// Build table structure (removed all price-related columns)
	const buildTableNodes = () => {
		const nodes = [
			getTable('index', '#', 'center'),
			getTable('product_title_with_attributes', 'Product', 'left'),
			getTable('quantity', 'Qty', 'right'),
		];

		return nodes;
	};

	const tableNodes = buildTableNodes();

	// Calculate table widths (simplified - only 3 columns now)
	const calculateTableWidths = () => {
		const baseWidth = 15; // index column
		const productWidth = '*'; // product column (flexible)
		const qtyWidth = 60; // quantity column

		return [baseWidth, productWidth, qtyWidth];
	};

	const tableWidths = calculateTableWidths();

	// Build customer information rows
	const buildCustomerInfoRows = () => {
		const rows = [
			// Row 1: Name and Contact
			[
				{ text: `Name:`, fontSize: DEFAULT_FONT_SIZE - 2, bold: true },
				{
					text: data?.name,
					fontSize: DEFAULT_FONT_SIZE - 2,
					font: `${banglaRegex.test(data?.name) ? 'Bangla' : 'Roboto'}`,
				},
				{
					text: `Contact No: `,
					bold: true,
					fontSize: DEFAULT_FONT_SIZE - 2,
				},
				{ text: data?.phone, fontSize: DEFAULT_FONT_SIZE - 2 },
			],
			// Row 2: Email and Payment Status
			[
				{
					text: `Email: `,
					bold: true,
					fontSize: DEFAULT_FONT_SIZE - 2,
				},
				{ text: data?.email || '', fontSize: DEFAULT_FONT_SIZE - 2 },
				{
					text: `Payment Status: `,
					bold: true,
					fontSize: DEFAULT_FONT_SIZE - 2,
				},
				{
					text: data?.is_paid ? 'Paid' : 'Unpaid',
					fontSize: DEFAULT_FONT_SIZE - 2,
				},
			],
			// Row 3: Address and Payment Method
			[
				{
					text: `Address: `,
					bold: true,
					fontSize: DEFAULT_FONT_SIZE - 2,
				},
				{
					text: data?.address + ', ' + data?.district + ', ' + data?.city,
					fontSize: DEFAULT_FONT_SIZE - 2,
					font: `${banglaRegex.test(data?.address) ? 'Bangla' : 'Roboto'}`,
				},
				{
					text: `Payment Method: `,
					bold: true,
					fontSize: DEFAULT_FONT_SIZE - 2,
				},
				{
					text: data?.payment_method?.toUpperCase() || '',
					fontSize: DEFAULT_FONT_SIZE - 2,
				},
			],
			// Row 4: Note (only if exists)
			[
				{
					text: `Note: `,
					bold: true,
					fontSize: DEFAULT_FONT_SIZE - 2,
				},
				{
					text: data?.note || '',
					fontSize: DEFAULT_FONT_SIZE - 2,
					font: `${banglaRegex.test(data?.note || '') ? 'Bangla' : 'Roboto'}`,
					colSpan: 3,
				},
				{ text: '', fontSize: DEFAULT_FONT_SIZE - 2 },
				{ text: '', fontSize: DEFAULT_FONT_SIZE - 2 },
			],
		];

		return rows;
	};

	// Build shipping information rows
	const buildShippingInfoRows = () => {
		if (!data?.is_ship_different || !data?.ship_address) {
			return [];
		}

		const shipAddr = data.ship_address;
		const rows = [
			// Shipping header
			[
				{
					text: 'SHIPPING INFORMATION',
					bold: true,
					fontSize: DEFAULT_FONT_SIZE - 1,
					alignment: 'center',
					colSpan: 4,
					fillColor: '#f0f0f0',
				},
				{ text: '', fontSize: DEFAULT_FONT_SIZE - 2 },
				{ text: '', fontSize: DEFAULT_FONT_SIZE - 2 },
				{ text: '', fontSize: DEFAULT_FONT_SIZE - 2 },
			],
			// Row 1: Shipping Name and Company
			[
				{
					text: `Ship To: `,
					bold: true,
					fontSize: DEFAULT_FONT_SIZE - 2,
				},
				{
					text: shipAddr.name,
					fontSize: DEFAULT_FONT_SIZE - 2,
					font: `${banglaRegex.test(shipAddr.name) ? 'Bangla' : 'Roboto'}`,
				},
				{
					text: shipAddr.company_name ? `Company: ` : '',
					bold: shipAddr.company_name ? true : false,
					fontSize: DEFAULT_FONT_SIZE - 2,
				},
				{
					text: shipAddr.company_name || '',
					fontSize: DEFAULT_FONT_SIZE - 2,
					font: shipAddr.company_name && banglaRegex.test(shipAddr.company_name) ? 'Bangla' : 'Roboto',
				},
			],
			// Row 2: Shipping Phone and ZIP
			[
				{
					text: `Ship Phone: `,
					bold: true,
					fontSize: DEFAULT_FONT_SIZE - 2,
				},
				{
					text: shipAddr.phone,
					fontSize: DEFAULT_FONT_SIZE - 2,
				},
				{
					text: shipAddr.zip ? `ZIP: ` : '',
					bold: shipAddr.zip ? true : false,
					fontSize: DEFAULT_FONT_SIZE - 2,
				},
				{
					text: shipAddr.zip || '',
					fontSize: DEFAULT_FONT_SIZE - 2,
				},
			],
			// Row 3: Shipping Address
			[
				{
					text: `Ship Address: `,
					bold: true,
					fontSize: DEFAULT_FONT_SIZE - 2,
				},
				{
					text: `${shipAddr.address}, ${shipAddr.district}, ${shipAddr.city}`,
					fontSize: DEFAULT_FONT_SIZE - 2,
					font: `${banglaRegex.test(shipAddr.address) ? 'Bangla' : 'Roboto'}`,
					colSpan: 3,
				},
				{ text: '', fontSize: DEFAULT_FONT_SIZE - 2 },
				{ text: '', fontSize: DEFAULT_FONT_SIZE - 2 },
			],
		];

		// Add shipping note if exists
		if (shipAddr.note && shipAddr.note.trim()) {
			rows.push([
				{
					text: `Ship Note: `,
					bold: true,
					fontSize: DEFAULT_FONT_SIZE - 2,
				},
				{
					text: shipAddr.note,
					fontSize: DEFAULT_FONT_SIZE - 2,
					font: `${banglaRegex.test(shipAddr.note) ? 'Bangla' : 'Roboto'}`,
					colSpan: 3,
				},
				{ text: '', fontSize: DEFAULT_FONT_SIZE - 2 },
				{ text: '', fontSize: DEFAULT_FONT_SIZE - 2 },
			]);
		}

		// Add shipping remarks if exists
		if (shipAddr.remarks && shipAddr.remarks.trim()) {
			rows.push([
				{
					text: `Ship Remarks: `,
					bold: true,
					fontSize: DEFAULT_FONT_SIZE - 2,
				},
				{
					text: shipAddr.remarks,
					fontSize: DEFAULT_FONT_SIZE - 2,
					font: `${banglaRegex.test(shipAddr.remarks) ? 'Bangla' : 'Roboto'}`,
					colSpan: 3,
				},
				{ text: '', fontSize: DEFAULT_FONT_SIZE - 2 },
				{ text: '', fontSize: DEFAULT_FONT_SIZE - 2 },
			]);
		}

		return rows;
	};

	// Properly typed document definition
	const docDefinition: TDocumentDefinitions = {
		...DEFAULT_A4_PAGE({
			xMargin,
			headerHeight,
			footerHeight,
		}),

		pageMargins: [xMargin, headerHeight + 20, xMargin, footerHeight + 20] as [number, number, number, number],

		info: {
			title: `Challan Invoice - ${data?.name}-${data?.phone}`,
			author: 'Bismillah World Technology',
		},

		header: getPageHeader(data, user, GenerateQRCode),

		footer: (currentPage: number, pageCount: number) => ({
			table: getPageFooter({ currentPage, pageCount, data, user }),
			margin: [xMargin, 2] as [number, number],
			fontSize: DEFAULT_FONT_SIZE,
		}),

		content: [
			// Challan Invoice Title
			{
				text: 'CHALLAN INVOICE',
				fontSize: DEFAULT_FONT_SIZE + 4,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 10],
				decoration: 'underline',
			},
			{
				table: {
					widths: ['*'],
					body: [
						[
							{
								text: `Order ID: ${data?.bill_id}`,
								bold: true,
								fontSize: DEFAULT_FONT_SIZE + 2,
								alignment: 'center',
								border: [false, false, false, false],
							},
						],
						[
							{
								table: {
									widths: [60, '*', 80, '*'],
									body: [...buildCustomerInfoRows(), ...buildShippingInfoRows()],
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
					widths: tableWidths,
					body: [
						// Header row
						tableNodes.map((col) => ({
							text: col.name,
							style: col.headerStyle,
							alignment: col.alignment,
							fontSize: DEFAULT_FONT_SIZE - 2,
							bold: true,
						})),
						// Data rows (removed all price-related calculations)
						...(data?.order_details || []).map((item, index) =>
							tableNodes.map((nodeItem) => {
								let cellValue: any;

								switch (nodeItem.field) {
									case 'index':
										cellValue = index + 1;
										break;
									case 'product_title_with_attributes':
										cellValue = getFormattedProductWithAttributes(item);
										break;
									case 'quantity':
										cellValue = item.quantity || 0;
										break;
									default:
										cellValue = (item as any)[nodeItem.field] || '';
										break;
								}

								// Handle structured text for product column
								if (nodeItem.field === 'product_title_with_attributes') {
									return {
										...cellValue,
										style: nodeItem.cellStyle,
										fontSize: DEFAULT_FONT_SIZE - 2,
										alignment: nodeItem.alignment,
									};
								}

								return {
									text: cellValue,
									style: nodeItem.cellStyle,
									fontSize: DEFAULT_FONT_SIZE - 2,
									alignment: nodeItem.alignment,
								};
							})
						),
						// Removed Grand Total row completely
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
					'After servicing, If the repaired product is not collected within 30 days by the customer, then We will not be liable for any kinds of issues related to that product.',
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
