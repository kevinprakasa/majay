'use client';

import { numberFormat, priceFormat } from '@/app/helper';
import { PlusIcon, TrashIcon } from '@heroicons/react/16/solid';
import { useMutation, useQuery } from '@tanstack/react-query';
import { SKU, WithId } from 'models';
import { useEffect, useState } from 'react';
import { PlatformAlert } from '../PlatformAlert';

type FormItem = {
  code: string;
  id?: string;
  name?: string;
  quantity?: number;
  priceUnit?: number;
  priceTotal?: number;
};

export default function SalesForm({ skuCode }: { skuCode: string }) {
  const [skuCodeState, setSkuCodeState] = useState<string[]>([skuCode]);
  const [formItems, setFormItems] = useState<FormItem[]>([{ code: '' }]);

  const { data: skuData } = useQuery({
    queryKey: ['sku', skuCodeState[skuCodeState.length - 1]],
    queryFn: async () => {
      const lastCode = skuCodeState[skuCodeState.length - 1];
      if (!lastCode) return null;
      const res = await fetch(`/api/sku?code=${lastCode}`);
      return await res.json();
    },
  });
  const currentSku = skuData?.data[0] as WithId<SKU> | undefined;

  const handleKeyDown = (e: any, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newSkuCodes = [...skuCodeState];
      newSkuCodes[index] = e.target.value;
      setSkuCodeState(newSkuCodes);
    }
  };

  useEffect(() => {
    if (currentSku) {
      setFormItems((prev) => {
        const newItems = [...prev];
        const lastIndex = newItems.length - 1;
        newItems[lastIndex] = {
          code: currentSku.code,
          id: currentSku.id,
          name: currentSku.name,
          quantity: 1,
          priceUnit: Number(currentSku.capitalPrice),
          priceTotal: Number(currentSku.capitalPrice),
        };
        return newItems;
      });
    }
  }, [currentSku]);

  const {
    mutate: recordSales,
    error,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async () => {
      const salesData = formItems
        .filter((item) => item.id)
        .map((item) => ({
          id: item.id,
          quantity: item.quantity,
          priceUnit: item.priceUnit,
          priceTotal: item.priceTotal,
        }));

      if (salesData.length === 0) {
        throw new Error('No items to record');
      }

      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(salesData),
      });
      if (!res.ok) {
        throw new Error(`Error reason: ${await res.text()} `);
      }
    },
    onSuccess: () => {
      setFormItems([{ code: '' }]);
      setSkuCodeState(['']);
    },
  });

  const updateFormItem = (index: number, updates: Partial<FormItem>) => {
    setFormItems((prev) => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], ...updates };
      return newItems;
    });
  };

  const addNewItem = () => {
    setFormItems((prev) => [...prev, { code: '' }]);
    setSkuCodeState((prev) => [...prev, '']);
  };

  const removeItem = (index: number) => {
    setFormItems((prev) => prev.filter((_, i) => i !== index));
    setSkuCodeState((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className='prose flex w-full max-w-full flex-col items-center gap-2 p-2 text-center'>
        <h3 className='text-lg text-accent'>Form Penjualan</h3>
        <div className='w-full overflow-x-auto'>
          <table className='table'>
            <thead>
              <tr>
                <th>No</th>
                <th>Kode Barang</th>
                <th>Nama Barang</th>
                <th>Jumlah</th>
                <th>Harga Satuan</th>
                <th>Harga Total</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {formItems.map((formItem, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <div className='flex items-center gap-2'>
                      <input
                        type='text'
                        className='input input-sm input-bordered w-full uppercase'
                        value={formItem.code ?? ''}
                        disabled={!!formItem.id}
                        onChange={(e) =>
                          updateFormItem(index, { code: e.target.value })
                        }
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        placeholder='e.g. PAKUW10....'
                      />
                      <div
                        className='tooltip'
                        data-tip='Tekan enter untuk input kode secara manual'
                      >
                        <kbd className='kbd kbd-sm'>&crarr;</kbd>
                      </div>
                    </div>
                  </td>
                  <td>
                    <input
                      type='text'
                      placeholder='e.g. Paku beton....'
                      value={formItem.name ?? ''}
                      disabled={true}
                      className='input input-sm input-bordered w-full'
                    />
                  </td>
                  <td>
                    <div className='flex flex-col gap-1'>
                      <input
                        type='number'
                        disabled={!formItem.id}
                        placeholder='e.g. 10....'
                        onChange={(e) => {
                          const quantity = !e.target.value
                            ? undefined
                            : Number(e.target.value);
                          updateFormItem(index, {
                            quantity,
                          });
                        }}
                        value={formItem.quantity ?? ''}
                        className='input input-sm input-bordered w-full max-w-16'
                      />
                      {currentSku && index === formItems.length - 1 && (
                        <span className='text-xs'>
                          Stok: {numberFormat(currentSku.stock)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className='flex flex-col gap-1'>
                      <div className='input-group input-group-sm flex items-center gap-1'>
                        <span>Rp</span>
                        <input
                          type='number'
                          disabled={!formItem.id}
                          value={formItem.priceUnit ?? ''}
                          onChange={(e) => {
                            const priceUnit = !e.target.value
                              ? undefined
                              : Number(e.target.value);
                            updateFormItem(index, {
                              priceUnit,
                              priceTotal:
                                priceUnit && formItem.quantity
                                  ? priceUnit * formItem.quantity
                                  : undefined,
                            });
                          }}
                          className='input input-sm input-bordered w-full'
                          placeholder='e.g. 1000....'
                        />
                      </div>
                      {currentSku && index === formItems.length - 1 && (
                        <span className='text-xs'>
                          Modal: {priceFormat(currentSku.capitalPrice)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className='input-group input-group-sm flex items-center gap-1'>
                      <span>Rp</span>
                      <input
                        type='number'
                        disabled={!formItem.id}
                        onChange={(e) => {
                          const priceTotal = !e.target.value
                            ? undefined
                            : Number(e.target.value);
                          updateFormItem(index, {
                            priceTotal,
                            priceUnit:
                              priceTotal && formItem.quantity
                                ? priceTotal / formItem.quantity
                                : undefined,
                          });
                        }}
                        value={formItem.priceTotal ?? ''}
                        className='input input-sm input-bordered w-full'
                        placeholder='e.g. 10000....'
                      />
                    </div>
                  </td>
                  <td>
                    {formItems.length > 1 && (
                      <button
                        className='btn btn-neutral btn-sm flex-nowrap'
                        onClick={() => removeItem(index)}
                      >
                        <TrashIcon width={16} className='mr-1' />
                        Hapus
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {error && <PlatformAlert text={String(error)} type='error' />}
        <div className='mt-4 flex gap-2'>
          <button
            className='btn btn-secondary'
            onClick={addNewItem}
            disabled={!formItems[formItems.length - 1].id}
          >
            Tambah barang
          </button>
          <button
            className='btn btn-primary'
            onClick={() => {
              recordSales();
            }}
            disabled={!formItems.some((item) => item.id)}
          >
            {isPending && <span className='loading loading-spinner'></span>}
            <PlusIcon width={16} />
            Simpan penjualan
          </button>
        </div>
        {isSuccess && (
          <PlatformAlert text={'Penjualan telah disimpan'} type='success' />
        )}
      </div>
    </>
  );
}
