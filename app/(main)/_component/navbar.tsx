'use client'
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
import { UserButton } from '@clerk/nextjs';
import { BellRingIcon } from 'lucide-react';
import React from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import ProjectSelection from './project-selection';

const Navbar = () => {
    
    // console.log(params);
    return (
        <nav className='flex justify-between items-center bg-white px-4 py-3 2xl:py-3 sticky z-10 top-0'>
            {/* <div className='w-64 xl:w-[400px] flex items-center py-2 px-3 gap-2 rounded-md bg-[#f3f4f6]'>
                <SearchIcon className='text-gray-500 text-xl' />
                <Input type='text'
                    placeholder='search...'
                    className='flex-1 outline-none bg-transparent placeholder:text-gray-500 text-gray-800' />
            </div> */}
            <div className='w-64 xl:w-[400px] flex items-center py-2 px-3 gap-2'>
                <ProjectSelection />
            </div>
            <div className='flex gap-6 items-center'>
                <Popover>
                    <PopoverTrigger>
                        <BellRingIcon />
                    </PopoverTrigger>
                    <PopoverContent>Place content for the popover here.</PopoverContent>
                </Popover>

                <UserButton />
            </div>
        </nav>
    )
}

export default Navbar;
