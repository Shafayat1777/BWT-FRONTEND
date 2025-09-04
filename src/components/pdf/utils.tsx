import { TDocumentDefinitions } from 'pdfmake/interfaces';

import { DEFAULT_FONT_SIZE, defaultStyle, PRIMARY_COLOR, styles } from './ui';

interface PageProps {
	xMargin: number;
	headerHeight: number;
	footerHeight: number;
}

interface CustomPageProps extends PageProps {
	pageOrientation?: 'landscape' | 'portrait';
	width?: number;
	height?: number;
	leftMargin?: number;
	rightMargin?: number;
}

interface CustomPageStickerProps extends PageProps {
	pageOrientation?: 'landscape' | 'portrait';
}

interface CustomPageThreadStickerProps extends PageProps {
	pageOrientation?: 'landscape' | 'portrait' | 'portrait'; // default 'portrait'
}

interface CustomPageConeStickerProps extends PageProps {
	pageOrientation?: 'landscape' | 'portrait';
}
export const banglaRegex = /[\u0980-\u09FF]/;

//
// PDF DEFAULTS
//
export function DEFAULT_A4_PAGE({ xMargin = 30, headerHeight = 0, footerHeight = 0 }): TDocumentDefinitions {
	return {
		pageSize: 'A4',
		pageOrientation: 'portrait', // use a valid literal
		pageMargins: [xMargin, headerHeight, xMargin, footerHeight],
		content: [],
		defaultStyle,

		// ... other properties
	};
}

export const DEFAULT_LETTER_PAGE = ({ xMargin, headerHeight, footerHeight }: PageProps) => ({
	pageSize: 'LETTER',
	pageOrientation: 'portrait',
	pageMargins: [xMargin, headerHeight, xMargin, footerHeight],
	defaultStyle,
	styles,
});

export const CUSTOM_PAGE = ({
	pageOrientation = 'landscape',
	xMargin,
	width = 290,
	height = 141,
	headerHeight,
	footerHeight,
	leftMargin,
	rightMargin,
}: CustomPageProps) => {
	let left: number, right: number;
	if (leftMargin !== undefined && rightMargin !== undefined) {
		left = leftMargin;
		right = rightMargin;
	} else {
		left = xMargin;
		right = xMargin;
	}

	return {
		pageSize: { width, height },
		pageOrientation,
		pageMargins: [left, headerHeight, right, footerHeight],
		defaultStyle,
		styles,
	};
};

export const CUSTOM_PAGE_STICKER = ({
	pageOrientation = 'portrait',
	xMargin,
	headerHeight,
	footerHeight,
}: CustomPageStickerProps) => {
	const width = 212.625;
	const height = 283.5;

	return {
		pageSize: { width, height },
		pageOrientation,
		defaultStyle: {
			fontSize: 10,
		},
	};
};

export const CUSTOM_PAGE_THREAD_STICKER = ({
	pageOrientation = 'portrait',
	xMargin,
	headerHeight,
	footerHeight,
}: CustomPageStickerProps) => {
	const width = 210;
	const height = 281;

	return {
		pageSize: { width, height },
		pageOrientation,
		pageMargins: [xMargin, headerHeight, xMargin, footerHeight],
		defaultStyle,
		styles,
	};
};

export const CUSTOM_PAGE_CONE_STICKER = ({
	pageOrientation = 'landscape',
	xMargin,
	headerHeight,
	footerHeight,
}: CustomPageStickerProps) => {
	const width = 71;
	const height = 227;

	return {
		pageSize: { width, height },
		pageOrientation,
		pageMargins: [xMargin, headerHeight, xMargin, footerHeight],
		defaultStyle,
		styles,
	};
};

// Table Helpers
//
type Alignment = 'left' | 'center' | 'right';

export const getTable = (
	field: string,
	name: string,
	alignment: Alignment = 'left',
	headerStyle: string = 'tableHeader',
	cellStyle: string = 'tableCell'
) => ({
	field,
	name,
	alignment,
	headerStyle,
	cellStyle,
});

// interface TableHeaderItem {
// 	field: string;
// 	name: string;
// 	alignment?: 'left' | 'center' | 'right';
// 	cellStyle?: string;
// 	headerStyle?: string;
// }

// interface TableHeaderCell {
// 	text: string;
// 	alignment: Alignment;
// 	color: string;
// 	bold: boolean;
// 	fontSize: number;
// 	colSpan: number;
// }

// export const TableHeader = (
// 	node: TableHeaderItem[],
// 	fontSize: number = DEFAULT_FONT_SIZE,
// 	color: string = PRIMARY_COLOR,
// 	colSpan: number = 1
// ): TableHeaderCell[] => {
// 	return node.map((nodeItem) => ({
// 		text: nodeItem.name,
// 		alignment: nodeItem.alignment,
// 		color,
// 		bold: true,
// 		fontSize,
// 		colSpan,
// 	}));
// };

// * HELPER: GET EMPTY COLUMN
export const getEmptyColumn = (colSpan: number): string[] => {
	const EMPTY_COLUMN: string[] = [];
	for (let i = 0; i < colSpan - 1; i++) {
		EMPTY_COLUMN.push('');
	}
	return EMPTY_COLUMN;
};
