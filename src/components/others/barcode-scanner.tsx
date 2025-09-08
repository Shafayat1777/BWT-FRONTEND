// src/components/others/moder-bar-code-scanner.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { SymbologyType, useBarcodeScanner } from '@/hooks/useSymbolScanner';

import { cn } from '@/lib/utils';

interface BarcodeScannerProps {
	title?: string;
	onScanComplete: (code: string, symbologies: string[]) => void;
	onError?: (error: any) => void;
	disabled?: boolean;
	children?: React.ReactNode;
	defaultEnabled?: boolean;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
	title,
	onScanComplete,
	onError,
	disabled = false,
	children,
	defaultEnabled = true,
}) => {
	const [error, setError] = useState<string | null>(null);
	const [isFocused, setIsFocused] = useState(false);
	const [isEnabled, setIsEnabled] = useState<boolean>(defaultEnabled);
	const effectiveEnabled = !disabled && isEnabled;

	const handleScan = useCallback(
		(code: string, symbologies: string[]) => {
			if (!effectiveEnabled) return;
			setError(null);
			onScanComplete(code, symbologies);
		},
		[onScanComplete, effectiveEnabled]
	);

	const handleScanError = useCallback(
		(err: any) => {
			console.error('Scanner error', err);
			setError('Failed to scan barcode');
			onError?.(err);
		},
		[onError]
	);


	const { containerRef } = useBarcodeScanner({
		onScan: handleScan,
		onError: handleScanError,
		enabled: effectiveEnabled,
		maxDelay: 100,
	});

	const focusScanner = useCallback(() => {
		const el = containerRef?.current;
		if (effectiveEnabled && el) {
			el.focus();
			setIsFocused(true);
		}
	}, [containerRef, effectiveEnabled]);

	const blurScanner = useCallback(() => {
		const el = containerRef?.current;
		if (el && document.activeElement === el) {
			(document.activeElement as HTMLElement).blur();
		}
		setIsFocused(false);
	}, [containerRef]);

	useEffect(() => {
		const el = containerRef?.current;
		if (!el) return;

		const onFocus = () => setIsFocused(true);
		const onBlur = () => setIsFocused(false);

		el.addEventListener('focus', onFocus);
		el.addEventListener('blur', onBlur);

		const t = setTimeout(() => {
			if (effectiveEnabled) focusScanner();
		}, 80);

		return () => {
			el.removeEventListener('focus', onFocus);
			el.removeEventListener('blur', onBlur);
			clearTimeout(t);
		};
	}, [containerRef, focusScanner, effectiveEnabled]);

	useEffect(() => {
		if (!effectiveEnabled) blurScanner();
	}, [effectiveEnabled, blurScanner]);

	useEffect(() => {
		if (!effectiveEnabled) return;
		const onDocClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			if (
				target.matches('input, textarea, select, button, [contenteditable="true"]') ||
				target.closest('input, textarea, select, button, [contenteditable="true"], .react-select')
			) {
				return;
			}
			setTimeout(() => focusScanner(), 100);
		};
		document.addEventListener('click', onDocClick, true);
		return () => document.removeEventListener('click', onDocClick, true);
	}, [effectiveEnabled, focusScanner]);

	const handleToggle = () => {
		if (!isFocused || !isEnabled) {
			setIsEnabled(true);
			setTimeout(() => focusScanner(), 60);
		} else {
			setIsEnabled(false);
			blurScanner();
		}
	};

	const handleErrorClose = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setError(null);
		if (effectiveEnabled) setTimeout(() => focusScanner(), 80);
	};

	const statusLabel = disabled ? 'Disabled' : isFocused && isEnabled ? 'Active' : 'Inactive';

	const isActive = !isFocused || !isEnabled ? false : true;

	return (
		<div>
			<div className='flex items-center justify-between gap-2 rounded-t-md bg-primary px-4 py-3'>
				<div className='flex items-center gap-2'>
					<h3 className='text-2xl font-semibold capitalize leading-tight text-primary-foreground md:text-3xl'>
						{title}
					</h3>
				</div>
			</div>
			<div
				ref={containerRef}
				className='rounded-b-lg border-b-2 bg-accent-foreground border p-2 shadow-sm outline-none'
				tabIndex={0}
				onClick={() => {
					if (effectiveEnabled) focusScanner();
				}}
			>
				<div className='flex items-center justify-between'>
					<div className='flex gap-4'>
						<div>
							{isActive && (
								<div>
									<button
										onClick={handleToggle}
										disabled={disabled}
										type='button'
										className='mt-7 rounded-md bg-green-500 px-4 py-2 text-sm text-white transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 disabled:cursor-not-allowed disabled:bg-gray-300'
									>
										Active
									</button>
									<p className='ml-1 mt-1 text-xs text-gray-500'>Tap/Click to Deactivate</p>
								</div>
							)}
							{!isActive && (
								<div>
									<button
										onClick={handleToggle}
										disabled={disabled}
										type='button'
										className='mt-7 rounded-md bg-red-500 px-4 py-2 text-sm text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-green-300 disabled:cursor-not-allowed disabled:bg-gray-300'
									>
										Deactivate
									</button>
									<p className='mt-2 text-xs text-gray-500'>Tap/Click to Activate</p>
								</div>
							)}
						</div>
						{children}
					</div>
					
				</div>

				{error && (
					<div className='mb-4 rounded-md border border-red-200 bg-red-50 p-3'>
						<div className='flex items-center'>
							<div className='text-sm font-medium text-red-800'>{error}</div>
							<button
								onClick={handleErrorClose}
								className='ml-auto rounded px-2 py-1 text-lg leading-none text-red-600 hover:bg-red-100 hover:text-red-800'
								type='button'
							>
								×
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default BarcodeScanner;
