import { BWT_LOGO } from '@/assets/images/base64';
import { IInfoTableData } from '@/pages/work/_config/columns/columns.type';
import { format, formatDate } from 'date-fns';

import { getDateTime } from '@/utils';

import { customTable, DEFAULT_FONT_SIZE } from '../ui';

export const getPageHeader = (data: IInfoTableData, user: any, GenerateQRCode: string) => {
	return {
		heights: ['auto', 2, 'auto', 'auto'],
		widths: ['*'],
		body: [
			[
				{
					table: {
						headerRows: 1,
						widths: [50, '*', 180],
						body: [
							[
								{
									image: BWT_LOGO,
									width: 60,
									height: 50,
									alignment: 'right',
									border: [true, true, false, true],
								},
								{
									table: {
										widths: ['*', 40],
										body: [
											[
												{
													text: 'Bismillah World Technology',
													border: [false, false, false, false],
													fontSize: DEFAULT_FONT_SIZE + 6,
													bold: true,
													color: '#283791',
													style: 'header',
												},
												{
													svg: GenerateQRCode,
													width: 40,
													height: 50,
													alignment: 'left',
													border: [false, false, false, false],
													rowSpan: 3,
												},
											],
											[
												{
													text: 'Address: 519/A Dhanmondi-1, Dhanmondi - Dhaka-1205',
													border: [false, false, false, false],
													fontSize: DEFAULT_FONT_SIZE - 2,
													bold: true,

													style: 'header',
												},
												{},
											],
											[
												{
													text: 'Contact Number: 01956666777, website:bwt.com.bd',
													border: [false, false, false, false],
													fontSize: DEFAULT_FONT_SIZE - 2,
													bold: true,

													style: 'header',
												},
												{},
											],
										],
										layout: customTable,
									},
									border: [false, true, false, true],
								},
								{
									table: {
										widths: [60, '*'],
										body: [
											[
												{
													text: 'Received Details',
													fontSize: DEFAULT_FONT_SIZE + 2,
													bold: true,
													style: 'header',
													alignment: 'center',
													fillColor: '#dedede',
													colSpan: 2,
												},
												{},
											],
											[
												{
													text: 'Info ID:',
													bold: true,
													fontSize: DEFAULT_FONT_SIZE - 2,
												},
												{
													text: data?.info_id,
													fontSize: DEFAULT_FONT_SIZE - 2,
												},
											],
											[
												{
													text: 'Branch:',
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
													text: 'Received:',
													bold: true,
													fontSize: DEFAULT_FONT_SIZE - 2,
												},
												{
													text: data?.is_product_received ? 'Yes' : 'No',
													fontSize: DEFAULT_FONT_SIZE - 2,
												},
											],
											[
												{
													text: 'Received Date:',
													bold: true,
													fontSize: DEFAULT_FONT_SIZE - 2,
												},
												{
													text:
														data?.received_date?
														formatDate(data?.received_date, 'dd-MMM-yyyy'):'',
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
				},
			],
		],
	};
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
					text: `Bismillash World Technology`,
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
