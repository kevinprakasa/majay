import { generateQRCodeCanvas, numberFormat, priceFormat } from '@/app/helper';
import { ArrowDownTrayIcon, PlusIcon } from '@heroicons/react/16/solid';
import { SKU } from 'models';
import { useEffect, useRef, useState } from 'react';

export const SKUViewModal: React.FC<{
  title: string;
  open: boolean;
  sku?: SKU;
  onClose: () => void;
  onAddNewSKU?: () => void;
}> = ({ open, title, sku, onClose, onAddNewSKU }) => {
  const [errorQR, setErrorQR] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { code, stock, capitalPrice } = sku || {};

  const onDownloadQrCode = () => {
    const a = document.createElement('a');
    a.href = canvasRef.current?.toDataURL('image/png') || '';
    a.download = `${code}_qrcode.png`;
    a.click();
  };

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  useEffect(() => {
    if (sku && canvasRef.current) {
      const { code, name } = sku;
      setErrorQR('');
      generateQRCodeCanvas(code, name, canvasRef.current, () => {
        setErrorQR('Error generating QR code');
      });
    }
  }, [sku, canvasRef]);

  return (
    <>
      <dialog
        ref={dialogRef}
        id='sku-view-modal'
        onClose={onClose}
        className='modal modal-bottom sm:modal-middle'
      >
        <div className='modal-box'>
          <form method='dialog'>
            {/* if there is a button in form, it will close the modal */}
            <button className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2'>
              ✕
            </button>
          </form>
          {errorQR ? (
            <p className='text-red-500'>{errorQR}</p>
          ) : (
            <div className='flex flex-col items-center gap-2'>
              <p className='text-lg font-bold'>{title}</p>
              <canvas ref={canvasRef} width='400' height='400'></canvas>

              <table className='table text-center'>
                <tbody>
                  <tr>
                    <th>Kode</th>
                    <td>{code}</td>
                  </tr>
                  <tr>
                    <th>Jumlah stok</th>
                    <td>{numberFormat(stock || 0)}</td>
                  </tr>
                  <tr>
                    <th>Harga modal</th>
                    <td>{priceFormat(capitalPrice || 0)}</td>
                  </tr>
                </tbody>
              </table>
              <div
                className={`flex w-full gap-2 ${onAddNewSKU ? 'justify-between' : 'justify-around'}`}
              >
                <button className='btn btn-primary' onClick={onDownloadQrCode}>
                  <ArrowDownTrayIcon width={16}></ArrowDownTrayIcon>
                  QRCode image
                </button>
                {onAddNewSKU && (
                  <button className='btn btn-accent' onClick={onAddNewSKU}>
                    <PlusIcon width={16}></PlusIcon>
                    Tambah barang lain
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
};
