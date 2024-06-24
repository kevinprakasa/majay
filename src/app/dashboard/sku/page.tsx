import SKUTable from '@/components/sku/SKUTable';
import { CameraIcon, PlusIcon } from '@heroicons/react/16/solid';
import Link from 'next/link';

export default function SKUPage() {
  return (
    <>
      <div className='mb-6 w-full text-left'>
        <span className='prose'>
          <h2 className='text-accent'>List barang</h2>
        </span>
      </div>
      <div className='flex w-full flex-col gap-4'>
        <div className='flex justify-between'>
          <button className='btn btn-accent btn-md'>
            <CameraIcon width={16} />
            Scan QR code barang
          </button>
          <Link href='/dashboard/sku/add'>
            <button className='btn btn-accent btn-md'>
              <PlusIcon width={16} />
              Tambah barang
            </button>
          </Link>
        </div>

        <SKUTable />
      </div>
    </>
  );
}
