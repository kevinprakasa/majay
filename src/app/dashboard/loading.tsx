export default function Loading() {
  return (
    <div className='flex w-full flex-col gap-6'>
      <div className='skeleton h-8 w-1/3'></div>
      <div className='skeleton h-6 w-full'></div>
      <div className='skeleton h-[500px] w-full'></div>
    </div>
  );
}
