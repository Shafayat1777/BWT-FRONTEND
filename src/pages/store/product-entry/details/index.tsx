import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { IProductEntryTableData } from '../../_config/columns/columns.type';
import { useStoreProductsByUUID } from '../../_config/query'; // TODO: replace with details query
import EntryTable from './entry-table';
import Information from './information';

const DetailsPage = () => {
	const { uuid } = useParams();
	const { data, isLoading } = useStoreProductsByUUID<IProductEntryTableData>(uuid as string);

	useEffect(() => {
		document.title = 'Purchase Details';
	}, []);

	if (isLoading) return <div>Loading...</div>;

	return (
		<div className='space-y-8'>
			<Information data={(data || []) as IProductEntryTableData} />
			<EntryTable data={(data || []) as IProductEntryTableData} />
		</div>
	);
};

export default DetailsPage;
