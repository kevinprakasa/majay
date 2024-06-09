'use client';

import { numberFormat, priceFormat } from '@/app/helper';
import {
  BackwardIcon,
  ForwardIcon,
  PencilSquareIcon,
  QrCodeIcon,
  TrashIcon,
} from '@heroicons/react/16/solid';
import { useMutation, useQuery } from '@tanstack/react-query';
import { SKU, WithId } from 'models';
import { useEffect, useRef, useState } from 'react';
import DeleteModal from './DeleteModal';
import { SKUViewModal } from '../SKUViewModal';
import Link from 'next/link';

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
  const [deleteSku, setDeleteSku] = useState('');
  const [openedSku, setOpenedSku] = useState<SKU | null>(null);
  const [editSku, setEditSku] = useState<SKU | null>(null);
  console.log('🚀 ~ SKUTable ~ openedSku:', openedSku);

  const { data, isLoading, refetch } = useQuery({
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
    refetchOnMount: 'always',
  });

  useEffect(() => {
    console.log('USE EFFECT HERE');
  }, []);

  console.log('🚀 ~ SKUTable ~ data:', data);
  return (
    <>
      <DeleteModal
        open={!!deleteSku}
        deletedSkuId={deleteSku}
        onDeleted={() => {
          refetch();
          setDeleteSku('');
        }}
        onClose={() => {
          setDeleteSku('');
        }}
      />
      {openedSku && (
        <SKUViewModal
          title='Detail SKU'
          open={!!openedSku}
          sku={openedSku}
          onClose={() => setOpenedSku(null)}
        />
      )}
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
                    <div className='flex gap-4'>
                      <button
                        className='btn btn-square btn-outline btn-accent'
                        onClick={() => {
                          setOpenedSku(sku);
                        }}
                      >
                        <QrCodeIcon width={16} />
                      </button>
                      <Link href={`/dashboard/sku/edit/${sku.id}`}>
                        <button
                          className='btn btn-square btn-outline btn-accent'
                          onClick={() => {}}
                        >
                          <PencilSquareIcon width={16} />
                        </button>
                      </Link>
                      <button
                        className='btn btn-square btn-outline btn-accent'
                        onClick={() => {
                          setDeleteSku(sku.id);
                        }}
                      >
                        <TrashIcon width={16} />
                      </button>
                    </div>
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

      <div className='join flex  justify-center'>
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
