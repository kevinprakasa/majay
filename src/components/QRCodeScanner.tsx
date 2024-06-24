'use client';
import { Html5Qrcode } from 'html5-qrcode';
import { CameraIcon } from '@heroicons/react/16/solid';
import { useEffect, useRef, useState } from 'react';

export default function QRCodeScanner({
  onScanned,
}: {
  onScanned: (code: string) => void;
}) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

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
          onScanned(qrCodeMessage);

          modalRef.current?.close();
        },
        (errorMessage) => {
          // parse error, ignore it.
          console.warn(errorMessage);
        }
      );
    }
  };

  useEffect(() => {
    const html5QrCode = new Html5Qrcode('reader');
    html5QrCodeRef.current = html5QrCode;
  }, []);

  return (
    <>
      <dialog
        className='modal modal-bottom sm:modal-middle'
        ref={modalRef}
        onClose={() => {
          html5QrCodeRef.current?.stop();
        }}
      >
        <div className='modal-box flex justify-center'>
          <div id='reader' className='w-[400px]'></div>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
      <button className='btn btn-accent btn-md' onClick={onScanProduct}>
        <CameraIcon width={16} />
        Scan QR code barang
      </button>
    </>
  );
}
