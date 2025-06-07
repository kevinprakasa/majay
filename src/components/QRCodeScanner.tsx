'use client';
import { Html5Qrcode } from 'html5-qrcode';
import { QrCodeIcon } from '@heroicons/react/16/solid';
import { useEffect, useRef, useState } from 'react';

export default function QRCodeScanner({
  onScanned,
}: {
  onScanned: (code: string) => void;
}) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const startScanning = async () => {
    if (!html5QrCodeRef.current) return;

    setError(null);
    setIsScanning(true);

    const qrCodeSuccessCallback = (qrCodeMessage: string) => {
      onScanned(qrCodeMessage);
      modalRef.current?.close();
    };

    const qrCodeErrorCallback = (errorMessage: string) => {
      // Parse error, ignore it (these are frequent when no QR code is in view)
      console.warn(errorMessage);
    };

    const config = {
      fps: 10,
      qrbox: 250,
    };

    try {
      // First try with back camera (environment)
      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        config,
        qrCodeSuccessCallback,
        qrCodeErrorCallback
      );
    } catch (err) {
      console.warn('Back camera not available, trying front camera:', err);
      try {
        // Fallback to front camera
        await html5QrCodeRef.current.start(
          { facingMode: 'user' },
          config,
          qrCodeSuccessCallback,
          qrCodeErrorCallback
        );
      } catch (err2) {
        console.warn('Front camera not available, trying any camera:', err2);
        try {
          // Fallback to any available camera
          await html5QrCodeRef.current.start(
            { facingMode: { ideal: 'environment' } },
            config,
            qrCodeSuccessCallback,
            qrCodeErrorCallback
          );
        } catch (err3) {
          console.error('No camera available:', err3);
          setError(
            'Camera not available. Please check permissions and ensure no other app is using the camera.'
          );
          setIsScanning(false);
        }
      }
    }
  };

  const onScanProduct = () => {
    modalRef.current?.showModal();
    startScanning();
  };

  const closeModal = () => {
    if (html5QrCodeRef.current && isScanning) {
      html5QrCodeRef.current
        .stop()
        .then(() => {
          setIsScanning(false);
        })
        .catch((err) => {
          console.warn('Error stopping camera:', err);
          setIsScanning(false);
        });
    }
    setError(null);
  };

  useEffect(() => {
    const html5QrCode = new Html5Qrcode('reader');
    html5QrCodeRef.current = html5QrCode;

    return () => {
      // Cleanup on unmount
      if (html5QrCodeRef.current && isScanning) {
        html5QrCodeRef.current.stop().catch(console.warn);
      }
    };
  }, [isScanning]);

  return (
    <>
      <dialog
        className='modal modal-bottom sm:modal-middle'
        ref={modalRef}
        onClose={closeModal}
      >
        <div className='modal-box flex flex-col items-center'>
          {error ? (
            <div className='text-center'>
              <div className='mb-4 text-error'>{error}</div>
              <button
                className='btn btn-primary'
                onClick={() => {
                  setError(null);
                  startScanning();
                }}
              >
                Try Again
              </button>
            </div>
          ) : (
            <div id='reader' className='w-[400px]'></div>
          )}
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
      <button className='btn btn-ghost btn-sm' onClick={onScanProduct}>
        <QrCodeIcon width={16} />
      </button>
    </>
  );
}
