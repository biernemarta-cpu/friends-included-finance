import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Friends Included Finance', description: 'Wedding Guests for Hire finance system' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body style={{margin:0,background:'#07111f',color:'#eef5ff',fontFamily:'Arial, sans-serif'}}>{children}</body></html>;
}
