
import { useCallback, useRef } from 'react';
import { useSymbologyScanner } from '@use-symbology-scanner/react';
const SYMBOLOGY_TYPES = {
	'EAN-13': 'EAN-13',
	'EAN-8': 'EAN-8',
	'UPC-A': 'UPC-A',
	'UPC-E': 'UPC-E',
	'Code 128': 'Code 128',
	'Code 39': 'Code 39',
	'Code 93': 'Code 93',
	Codabar: 'Codabar',
	ITF: 'ITF',
	'QR Code': 'QR Code',
	'Data Matrix': 'Data Matrix',
	PDF417: 'PDF417',
} as const;

type SymbologyType = keyof typeof SYMBOLOGY_TYPES;

interface UseBarcodeDetectionOptions {
	onScan: (code: string, symbologies: string[]) => void;
	onError?: (error: any) => void;
	enabled?: boolean;
	prefix?: string;
	suffix?: string;
	maxDelay?: number;
	target?: React.RefObject<HTMLElement>;
}

export const useBarcodeScanner = (options: UseBarcodeDetectionOptions) => {
	const {
		onScan,
		onError,
		enabled = true,
		prefix = '',
		suffix = '\n', 
		maxDelay = 100, 
		target,
	} = options;

	const containerRef = useRef<HTMLDivElement>(null);
	const targetElement = target || containerRef;

	const handleSymbol = useCallback(
		(symbol: string, matchedSymbologies: string[] = []) => {
			try {
				if (symbol.trim().length < 3) {
					console.error('Symbol too short, ignoring:', symbol);
					return;
				}
				const inferredSymbologies =
					matchedSymbologies.length > 0 ? matchedSymbologies : inferSymbologyFromCode(symbol);
				onScan(symbol, inferredSymbologies);
			} catch (error) {
				console.error('Barcode scan error:', error);
				onError?.(error);
			}
		},
		[onScan, onError]
	);

	// Use symbology scanner hook with correct configuration
	useSymbologyScanner(handleSymbol, {
		target: targetElement,
		enabled,
		preventDefault: false, 
		scannerOptions: {
			prefix,
			suffix,
			maxDelay,
			
		},
		eventOptions: {
			capture: true,
			passive: false,
		},
	});

	return {
		containerRef: targetElement === containerRef ? containerRef : null,
		supportedSymbologies: Object.keys(SYMBOLOGY_TYPES) as SymbologyType[],
	};
};

// Helper function to infer symbology from barcode pattern
function inferSymbologyFromCode(code: string): string[] {
	const cleanCode = code.trim();

	// Basic pattern matching for common symbologies
	if (/^\d{13}$/.test(cleanCode)) {
		return ['EAN-13'];
	} else if (/^\d{12}$/.test(cleanCode)) {
		return ['UPC-A'];
	} else if (/^\d{8}$/.test(cleanCode)) {
		return ['EAN-8'];
	} else if (/^\d{6}$/.test(cleanCode)) {
		return ['UPC-E'];
	} else if (/^[A-Z0-9\-. $\/+%]+$/i.test(cleanCode)) {
		return ['Code 39'];
	} else if (/^[\x00-\x7F]+$/.test(cleanCode)) {
		return ['Code 128'];
	}

	return ['Unknown'];
}

export { SYMBOLOGY_TYPES };
export type { SymbologyType, UseBarcodeDetectionOptions };
