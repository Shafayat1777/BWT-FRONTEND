import React from 'react';
import SectionContainer from '@/components/others/section-container';
import TableList, { ITableListItems } from '@/components/others/table-list';
import { IOrderTableData } from '../_config/columns/columns.type';
import { Problem } from '../_config/utils/component';

const Information: React.FC<{ data: IOrderTableData }> = ({ data }) => {
	const renderGeneralItems = (): ITableListItems => {
		return [
			{
				label: 'Order Problem',
				value: (
					<Problem
						problems_name={
							data?.order_problems_name
								?.map((item: string) => item)
								.join(', ')
								.replace(/_/g, ' ') as string
						}
						problem_statement={data?.problem_statement}
					/>
				),
			},
			{
				label: 'Diagnosis Problem',
				value: (
					<Problem
						problems_name={
							data?.diagnosis_problems_name
								?.map((item: string) => item)
								.join(', ')
								.replace(/_/g, ' ') as string
						}
						problem_statement={data?.diagnosis_problem_statement}
					/>
				),
			},
			{
				label: 'Repairing Problem',
				value: (
					<Problem
						problems_name={
							data?.repairing_problems_name
								?.map((item) => item)
								.join(', ')
								.replace(/_/g, ' ') as string
						}
						problem_statement={data?.repairing_problem_statement}
					/>
				),
			},
			{
				label: 'QC Problem',
				value: (
					<Problem
						problems_name={
							data?.qc_problems_name
								?.map((item) => item)
								.join(', ')
								.replace(/_/g, ' ') as string
						}
						problem_statement={data?.qc_problem_statement}
					/>
				),
			},
		];
	};

	return (
		<>
			<SectionContainer title={'Problem Details'}>
				<TableList title='General' className='w-full' items={renderGeneralItems()} />
			</SectionContainer>
		</>
	);
};

export default Information;
