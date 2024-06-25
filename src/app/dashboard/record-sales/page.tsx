'use client';
import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';
import SalesForm from '@/components/record-sales/SalesForm';
import QRCodeScanner from '@/components/QRCodeScanner';

export default function RecordSalesPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [scannedCode, setScannedCode] = useState<string>('');

  // file input handler
  useEffect(() => {
    const currentRef = fileInputRef?.current;
    if (fileInputRef) {
      fileInputRef.current?.addEventListener('change', (e) => {
        if ((e.target as HTMLInputElement)?.files?.length == 0) {
          // No file selected, ignore
          return;
        }
        // @ts-ignore
        const imageFile = e.target.files[0];

        // Scan QR Code
        if (html5QrCodeRef.current !== null) {
          html5QrCodeRef.current.scanFile(imageFile, false).then(
            (decodedText) => {
              // success, use decodedText
              setScannedCode(decodedText);
            },
            (err) => {
              // failure, handle it.
              console.warn(`Error scanning file. Reason: ${err}`);
            }
          );
        }
      });
    }
    return () => {
      currentRef?.removeEventListener('change', () => {});
    };
  }, [fileInputRef, html5QrCodeRef]);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode('reader');
    html5QrCodeRef.current = html5QrCode;
  }, []);

  return (
    <>
      <div className='mb-6 w-full text-center'>
        <span className='prose'>
          <h2 className='text-accent'>Input penjualan</h2>
        </span>
      </div>
      <div className='flex w-full flex-col items-center'>
        <div className='mb-4 flex flex-col items-center justify-around gap-4'>
          <label className='form-control w-full max-w-xs'>
            <div className='label'>
              <span className='label-text font-semibold'>
                Upload QR code barang:
              </span>
            </div>
            <input
              type='file'
              id='qr-input-file'
              placeholder='Upload QR code image'
              className='file-input file-input-bordered file-input-accent w-full max-w-xs'
              accept='image/*'
              capture
              ref={fileInputRef}
            ></input>
          </label>

          <div className='divider'>atau</div>
          <QRCodeScanner onScanned={setScannedCode} />
        </div>
        <div className='divider divider-accent'></div>
        <SalesForm skuCode={scannedCode} />
      </div>
    </>
  );
}
