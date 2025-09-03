// utils.tsx
import { BWT_LOGO } from '@/assets/images/base64';
import { IInfoTableData } from '@/pages/work/_config/columns/columns.type';
import { format, formatDate } from 'date-fns';
import { Content, DynamicContent } from 'pdfmake/interfaces';

import { getDateTime } from '@/utils';

import { customTable, DEFAULT_FONT_SIZE } from '../ui';

export const getPageHeader = (data: IInfoTableData, user: any, GenerateQRCode: string): DynamicContent => {
	return (currentPage: number, pageCount: number) => ({
		columns: [
			{ width: '*', text: '' },
			{
				width: 'auto',
				table: {
					widths: [60, '*', 60], // Logo | Company Info | QR Code
					body: [
						[
							{
								image: BWT_LOGO,
								width: 60,
								height: 50,
								alignment: 'center',
								border: [false, false, false, true],
							},
							{
								stack: [
									{
										text: 'Bismillah World Technology',
										fontSize: DEFAULT_FONT_SIZE + 6,
										bold: true,
										color: '#283791',
										alignment: 'center',
										margin: [0, 0, 0, 5],
									},
									{
										text: 'Address: 519/A, Dhanmondi-1, Dhaka-1205',
										fontSize: DEFAULT_FONT_SIZE - 2,
										bold: true,
										alignment: 'center',
										margin: [0, 0, 0, 2],
									},
									{
										text: 'Phone: 01901384304 website: bwt.com.bd',
										fontSize: DEFAULT_FONT_SIZE - 2,
										bold: true,
										alignment: 'center',
									},
								],
								border: [false, false, false, true],
							},
							{
								svg: GenerateQRCode,
								width: 40,
								height: 50,
								alignment: 'center',
								border: [false, false, false, true],
							},
						],
					],
					layout: 'noBorders',
				},
			},
			{ width: '*', text: '' },
		],

		margin: [0, 20, 0, 20] as [number, number, number, number],
	});
};

export const getPageFooter = ({
	currentPage,
	pageCount,
	data,
	user,
}: {
	currentPage: number;
	pageCount: number;
	data?: IInfoTableData;
	user?: any;
}) => {
	return {
		widths: ['*', '*', '*'],
		body: [
			[
				{
					text: `Print Date:${format(getDateTime(), 'dd-MMM-yyyy HH:mm:ss aaa')} By: ${user?.name}`,
					fontSize: DEFAULT_FONT_SIZE - 4,
					border: [false, true, false, false],
				},
				{
					text: `Bismillah World Technology`,
					fontSize: DEFAULT_FONT_SIZE - 4,
					alignment: 'center',
					border: [false, true, false, false],
				},
				{
					text: `${data?.info_id} | Page: ${currentPage} of ${pageCount}`,
					fontSize: DEFAULT_FONT_SIZE - 4,
					alignment: 'right',
					border: [false, true, false, false],
				},
			],
		],
	};
};
