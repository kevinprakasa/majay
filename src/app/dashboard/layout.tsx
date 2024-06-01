export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='drawer md:drawer-open'>
      <input id='my-drawer-2' type='checkbox' className='drawer-toggle' />
      <div className='drawer-content flex w-full flex-col items-start justify-start p-4'>
        {children}
        <label
          htmlFor='my-drawer-2'
          className='btn btn-primary drawer-button md:hidden'
        >
          Open drawer
        </label>
      </div>
      <div className='drawer-side'>
        <label
          htmlFor='my-drawer-2'
          aria-label='close sidebar'
          className='drawer-overlay'
        ></label>
        <ul className='menu min-h-full w-80 bg-base-200 p-4 text-base-content'>
          {/* Sidebar content here */}
          <li>
            <a>List barang</a>
          </li>
          <li>
            <a>Barang keluar</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
