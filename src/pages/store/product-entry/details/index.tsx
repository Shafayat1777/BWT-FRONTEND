import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { IPurchaseDetails } from '../../_config/columns/columns.type';
import { useStorePurchasesByUUID } from '../../_config/query'; // TODO: replace with details query
import EntryTable from './entry-table';
import Information from './information';

const DetailsPage = () => {
	const { uuid } = useParams();
	const { data, isLoading } = useStorePurchasesByUUID<IPurchaseDetails>(uuid as string);

	useEffect(() => {
		document.title = 'Purchase Details';
	}, []);

	if (isLoading) return <div>Loading...</div>;

	return (
		<div className='space-y-8'>
			<Information data={(data || []) as IPurchaseDetails} />
			<EntryTable data={(data || []) as IPurchaseDetails} />
		</div>
	);
};

export default DetailsPage;
