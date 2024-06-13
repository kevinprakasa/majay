'use client';

import { numberFormat, priceFormat } from '@/app/helper';
import { PlusIcon } from '@heroicons/react/16/solid';
import { useQuery } from '@tanstack/react-query';
import { SKU } from 'models';

export default function SalesForm({ code }: { code: string }) {
  const { data } = useQuery({
    queryKey: ['sku', code],
    queryFn: async () => {
      const res = await fetch(`/dashboard/sku/api?code=${code}`);
      return await res.json();
    },
  });
  const currentSku = data?.data[0] as SKU | undefined;
  console.log('🚀 ~ SalesForm ~ currentSku:', currentSku);
  return (
    <>
      {currentSku && (
        <div className='prose flex w-[400px] flex-col items-center gap-2 p-2 text-center '>
          <h3 className='text-lg text-accent'>Form Penjualan</h3>
          <label className='form-control w-full max-w-xs'>
            <div className='label'>
              <span className='label-text'>Kode barang:</span>
            </div>

            <label className='input input-bordered flex items-center gap-2'>
              <input
                type='text'
                className='grow'
                placeholder='e.g. PAKUW10....'
              />
              <div
                className='tooltip'
                data-tip='Tekan enter untuk input kode secara manual'
              >
                <kbd className='kbd kbd-sm text-white'>&crarr;</kbd>
              </div>
            </label>
          </label>
          <label className='form-control w-full max-w-xs'>
            <div className='label'>
              <span className='label-text'>Nama barang:</span>
            </div>
            <input
              type='text'
              placeholder='e.g. Paku beton....'
              className='input input-bordered w-full max-w-xs'
            />
          </label>
          <label className='form-control w-full max-w-xs'>
            <div className='label'>
              <span className='label-text'>Jumlah barang terjual:</span>
              <span className='label-text-alt'>
                Jumlah stok: {numberFormat(currentSku.stock)}
              </span>
            </div>
            <input
              type='text'
              placeholder='e.g. 10....'
              className='input input-bordered w-full max-w-xs'
            />
          </label>
          <label className='form-control w-full max-w-xs'>
            <div className='label'>
              <span className='label-text'>Harga jual:</span>
              <span className='label-text-alt'>
                Harga modal: {priceFormat(currentSku.capitalPrice)}
              </span>
            </div>
            <label className='input input-bordered flex items-center gap-2'>
              <input type='text' className='grow' placeholder='e.g. 1000....' />
              /pcs
            </label>
            <div className='divider text-xs'>Input salah satu</div>
            <label className='input input-bordered flex items-center gap-2'>
              <input
                type='text'
                className='grow'
                placeholder='e.g. 10000....'
              />
              total
            </label>
          </label>
          <button className='btn btn-primary'>
            <PlusIcon width={16} /> Record penjualan
          </button>
        </div>
      )}
    </>
  );
}
