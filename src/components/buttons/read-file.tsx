import React, { ChangeEvent } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ReadFileProps {
	onChange?: (data: unknown[]) => void;
}

const ReadFile: React.FC<ReadFileProps> = ({ onChange = () => {} }) => {
	const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();

		reader.onload = (event) => {
			const data = event.target?.result;
			if (!data) return;
			const workbook = XLSX.read(data, { type: 'array' });
			const sheetName = workbook.SheetNames[0];
			const sheet = workbook.Sheets[sheetName];
			const sheetData = XLSX.utils.sheet_to_json(sheet, { raw: false });
			onChange(sheetData);
		};

		reader.readAsArrayBuffer(file);
	};

	return (
		<div className='btn btn-xs relative flex gap-1 rounded bg-teal-500 p-2 text-slate-100'>
			<FileSpreadsheet className='size-4' />
			<span className='text-xs'>Upload</span>
			<input
				className='absolute inset-0 z-50 m-0 h-full w-full cursor-pointer opacity-0'
				type='file'
				onChange={handleFileUpload}
			/>
		</div>
	);
};

export default ReadFile;
