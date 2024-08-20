import React from 'react';
import Sidebar from './_component/sidebar';
import Navbar from './_component/navbar';

type Props = {
    children: React.ReactNode
}

const MainLayout = ({ children }: Props) => {
    return (
        <div className='w-full h-screen flex flex-col md:flex-row'>
            <div className='w-[240px] h-screen bg-white sticky top-0 hidden md:block'>
                <Sidebar />
            </div>
            <div className='flex-1 overflow-y-auto'>
                <Navbar />
                <div className='p-4 2xl:px-10'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default MainLayout;
