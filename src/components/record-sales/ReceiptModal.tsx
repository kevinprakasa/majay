'use client';

import { PrinterIcon, XMarkIcon } from '@heroicons/react/16/solid';
import { useEffect, useRef, useState } from 'react';
import { ReceiptData } from '@/services/printerService';
import { priceFormat } from '@/app/helper';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrintReceipt: () => void;
  receiptData?: ReceiptData;
}

export default function ReceiptModal({
  isOpen,
  onClose,
  onPrintReceipt,
  receiptData,
}: ReceiptModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

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

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      await onPrintReceipt();
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <dialog ref={dialogRef} className='modal' onClick={handleBackdropClick}>
      <div className='modal-box max-w-md'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-lg font-bold text-success'>
            Penjualan Berhasil!
          </h3>
          <button className='btn btn-circle btn-ghost btn-sm' onClick={onClose}>
            <XMarkIcon width={16} />
          </button>
        </div>

        <div className='py-4'>
          {receiptData && (
            <div className='mb-6 rounded-lg bg-base-200 p-4'>
              <h4 className='mb-3 font-semibold'>Detail Transaksi:</h4>
              <div className='space-y-2'>
                {receiptData.items.map((item, index) => (
                  <div key={index} className='flex justify-between text-sm'>
                    <div>
                      <div className='font-medium'>{item.name}</div>
                      <div className='text-xs text-gray-500'>{item.code}</div>
                    </div>
                    <div className='text-right'>
                      <div>
                        {item.quantity} x {priceFormat(item.priceUnit)}
                      </div>
                      <div className='font-medium'>
                        {priceFormat(item.priceTotal)}
                      </div>
                    </div>
                  </div>
                ))}
                <div className='border-t pt-2'>
                  <div className='flex justify-between font-bold'>
                    <span>Total:</span>
                    <span className='text-success'>
                      {priceFormat(receiptData.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className='mb-6 text-gray-600'>
            Penjualan telah berhasil disimpan. Apakah Anda ingin mencetak struk
            untuk transaksi ini?
          </p>

          <div className='flex justify-end gap-3'>
            <button
              className='btn btn-ghost'
              onClick={onClose}
              disabled={isPrinting}
            >
              Tidak, terima kasih
            </button>
            <button
              className='btn btn-primary'
              onClick={handlePrint}
              disabled={isPrinting}
            >
              {isPrinting && (
                <span className='loading loading-spinner loading-sm'></span>
              )}
              <PrinterIcon width={16} />
              {isPrinting ? 'Mencetak...' : 'Cetak Struk'}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
