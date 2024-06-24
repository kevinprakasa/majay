'use client';
import { Html5Qrcode } from 'html5-qrcode';
import { QrCodeIcon } from '@heroicons/react/16/solid';
import { useEffect, useRef, useState } from 'react';
import SalesForm from '@/components/record-sales/SalesForm';

export default function RecordSalesPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  console.log('🚀 ~ RecordSalesPage ~ scannedCode:', scannedCode);

  const onScanProduct = () => {
    modalRef.current?.showModal();
    if (html5QrCodeRef.current !== null) {
      html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: 250,
        },
        (qrCodeMessage) => {
          // do something when code is read
          console.log('🚀 ~ qrCodeMessage:', qrCodeMessage);
          setScannedCode(qrCodeMessage);

          html5QrCodeRef.current?.stop();
          modalRef.current?.close();
        },
        (errorMessage) => {
          // parse error, ignore it.
        }
      );
    }
  };

  useEffect(() => {
    const currentRef = fileInputRef?.current;
    if (fileInputRef) {
      fileInputRef.current?.addEventListener('change', (e) => {
        console.log('🚀 ~ fileInputRef.current?.addEventListener ~ e:', e);
        if ((e.target as HTMLInputElement)?.files?.length == 0) {
          // No file selected, ignore
          return;
        }
        // @ts-ignore
        const imageFile = e.target.files[0];
        console.log(
          '🚀 ~ fileInputRef.current?.addEventListener ~ imageFile:',
          imageFile
        );
        // Scan QR Code
        if (html5QrCodeRef.current !== null) {
          html5QrCodeRef.current.scanFile(imageFile, false).then(
            (decodedText) => {
              // success, use decodedText
              console.log(decodedText);
              setScannedCode(decodedText);
            },
            (err) => {
              // failure, handle it.
              console.log(`Error scanning file. Reason: ${err}`);
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
      <dialog
        className='modal'
        ref={modalRef}
        onClose={() => {
          html5QrCodeRef.current?.stop();
          setScannedCode(null);
        }}
      >
        <div className='modal-box flex justify-center'>
          <div id='reader' className='sm:w-[400px]'></div>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
      <div className='mb-6 w-full text-left'>
        <span className='prose'>
          <h2 className='text-accent'>Input penjualan</h2>
        </span>
      </div>
      <div className='flex w-full flex-col items-start'>
        <div className='mb-4 flex flex-col items-start justify-around gap-4'>
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
          <button className='btn btn-accent btn-md' onClick={onScanProduct}>
            <QrCodeIcon width={16} />
            Scan QR barang
          </button>
        </div>
        <div className='divider divider-accent'></div>
        <SalesForm skuCode={scannedCode || ''} />
      </div>
    </>
  );
}
