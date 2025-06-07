'use client';

import { PrinterIcon, XMarkIcon } from '@heroicons/react/16/solid';
import { useEffect, useRef } from 'react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrintReceipt: () => void;
}

export default function ReceiptModal({
  isOpen,
  onClose,
  onPrintReceipt,
}: ReceiptModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <dialog ref={dialogRef} className='modal' onClick={handleBackdropClick}>
      <div className='modal-box'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-lg font-bold text-success'>
            Penjualan Berhasil!
          </h3>
          <button className='btn btn-circle btn-ghost btn-sm' onClick={onClose}>
            <XMarkIcon width={16} />
          </button>
        </div>

        <div className='py-4'>
          <p className='mb-6 text-gray-600'>
            Penjualan telah berhasil disimpan. Apakah Anda ingin mencetak struk
            untuk transaksi ini?
          </p>

          <div className='flex justify-end gap-3'>
            <button className='btn btn-ghost' onClick={onClose}>
              Tidak, terima kasih
            </button>
            <button className='btn btn-primary' onClick={onPrintReceipt}>
              <PrinterIcon width={16} />
              Cetak Struk
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
