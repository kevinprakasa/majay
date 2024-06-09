'use client';

import { useState } from 'react';
import { SKUViewModal } from '@/components/SKUViewModal';
import { SKU } from 'models';

export default function AddSKUPage() {
  const [formState, setFormState] = useState({
    name: '',
    code: '',
    stock: undefined as number | undefined,
    capitalPrice: undefined as number | undefined,
  });
  const [errorState, setErrorState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addedSKU, setAddedSKU] = useState<SKU>();

  const { capitalPrice, code, name, stock } = formState;

  const addSKU = async () => {
    setIsLoading(true);
    setErrorState('');
    try {
      const res = await fetch('/dashboard/sku/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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

  return (
    <div className='prose flex w-full flex-col items-center gap-4'>
      <h2>Tambah SKU baru</h2>
      <label className='form-control w-full max-w-xs'>
        <div className='label'>
          <span className='label-text'>Nama</span>
        </div>
        <input
          type='text'
          placeholder='e.g Paku 10cm'
          value={name}
          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
          className='input input-bordered w-full max-w-xs'
        />
      </label>
      <label className='form-control w-full max-w-xs'>
        <div className='label'>
          <span className='label-text'>Total stok</span>
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
          <span className='label-text'>Harga modal</span>
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
          <span className='label-text'>Kode barang</span>
        </div>
        <input
          type='text'
          placeholder='e.g PK10CM'
          value={code}
          onChange={(e) => setFormState({ ...formState, code: e.target.value })}
          className='input input-bordered w-full max-w-xs uppercase'
        />
      </label>
      {errorState && <div className='text-error '>{errorState}</div>}
      <button
        className='btn btn-primary btn-lg'
        disabled={!isFormValid()}
        onClick={() => {
          addSKU().then(setAddedSKU);
        }}
      >
        {isLoading && <span className='loading loading-spinner'></span>}
        Buat QR code
      </button>
      <SKUViewModal
        title={'SKU Berhasil ditambahkan'}
        open={!!addedSKU}
        sku={addedSKU}
        onClose={() => setAddedSKU(undefined)}
        onAddNewSKU={() => {
          setAddedSKU(undefined);
          setFormState({
            name: '',
            code: '',
            stock: 0,
            capitalPrice: 0,
          });
        }}
      />
    </div>
  );
}
