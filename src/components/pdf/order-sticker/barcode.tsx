import JsBarcode from 'jsbarcode';

export function generateBarcodeAsBase64(text: string, value: string | number) {
	const canvas = document.createElement('canvas');
	JsBarcode(canvas, String(value), {
		format: 'CODE128',
		text: text,
		width: 2,
		height: 50,
		displayValue: false,
		fontSize: 12,
		margin: 10,
		background: '#ffffff',
		lineColor: '#000000',
	});
	return canvas.toDataURL('image/png');
}
