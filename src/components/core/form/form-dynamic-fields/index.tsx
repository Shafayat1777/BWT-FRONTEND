import DynamicFieldContainer from './_components/container';
import DefaultDynamicFields from './_components/default';
import KanbanDynamicFields from './_components/kanban';
import SpreadsheetDynamicFields from './_components/spreadsheet';
import { DynamicFieldsProps } from './types';

const FormDynamicFields = (props: DynamicFieldsProps) => {
	return (
		<DynamicFieldContainer
			title={props.title}
			extraHeader={props.extraHeader}
			handleAdd={props.handleAdd}
			containerClassName={props.containerClassName}
			extraButton={props.extraButton}
		>
			{props.viewAs === 'spreadsheet' ? (
				<SpreadsheetDynamicFields {...props} />
			) : props.viewAs === 'kanban' ? (
				<KanbanDynamicFields {...props} />
			) : (
				<DefaultDynamicFields {...props} />
			)}
		</DynamicFieldContainer>
	);
};

export default FormDynamicFields;
