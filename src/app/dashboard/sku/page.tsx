'use client';

import QRCodeScanner from '@/components/QRCodeScanner';
import SKUTable from '@/components/sku/SKUTable';
import { PlusIcon } from '@heroicons/react/16/solid';
import Link from 'next/link';
import { useState } from 'react';

export default function SKUPage() {
  const [scannedCode, setScannedCode] = useState<string>('');
  return (
    <>
      <div className='mb-6 w-full text-left'>
        <span className='prose'>
          <h2 className='text-accent'>List Barang</h2>
        </span>
      </div>
      <div className='flex w-full flex-col gap-4'>
        <div className='flex flex-col items-baseline justify-between gap-4 sm:flex-row'>
          <QRCodeScanner onScanned={setScannedCode} />
          <Link href='/dashboard/sku/add'>
            <button className='btn btn-accent btn-md'>
              <PlusIcon width={16} />
              Tambah barang
            </button>
          </Link>
        </div>

        <SKUTable code={scannedCode} setCode={setScannedCode} />
      </div>
    </>
  );
}
