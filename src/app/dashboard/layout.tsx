'use client';

import Link from 'next/link';
import {
  Bars3Icon,
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  ListBulletIcon,
} from '@heroicons/react/16/solid';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className='drawer md:drawer-open'>
      <input id='my-drawer-2' type='checkbox' className='drawer-toggle' />
      <div className='drawer-content flex w-full flex-col items-center justify-start p-4 pt-20'>
        {children}
        <label
          htmlFor='my-drawer-2'
          className='btn btn-square drawer-button fixed left-4 top-4 md:hidden'
        >
          <Bars3Icon className='size-4' />
        </label>
      </div>
      <div className='drawer-side'>
        <label
          htmlFor='my-drawer-2'
          aria-label='close sidebar'
          className='drawer-overlay'
        ></label>
        <ul className='menu menu-lg min-h-full w-80 bg-base-200 p-4 text-base-content'>
          {/* Sidebar content here */}
          <li>
            <Link
              href='/dashboard/sku'
              className={`${pathname.startsWith('/dashboard/sku') && 'active'}`}
            >
              <ListBulletIcon width={16} />
              List barang
            </Link>
          </li>
          <li>
            <a
              href='/dashboard/record-sales'
              className={`${pathname.startsWith('/dashboard/record-sales') && 'active'}`}
            >
              <CurrencyDollarIcon width={16} />
              Input penjualan
            </a>
          </li>
          <li>
            <a
              href='/dashboard/sales'
              className={`${pathname.startsWith('/dashboard/sales') && 'active'}`}
            >
              <BuildingStorefrontIcon width={16} />
              Dashboard penjualan
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
