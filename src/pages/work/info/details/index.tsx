import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

import { IInfoTableData } from '../../_config/columns/columns.type';
import { useWorkInfoByUUID } from '../../_config/query';
import ChallanPdf from '../../../../components/pdf/product-received';
import ChallanPdfV2 from '../../../../components/pdf/product-received-v2';
import Information from './information';
import OrderTable from './order-table';

const DetailsPage = () => {
	const { user } = useAuth();
	const { uuid } = useParams();
	const fullURL = window.location.href;
	const slice = fullURL.split('w');
	const baseURl = slice[0];
	const { data, isLoading } = useWorkInfoByUUID<IInfoTableData>(uuid as string);

	useEffect(() => {
		document.title = 'Order Info Details';
	}, []);
	const [data2, setData] = useState('');
	const [data3, setData3] = useState('');
	useEffect(() => {
		const generatePdf = async () => {
			if (data && user) {
				(await ChallanPdf(data, user, baseURl))?.getDataUrl((dataUrl) => {
					setData(dataUrl);
				});
				(await ChallanPdfV2(data, user, baseURl))?.getDataUrl((dataUrl) => {
					setData3(dataUrl);
				});
			}
		};
		generatePdf();
	}, [data, user, baseURl]);
	if (isLoading) return <div>Loading...</div>;

	return (
		<div className='space-y-8'>
			<div className='grid grid-cols-2 gap-4'>
				{/* <div className=''>
					<iframe src={data2} className='h-[40rem] w-full rounded-md border-none' />
				</div> */}
				<div className=''>
					<iframe src={data3} className='h-[40rem] w-full rounded-md border-none' />
				</div>
				<div className='col-span-2'>
					<Information data={(data || []) as IInfoTableData} />
				</div>
			</div>
			<OrderTable data={(data || []) as IInfoTableData} />
		</div>
	);
};

export default DetailsPage;
