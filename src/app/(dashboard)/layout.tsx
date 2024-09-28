import { Menu } from '@/components/Menu'
import Navbar from '@/components/Navbar'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='h-screen flex'>
            {/* Menu */}
            <div className='w-[14%] lg:w-[16%]  md:w-[8%] xl:w-[14%] p-4'>
                <Link href={'/'} className='flex items-center justify-center lg:justify-start gap-2 '>
                    <Image
                        src='/logo.png'
                        alt='logo image'
                        width={32}
                        height={32}
                    />
                    <span className='hidden lg:block font-bold'>School</span>
                </Link>
                <Menu />
            </div>
            {/* Content */}
            <div className='w-[86%] flex flex-col lg:w-[84%] md:w-[92%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll' >
                <Navbar />
                {children}
            </div>
        </div>
    )
}

export default DashboardLayout