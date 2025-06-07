'use client';

import { numberFormat, priceFormat } from '@/app/helper';
import DeleteSaleModal from '@/components/sales/DeleteSaleModal';
import { TrashIcon } from '@heroicons/react/16/solid';
import { useQuery } from '@tanstack/react-query';
import { SKU, Sale, WithId } from 'models';
import { useEffect, useState } from 'react';

const MONTHS_NUM_OPTIONS = [1, 3, 6, 9, 12];

export default function SalesPage() {
  const [lastXMonths, setLastXMonths] = useState<number | 'custom'>(1);
  const [fetchParams, setFetchParams] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});
  const [customDate, setCustomDate] = useState<[string, string]>(['', '']);
  const [deleteSale, setDeleteSale] = useState('');

  const {
    data: salesData,
    isLoading,
    refetch,
  } = useQuery<{
    data: {
      sales: WithId<Sale>[];
      skus: Record<string, SKU>;
    };
    total: number;
  }>({
    queryKey: ['sales', fetchParams],
    queryFn: async () => {
      if (fetchParams.endDate && fetchParams.startDate) {
        const res = await fetch(
          `/api/sales?${new URLSearchParams({ ...fetchParams }).toString()}`
        );
        if (!res.ok) {
          throw new Error(
            `HTTP error! Status: ${res.status} ${await res.text()}`
          );
        }

        return await res.json();
      } else {
        return { data: { sales: [], skus: {} }, total: 0 };
      }
    },
  });

  const { data, total } = salesData || {};
  const { skus, sales } = data || {};
  const totalProfit = sales?.reduce((acc, sale) => {
    return acc + Number(sale.profit);
  }, 0);
  const totalSales = sales?.reduce((acc, sale) => {
    return acc + Number(sale.priceTotal);
  }, 0);

  useEffect(() => {
    if (lastXMonths !== 'custom') {
      const endDate = new Date().toISOString();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - lastXMonths);
      setFetchParams({
        startDate: startDate.toISOString(),
        endDate,
      });
    } else {
      if (customDate[0] && customDate[1])
        setFetchParams({
          startDate: customDate[0],
          endDate: customDate[1],
        });
    }
  }, [lastXMonths, customDate]);

  return (
    <div className='w-full'>
      <DeleteSaleModal
        open={!!deleteSale}
        deletedId={deleteSale}
        onDeleted={() => {
          refetch();
          setDeleteSale('');
        }}
        onClose={() => {
          setDeleteSale('');
        }}
      />
      <span className='prose'>
        <h2 className='text-accent'>Dashboard penjualan</h2>
      </span>
      <div className='mt-6 flex w-full flex-col gap-4'>
        <div className='flex flex-col gap-4 md:flex-row'>
          <label className='form-control w-full max-w-xs'>
            <div className='label'>
              <span className='label-text font-semibold'>Range waktu</span>
            </div>
            <select
              className='select select-bordered'
              onChange={(e) => {
                setLastXMonths(e.target.value as number | 'custom');
              }}
            >
              {MONTHS_NUM_OPTIONS.map((month) => (
                <option
                  key={month}
                  value={month}
                  selected={lastXMonths === month}
                >
                  {month} bulan terakhir
                </option>
              ))}
              <option value='custom'>Custom</option>
            </select>
          </label>
          {lastXMonths === 'custom' && (
            <>
              <label className='form-control w-full max-w-xs'>
                <div className='label'>
                  <span className='label-text'>Start date</span>
                </div>
                <input
                  type='date'
                  className='input input-bordered'
                  value={customDate[0]}
                  onChange={(e) =>
                    setCustomDate((prev) => [e.target.value, prev[1]])
                  }
                />
              </label>
              <label className='form-control w-full max-w-xs'>
                <div className='label'>
                  <span className='label-text'>End date</span>
                </div>
                <input
                  type='date'
                  className='input input-bordered'
                  value={customDate[1]}
                  onChange={(e) =>
                    setCustomDate((prev) => [prev[0], e.target.value])
                  }
                />
              </label>
            </>
          )}
        </div>
        <div className='flex justify-between'>
          {fetchParams.startDate && fetchParams.endDate && (
            <div className='font-semibold'>
              Menampilkan hasil dari{' '}
              {new Date(fetchParams.startDate).toLocaleDateString()} hingga{' '}
              {new Date(fetchParams.endDate).toLocaleDateString()}
            </div>
          )}
        </div>
        {isLoading ? (
          <div className='text-center'>
            <span className='loading loading-dots loading-md'></span>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='table'>
              <thead>
                <tr>
                  <th></th>
                  <th>Tanggal</th>
                  <th>No. Nota</th>
                  <th>Nama barang</th>
                  <th>Kode barang</th>
                  <th>Jumlah barang terjual</th>
                  <th>Harga jual/item</th>
                  <th>Total sales</th>
                  <th>Profit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sales?.map((sale, index) => {
                  if (skus === undefined || !skus[sale.skuId]) return null;
                  const sku = skus[sale.skuId];
                  const profit = Number(sale.profit);
                  return (
                    <tr key={sale.id}>
                      <th>{index + 1}</th>
                      <td>{new Date(sale.createdAt).toLocaleString()}</td>

                      <td>
                        {sale.transactionNumber ||
                          `TXN-${new Date(sale.createdAt).getTime().toString().slice(-8)}`}
                        {/* Previous records doesn't have sales in it, so lets assume it's from the created at */}
                      </td>
                      <td>{sku.name}</td>
                      <td>{sku.code}</td>
                      <td>{numberFormat(sale.quantity)}</td>
                      <td>{priceFormat(sale.priceUnit)}</td>
                      <td>{priceFormat(sale.priceTotal)}</td>
                      <td
                        className={`${profit > 0 ? `text-green-700` : `text-red-700`}`}
                      >
                        {priceFormat(profit)}
                      </td>
                      <td>
                        <button
                          className='btn btn-square btn-outline btn-accent'
                          onClick={() => {
                            setDeleteSale(sale.id);
                          }}
                        >
                          <TrashIcon width={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {sales?.length === 0 && (
                  <tr>
                    <td colSpan={9} className='text-center'>
                      No data found
                    </td>
                  </tr>
                )}
                <tr>
                  {totalProfit !== undefined && totalSales !== undefined && (
                    <td colSpan={9} className='text-center'>
                      Total sales:{' '}
                      <span className='font-semibold text-green-700'>
                        {priceFormat(totalSales)}
                      </span>{' '}
                      | Total profit:{' '}
                      <span className='font-semibold text-green-700'>
                        {priceFormat(totalProfit)}
                      </span>
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {/* TODO: Pagination */}
        {/* <div className='join flex justify-center'>
          <button className='btn join-item'>1</button>
          <button className='btn join-item'>2</button>
          <button className='btn btn-disabled join-item'>...</button>
          <button className='btn join-item'>99</button>
          <button className='btn join-item'>100</button>
        </div> */}
      </div>
    </div>
  );
}
