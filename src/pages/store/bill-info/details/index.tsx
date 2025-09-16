import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

import { IBillInfo } from '../../_config/columns/columns.type';
import { useStoreBillInfoByUUID } from '../../_config/query'; // TODO: replace with details query

import ChallanBIllPdf from '../../../../components/pdf/product-order-bill';
import ChallanPdf from '../../../../components/pdf/product-order-challan';
import EntryTable from './entry-table';
import Information from './information';

const DetailsPage = () => {
	const { uuid } = useParams();
	const { user } = useAuth();
	const { data, isLoading, updateData } = useStoreBillInfoByUUID<IBillInfo>(uuid as string);
	const fullURL = window.location.href;
	const slice = fullURL.split('w');
	const baseURl = slice[0];
	const [data2, setData] = useState('');
	const [data3, setData2] = useState('');
	useEffect(() => {
		document.title = 'Product Order Details';
	}, []);
	useEffect(() => {
		const generatePdf = async () => {
			if (data && user) {
				(await ChallanPdf(data, user, baseURl))?.getDataUrl((dataUrl) => {
					setData(dataUrl);
				});
				(await ChallanBIllPdf(data, user, baseURl))?.getDataUrl((dataUrl) => {
					setData2(dataUrl);
				});
			}
		};
		generatePdf();
	}, [data, user, baseURl]);

	if (isLoading) return <div>Loading...</div>;

	return (
		<div className='space-y-8'>
			<div className='flex gap-2'>
				<iframe src={data2} className='h-[40rem] w-full rounded-md border-none' />
				<iframe src={data3} className='h-[40rem] w-full rounded-md border-none' />
			</div>
			<Information data={(data || []) as IBillInfo} updateData={updateData} />
			<EntryTable data={(data || []) as IBillInfo} />
		</div>
	);
};

export default DetailsPage;
