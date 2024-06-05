import SKUTable from '@/components/sku/SKUTable';
import Link from 'next/link';

export default function SKUPage() {
  return (
    <div className='flex w-full flex-col gap-4'>
      <div className='flex justify-between'>
        <button className='btn btn-accent btn-lg'>Scan QR SKU</button>
        <Link href='/dashboard/sku/add-sku'>
          <button className='btn btn-accent btn-lg'>Tambah SKU baru</button>
        </Link>
      </div>

      <SKUTable />
    </div>
  );
}
