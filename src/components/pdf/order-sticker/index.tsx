import { IInfoTableData } from '@/pages/work/_config/columns/columns.type';
import { ContentStack, TDocumentDefinitions } from 'pdfmake/interfaces';

import { DEFAULT_FONT_SIZE } from '@/components/pdf/ui';
import { CUSTOM_PAGE_STICKER } from '@/components/pdf/utils';

import pdfMake from '..';
import { generateBarcodeAsBase64 } from './pdf-generate-barcode';
import { getPageFooter, getPageHeader } from './utils';

export default async function Index(data: IInfoTableData, user: any, baseUrl: string) {
	const headerHeight = 18;
	const footerHeight = 3;
	const FONT_SIZE = DEFAULT_FONT_SIZE + 2;

	const entries = data.order_entry ?? [];
	entries.forEach((item, index) => {
		// item.product = `${item.brand_name}: ${item.model_name}${item.serial_no ? ` (SN: ${item.serial_no})` : ''}`;
		item.product = `${item.brand_name.toUpperCase()}: ${item.model_name.toUpperCase()}`;
		item.accessoriesString = item.accessories_name?.join(', ');
		item.unit = 'Pcs';
		item.index = index + 1;
	});

	const expandedEntries = entries.flatMap((item) => {
		const quantity = item.quantity || 1;
		return Array.from({ length: quantity }, (_, index) => ({
			...item,
			copyIndex: index + 1,
			totalCopies: quantity,
		}));
	});

	const totalStickers = expandedEntries.length;

	const entryBlocks = await Promise.all(
		expandedEntries.map((item, idx) => {
			const barcodeImg = generateBarcodeAsBase64(item.order_id, item.uuid);

			const stackContent: ContentStack = {
				stack: [
					{
						image: barcodeImg,
						width: 200,
						alignment: 'center' as const,
						margin: [0, 0, 0, 2] as [number, number, number, number],
					},
					{
						columns: [
							{
								text: `${item.order_id}${item.totalCopies > 1 ? `(${item.copyIndex}/${item.quantity})` : ''}`,
								fontSize: FONT_SIZE + 6,
								bold: true,
								alignment: 'center' as const,
								width: '*',
							},
						],
						margin: [0, 0, 0, 2] as [number, number, number, number],
					},
					{
						text: { text: item.product, bold: true },
						alignment: 'center' as const,
						fontSize: FONT_SIZE + 6,
						margin: [0, 0, 0, 2] as [number, number, number, number],
					},
					{
						text: [{ text: 'Name: ', bold: true }, { text: data.user_name }],
						fontSize: FONT_SIZE - 2,
						margin: [0, 0, 0, 2] as [number, number, number, number],
					},
					{
						text: [{ text: 'Phone: ', bold: true }, { text: data.user_phone }],
						fontSize: FONT_SIZE - 2,
						margin: [0, 0, 0, 2] as [number, number, number, number],
					},

					{
						text: [
							{ text: 'Problems: ', bold: true },
							{
								text: `${item?.order_problems_name.join(', ')} ${
									item.problem_statement ? `(${item.problem_statement})` : ''
								}`,
							},
						],
						fontSize: FONT_SIZE - 2,
						margin: [0, 0, 0, 4] as [number, number, number, number],
					},
					{
						text: [
							{ text: 'Acc: ', bold: true },
							{
								text: `${item?.accessoriesString}`,
							},
						],
						fontSize: FONT_SIZE - 2,
						margin: [0, 0, 0, 4] as [number, number, number, number],
					},
					{
						text: [{ text: 'Assign Engr.: ', bold: true }, { text: item.engineer_name ?? '' }],
						fontSize: FONT_SIZE - 2,
						margin: [0, 0, 0, 4] as [number, number, number, number],
					},
					{
						text: [{ text: 'Remarks: ', bold: true }, { text: item.remarks ?? '' }],
						fontSize: FONT_SIZE - 2,
						margin: [0, 0, 0, 0] as [number, number, number, number],
					},
				],
			};

			// Add pageBreak property conditionally with proper typing
			if (idx < expandedEntries.length - 1) {
				return {
					...stackContent,
					pageBreak: 'after' as const,
				};
			}

			return stackContent;
		})
	);

	const docDefinition: TDocumentDefinitions = {
		...CUSTOM_PAGE_STICKER({
			pageOrientation: 'portrait',
			xMargin: 10,
			headerHeight,
			footerHeight,
		}),
		pageMargins: [10, headerHeight + 20, 10, footerHeight + 20] as [number, number, number, number],
		info: {
			title: `Product Received PDF – ${data.user_name}-${data.user_phone}-RCV_${data.received_date}${totalStickers > 1 ? ` (${totalStickers} Stickers)` : ''}`,
			author: 'Bismillah World Technology',
		},
		header: getPageHeader(data, user, FONT_SIZE),
		footer: (currentPage, pageCount) => ({
			table: getPageFooter({ currentPage, pageCount, data, user, FONT_SIZE }),
			margin: [10, 2] as [number, number],
			fontSize: DEFAULT_FONT_SIZE,
		}),
		content: entryBlocks,
	};

	const pdfDocGenerator = pdfMake.createPdf(docDefinition).print();
	return pdfDocGenerator;
}
