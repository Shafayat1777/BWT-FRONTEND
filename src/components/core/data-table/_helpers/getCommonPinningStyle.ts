import { type Column } from '@tanstack/react-table';

import { colors } from '@/config/tailwind';

export function getCommonPinningStyles<TData>({
	column,
	isHeader = false,
}: {
	column: Column<TData>;
	/**
	 * Whether to show a box shadow on the right side of the last left pinned column or the left side of the first right pinned column.
	 * This is useful for creating a border between the pinned columns and the scrollable columns.
	 * @default false
	 */
	withBorder?: boolean;
	isHeader?: boolean;
}): React.CSSProperties {
	const isPinned = column.getIsPinned();
	const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');
	const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right');
	return {
		boxShadow: isLastLeftPinnedColumn
			? `-4px 0 3px -3px ${colors.BORDER}  inset`
			: isFirstRightPinnedColumn
				? `4px 0 3px -3px ${colors.BORDER}  inset`
				: undefined,
		left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
		right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
		opacity: isPinned ? 0.95 : 1,
		position: isPinned ? 'sticky' : 'relative',
		width: column.getSize(),
		minWidth: column.getSize(),
		background: isHeader ? colors.BASE_150 : colors.BASE_100,
		zIndex: isPinned ? 1 : 'none',
	};
}
