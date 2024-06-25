'use client';

import { numberFormat, priceFormat } from '@/app/helper';
import {
  BackwardIcon,
  ForwardIcon,
  PencilSquareIcon,
  QrCodeIcon,
  TrashIcon,
} from '@heroicons/react/16/solid';
import { useQuery } from '@tanstack/react-query';
import { SKU, WithId } from 'models';
import { useEffect, useRef, useState } from 'react';
import DeleteModal from './DeleteModal';
import { SKUViewModal } from '../SKUViewModal';
import Link from 'next/link';

export default function SKUTable({
  code,
  setCode,
}: {
  code: string;
  setCode: (code: string) => void;
}) {
  const [filterState, setFilterState] = useState({
    name: '',
    code: '',
  });
  const [fetchParams, setFetchParams] = useState<
    Partial<{
      id: string;
      code: string;
      name: string;
      page: string;
      limit: string;
    }>
  >({ limit: '20' });
  const { page, limit } = fetchParams;
  const numPage = Number(page || 1);
  const numLimit = Number(limit || 10);
  const [deleteSku, setDeleteSku] = useState('');
  const [openedSku, setOpenedSku] = useState<SKU | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['sku', fetchParams],
    queryFn: async () => {
      const res = await fetch(
        `/api/sku?${new URLSearchParams(fetchParams).toString()}`,
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

  const onFilter = () => {
    setFetchParams((prev) => ({
      ...prev,
      ...filterState,
    }));
  };

  useEffect(() => {
    setFilterState((prev) => ({ ...prev, code }));
    setFetchParams((prev) => ({ ...prev, code }));
  }, [code]);

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
          title='Detail barang'
          open={!!openedSku}
          sku={openedSku}
          onClose={() => setOpenedSku(null)}
        />
      )}
      <div className='divider'></div>
      {/* {code && (
        <div className='flex items-center justify-between'>
          <div className='text-accent'>Scanned product code: {code}</div>
          <div className='text-accent'>
            <button
              className='btn btn-link btn-active'
              onClick={() => setCode('')}
            >
              Clear code
            </button>
          </div>
        </div>
      )} */}
      <div className='flex items-end gap-4'>
        <label className='form-control w-full max-w-xs'>
          <div className='label'>
            <span className='label-text font-semibold'>Cari dengan nama:</span>
          </div>
          <input
            type='text'
            placeholder='Type here'
            className='input input-bordered w-full max-w-xs'
            value={filterState.name}
            onChange={(e) => {
              setFilterState((prev) => ({
                ...prev,
                name: e.target.value,
              }));
            }}
          />
        </label>
        <label className='form-control w-full max-w-xs'>
          <div className='label'>
            <span className='label-text font-semibold'>Cari dengan kode:</span>
          </div>
          <input
            type='text'
            placeholder='Type here'
            value={filterState.code}
            className='input input-bordered w-full max-w-xs'
            onChange={(e) => {
              setFilterState((prev) => ({
                ...prev,
                code: e.target.value,
              }));
            }}
          />
        </label>
        <button className='btn btn-primary' onClick={onFilter}>
          Filter
        </button>
        {(fetchParams.name || fetchParams.code) && (
          <button
            className='btn btn-link'
            onClick={() => {
              setFilterState({
                name: '',
                code: '',
              });
              setFetchParams({
                limit: '20',
              });
            }}
          >
            Clear filter
          </button>
        )}
      </div>
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
