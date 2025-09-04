// utils.tsx
import { BWT_LOGO } from '@/assets/images/base64';
import { IInfoTableData } from '@/pages/work/_config/columns/columns.type';
import { format, formatDate } from 'date-fns';
import { DynamicContent } from 'pdfmake/interfaces';

import { getDateTime } from '@/utils';

export const getPageHeader = (
	data: IInfoTableData,
	user: any,
	FONT_SIZE: number
): DynamicContent => {
	return (currentPage: number, pageCount: number) => ({
		columns: [
			{
				width: '*',
				table: {
					widths: [10, '*'], // Logo | Company Info
					body: [
						[
							{
								image: BWT_LOGO,
								width: 25,
								height: 22,
								alignment: 'center',
								border: [false, false, false, false],
							},
							{
								stack: [
									{
										text: 'BWT',
										fontSize: FONT_SIZE - 2,
										bold: true,
										color: '#283791',
									},
									{
										text: 'Phone: 01901384304',
										fontSize: FONT_SIZE - 6,
										bold: true,
									},
								],
								border: [false, false, false, false],
							},
						],
					],
					layout: 'noBorders',
				},
			},
			{
				width: '*',
				table: {
					widths: ['*'],
					body: [
						[
							{
								stack: [
									{
										text: [
											{ text: 'Info ID: ', fontSize: FONT_SIZE - 4, bold: true },
											{ text: data.info_id, fontSize: FONT_SIZE - 4 },
										],
										fontSize: FONT_SIZE - 4,
										alignment: 'right',
									},
									{
										text: [
											{ text: 'Date: ', fontSize: FONT_SIZE - 4, bold: true },
											{
												text: formatDate(data?.created_at, 'dd MMM, yyyy'),
												fontSize: FONT_SIZE - 4,
											},
										],
										alignment: 'right',
									},
								],
								border: [false, false, false, false],
							},
						],
					],
					layout: 'noBorders',
				},
			},
		],

		margin: [5, 8, 0, 0] as [number, number, number, number],
	});
};

export const getPageFooter = ({
	currentPage,
	pageCount,
	data,
	user,
	FONT_SIZE,
}: {
	currentPage: number;
	pageCount: number;
	data?: IInfoTableData;
	user?: any;
	FONT_SIZE: number;
}) => {
	return {
		widths: ['*', '*', '*'],
		body: [
			[
				{
					text: `Print: ${format(getDateTime(), 'dd MMM, yyyy')}`,
					fontSize: FONT_SIZE - 6,
					colSpan: 2,
					border: [false, true, false, false],
				},
				{
					text: ``,
					fontSize: FONT_SIZE - 6,
					alignment: 'center',
					border: [false, true, false, false],
				},
				{
					text: `Page: ${currentPage} of ${pageCount}`,
					fontSize: FONT_SIZE - 6,
					alignment: 'right',
					border: [false, true, false, false],
				},
			],
		],
	};
};
