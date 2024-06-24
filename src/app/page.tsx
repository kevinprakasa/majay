import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <h1>
      <Link href={'/dashboard'}>Go to dashboard</Link>
    </h1>
  );
}
