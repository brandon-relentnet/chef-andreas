import localFont from 'next/font/local';
import { Noto_Serif_Georgian } from 'next/font/google'; // Use the correct name with underscores
import "./globals.css";
import Link from "next/link";

// Load Stuyvesant font (local)
const Stuyvesant = localFont({ src: '../fonts/Stuyvesant.otf' });

// Load Noto Serif Georgian font (Google)
const notoSerifGeorgian = Noto_Serif_Georgian({
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', '900'],
  display: 'swap', // Ensures faster rendering with fallback
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Apply the Stuyvesant class to the body and use Noto Serif Georgian as needed */}
      <body className={`${Stuyvesant.className} ${notoSerifGeorgian.className}`}>
        <div className='absolute z-50'>
          <Link href="/admin" className='mr-2'>ADMIN</Link>
          <Link href="/menu" className='mr-2'>MENU</Link>
          <Link href="/order" className='mr-2'>ORDER</Link>
          <Link href="/" className='mr-2'>HOME</Link>
        </div>
        {children}
      </body>
    </html>
  );
}
