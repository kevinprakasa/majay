'use client';

import { numberFormat, priceFormat } from '@/app/helper';
import { BackwardIcon, ForwardIcon } from '@heroicons/react/16/solid';
import { useQuery } from '@tanstack/react-query';
import { SKU, WithId } from 'models';
import { useState } from 'react';

export default function SKUTable() {
  const [fetchParams, setFetchParams] = useState<
    Partial<{
      id: string;
      code: string;
      name: string;
      page: string;
      limit: string;
    }>
  >({ limit: '10' });
  const { page, limit } = fetchParams;
  const numPage = Number(page || 1);
  const numLimit = Number(limit || 10);

  const { data, isLoading } = useQuery({
    queryKey: ['sku', fetchParams],
    queryFn: async () => {
      const res = await fetch(
        `/dashboard/sku/api?${new URLSearchParams(fetchParams).toString()}`,
        {
          method: 'GET',
        }
      );
      if (!res.ok) {
        throw new Error(
          `HTTP error! Status: ${res.status} ${await res.text()} `
        );
      }
      const data = (await res.json()) as { data: WithId<SKU>[]; total: number };
      return data.data;
    },
  });

  console.log('🚀 ~ SKUTable ~ data:', data);
  return (
    <>
      <div className='overflow-x-auto '>
        <table className='table'>
          <thead>
            <tr>
              <th></th>
              <th>Nama</th>
              <th>Kode</th>
              <th>Stok</th>
              <th>Harga modal</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((sku, index) => (
                <tr key={sku.id}>
                  <td>{(numPage - 1) * numLimit + index + 1}</td>
                  <td>{sku.name}</td>
                  <td>{sku.code}</td>
                  <td>{numberFormat(sku.stock)}</td>
                  <td>{priceFormat(sku.capitalPrice)}</td>
                  <td>
                    <button className='btn btn-link'>View QR</button>
                  </td>
                </tr>
              ))}
            {isLoading && (
              <tr>
                <td colSpan={6}>
                  <div className='flex justify-center'>
                    <span className='loading loading-dots loading-md'></span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className='join flex justify-center'>
        <button
          className='btn btn-outline join-item'
          disabled={numPage === 1}
          onClick={() => {
            setFetchParams((prev) => ({
              ...prev,
              page: (Number(fetchParams.page || 1) - 1).toString(),
            }));
          }}
        >
          <BackwardIcon width={16} />
        </button>
        <button
          className='btn btn-outline join-item'
          disabled={data?.length !== numLimit}
          onClick={() => {
            setFetchParams((prev) => ({
              ...prev,
              page: (Number(fetchParams.page || 1) + 1).toString(),
            }));
          }}
        >
          <ForwardIcon width={16} />
        </button>
      </div>
    </>
  );
}
