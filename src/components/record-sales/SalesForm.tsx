'use client';

import { numberFormat, priceFormat } from '@/app/helper';
import { PlusIcon } from '@heroicons/react/16/solid';
import { useMutation, useQuery } from '@tanstack/react-query';
import { SKU, WithId } from 'models';
import { useEffect, useState } from 'react';

export default function SalesForm({ skuCode }: { skuCode: string }) {
  const [skuCodeState, setSkuCodeState] = useState<string>(skuCode);
  const [formState, setFormState] = useState<{
    code: string;
    id?: string;
    name?: string;
    quantity?: number;
    priceUnit?: number;
    priceTotal?: number;
  }>({
    code: '',
  });
  console.log('🚀 ~ SalesForm ~ formState:', formState);
  const { code, name, priceTotal, priceUnit, quantity, id } = formState;

  const { data: skuData } = useQuery({
    queryKey: ['sku', skuCodeState],
    queryFn: async () => {
      if (!skuCodeState) return;
      const res = await fetch(`/api/sku?code=${skuCodeState}`);
      return await res.json();
    },
  });
  const currentSku = skuData?.data[0] as WithId<SKU> | undefined;

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSkuCodeState(e.target.value);
    }
  };

  useEffect(() => {
    if (currentSku) {
      setFormState({
        code: currentSku.code,
        id: currentSku.id,
        name: currentSku.name,
        quantity: 1,
        priceUnit: Number(currentSku.capitalPrice),
        priceTotal: Number(currentSku.capitalPrice),
      });
    }
  }, [currentSku]);

  const {
    mutate: recordSales,
    error,
    isPending,
  } = useMutation({
    mutationFn: async () => {
      // Record the sales
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });
      if (!res.ok) {
        throw new Error(
          `HTTP error! Status: ${res.status} ${await res.text()} `
        );
      }
    },
  });

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      priceTotal: priceUnit ? priceUnit * (quantity || 1) : prev.priceTotal,
    }));
  }, [quantity, priceUnit]);

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      priceUnit: priceTotal
        ? Math.ceil(priceTotal / (prev.quantity || 1)) // just to prevent division issue
        : prev.priceUnit,
    }));
  }, [priceTotal]);

  useEffect(() => {
    setSkuCodeState(skuCode);
  }, [skuCode]);

  const isSkuAvailable = !!id;

  return (
    <>
      <div className='prose flex w-[400px] flex-col items-start gap-2 p-2 text-center '>
        <h3 className='text-lg text-accent'>Form Penjualan</h3>
        <label className='form-control w-full max-w-xs'>
          <div className='label'>
            <span className='label-text font-semibold'>Kode barang:</span>
          </div>

          <label className='input input-bordered flex items-center gap-2'>
            <input
              type='text'
              className='grow uppercase'
              value={code ?? ''}
              disabled={!!isSkuAvailable}
              onChange={(e) =>
                setFormState({ ...formState, code: e.target.value })
              }
              onKeyDown={handleKeyDown}
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
            <span className='label-text font-semibold'>Nama barang:</span>
          </div>
          <input
            type='text'
            placeholder='e.g. Paku beton....'
            value={name ?? ''}
            disabled={true}
            className='input input-bordered w-full max-w-xs'
          />
        </label>
        <label className='form-control w-full max-w-xs'>
          <div className='label'>
            <span className='label-text font-semibold'>
              Jumlah barang terjual:
            </span>
            {currentSku && (
              <span className='font-semibold-alt label-text'>
                Jumlah stok: {numberFormat(currentSku.stock)}
              </span>
            )}
          </div>
          <input
            type='number'
            disabled={!isSkuAvailable}
            placeholder='e.g. 10....'
            onChange={(e) => {
              setFormState({
                ...formState,
                quantity: !e.target.value ? undefined : Number(e.target.value),
              });
            }}
            value={quantity ?? ''}
            className='input input-bordered w-full max-w-xs'
          />
        </label>
        <label className='form-control w-full max-w-xs'>
          <div className='label'>
            <span className='label-text font-semibold'>Harga jual:</span>
            {currentSku && (
              <span className='font-semibold-alt label-text'>
                Harga modal: {priceFormat(currentSku.capitalPrice)}
              </span>
            )}
          </div>
          <label className='input input-bordered flex items-center gap-2'>
            Rp.
            <input
              type='number'
              disabled={!isSkuAvailable}
              value={priceUnit ?? ''}
              onChange={(e) => {
                setFormState({
                  ...formState,
                  priceUnit: !e.target.value
                    ? undefined
                    : Number(e.target.value),
                });
              }}
              className='input w-full max-w-xs border-none'
              placeholder='e.g. 1000....'
            />
            /pcs
          </label>
          <div className='divider text-xs'>Input salah satu</div>
          <label className='input input-bordered flex items-center gap-2'>
            Rp.
            <input
              type='number'
              disabled={!isSkuAvailable}
              onChange={(e) => {
                setFormState({
                  ...formState,
                  priceTotal: !e.target.value
                    ? undefined
                    : Number(e.target.value),
                });
              }}
              value={priceTotal ?? ''}
              className='input w-full max-w-xs border-none'
              placeholder='e.g. 10000....'
            />
            total
          </label>
        </label>
        {error && <p className='m-0 text-error'>{error.message}</p>}
        <button
          className='btn btn-primary mt-4 '
          onClick={() => {
            recordSales();
          }}
        >
          {isPending && <span className='loading loading-spinner'></span>}
          <PlusIcon width={16} />
          Simpan
          {/* TODO: Add alert notify when success */}
        </button>
      </div>
    </>
  );
}
