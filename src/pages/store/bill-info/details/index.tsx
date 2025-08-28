import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { IBillInfo } from '../../_config/columns/columns.type';
import { useStoreBillInfoByUUID } from '../../_config/query'; // TODO: replace with details query

import EntryTable from './entry-table';
import Information from './information';

const DetailsPage = () => {
	const { uuid } = useParams();
	const { data, isLoading, updateData } = useStoreBillInfoByUUID<IBillInfo>(uuid as string);

	useEffect(() => {
		document.title = 'Product Order Details';
	}, []);

	if (isLoading) return <div>Loading...</div>;

	return (
		<div className='space-y-8'>
			<Information data={(data || []) as IBillInfo} updateData={updateData} />
			<EntryTable data={(data || []) as IBillInfo} />
		</div>
	);
};

export default DetailsPage;
