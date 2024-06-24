'use client';

import { useEffect, useState } from 'react';
import { SKU, WithId } from 'models';
import { useRouter } from 'next/navigation';
import { PlatformAlert } from '@/components/PlatformAlert';

export default function EditSkuPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formState, setFormState] = useState({
    name: '',
    code: '',
    stock: undefined as number | undefined,
    capitalPrice: undefined as number | undefined,
  });
  const [errorState, setErrorState] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { capitalPrice, code, name, stock } = formState;

  const updateSKU = async () => {
    setIsLoading(true);
    setErrorState('');
    try {
      const res = await fetch('/api/sku', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: params.id,
          name,
          code,
          stock,
          capitalPrice,
        }),
      });
      if (!res.ok) {
        throw new Error(
          `HTTP error! Status: ${res.status} ${await res.text()} `
        );
      }
      const data = await res.json();

      setIsLoading(false);

      return data as SKU;
    } catch (error) {
      if (error instanceof Error) {
        setErrorState(error.message);
      }
    }

    setIsLoading(false);
  };

  const isFormValid = () => {
    if (!name || !code || !stock || !capitalPrice) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (params.id) {
      fetch(`/api/sku?id=${params.id}`)
        .then((res) => {
          return res.json() as Promise<{ data: WithId<SKU>[]; total: number }>;
        })
        .then(({ data }) => {
          const sku = data[0];

          setFormState({
            name: sku.name,
            code: sku.code,
            stock: sku.stock,
            capitalPrice: Number(sku.capitalPrice),
          });
        });
    }
  }, [params.id]);

  return (
    <div className='prose flex w-full flex-col items-center gap-4'>
      <div className='w-full text-center'>
        <h2 className='text-accent'>Input penjualan</h2>
      </div>
      <label className='form-control w-full max-w-xs'>
        <div className='label'>
          <span className='label-text font-semibold'>Nama:</span>
        </div>
        <input
          type='text'
          placeholder='e.g Paku 10cm'
          value={name}
          disabled
          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
          className='input input-bordered w-full max-w-xs'
        />
      </label>
      <label className='form-control w-full max-w-xs'>
        <div className='label'>
          <span className='label-text font-semibold'>Jumlah stok:</span>
        </div>
        <input
          type='number'
          min='1'
          value={stock}
          onChange={(e) =>
            setFormState({ ...formState, stock: Number(e.target.value) })
          }
          placeholder='e.g 100'
          className='input input-bordered w-full max-w-xs'
        />
      </label>
      <label className='form-control w-full max-w-xs'>
        <div className='label'>
          <span className='label-text font-semibold'>Harga modal:</span>
        </div>

        <label className='input input-bordered flex items-center gap-2'>
          Rp
          <input
            type='number'
            className='grow'
            placeholder='e.g 10000'
            value={capitalPrice}
            onChange={(e) =>
              setFormState({
                ...formState,
                capitalPrice: Number(e.target.value),
              })
            }
          />
        </label>
      </label>
      <label className='form-control w-full max-w-xs'>
        <div className='label'>
          <span className='label-text font-semibold'>Kode barang:</span>
        </div>
        <input
          type='text'
          placeholder='e.g PK10CM'
          value={code}
          onChange={(e) => setFormState({ ...formState, code: e.target.value })}
          className='input input-bordered w-full max-w-xs uppercase'
        />
      </label>
      {errorState && (
        <PlatformAlert text={errorState} type='error'></PlatformAlert>
      )}
      <button
        className='btn btn-primary btn-lg'
        disabled={!isFormValid()}
        onClick={() => {
          updateSKU().then(() => {
            router.push('/dashboard/sku');
          });
        }}
      >
        {isLoading && <span className='loading loading-spinner'></span>}
        Simpan
      </button>
    </div>
  );
}
