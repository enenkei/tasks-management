'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
// import { useAuth } from '@clerk/nextjs';
import { LayoutDashboardIcon, NotebookPenIcon, RecycleIcon, Settings2Icon, User2Icon } from 'lucide-react';
import { TbSubtask } from "react-icons/tb";
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React from 'react';

const LINKS = [
    {
        label: 'Dashboard',
        link: '/dashboard',
        icon: <LayoutDashboardIcon color='#c11a1a' />
    },
    {
        label: 'Tasks',
        link: '/tasks',
        icon: <NotebookPenIcon color='#e4964e' />
    },
    {
        label: 'Team',
        link: '/team',
        icon: <User2Icon color='#713ed0' />
    },
    {
        label: 'Recyle',
        link: '/trash',
        icon: <RecycleIcon color='#359a19' />
    }
]

const NavLink = ({ element, path }: any) => {
    const split = path.split("/");
    const endpoint = "/" + split.pop();
    
    const params = useParams();
    const prefix = `/project/${params?.pid}`
    // console.log(params);
    // console.log(path);
    // console.log(endpoint);
    // console.log(prefix);
    return (
        <Link href={prefix + element.link} onClick={() => { }}
            className={cn(
                'w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-md items-center text-gray-800 text-base hover:bg-[#2564ed2d]',
                endpoint === element.link && 'bg-blue-400 text-white'
            )}>
            {element.icon}
            <span className='hover:text-[#2564ed]'>{element.label}</span>
        </Link>
    )
}

const Sidebar = () => {
    const pathname = usePathname();
    // const { userId } = useAuth();
    const router = useRouter();
    return (
        <aside className='w-full h-full flex flex-col gap-6 p-5 border-r'>
            <h1 className='flex gap-1 items-center'>
                <p className='bg-fuchsia-300 p-2 rounded-full'>
                    <TbSubtask className='h-6 w-6 fill-sky-400' />
                </p>
                <span className='text-2xl font-bold text-black hover:cursor-pointer'
                    onClick={() => router.push('/project')}>
                    TaskUs!
                </span>
            </h1>            
            <div className='flex-1 flex flex-col gap-y-5 py-8'>
                {LINKS.map((link, idx) => {
                    return <NavLink element={link} path={pathname} key={idx} />
                })}
            </div>
            <div className=''>
                <Button className='w-full flex gap-2 p-2 items-center text-lg text-gray-800' variant={'secondary'}>
                    <Settings2Icon className='w-4 h-4' />
                    <span>Settings</span>
                </Button>
            </div>
        </aside>
    )
}

export default Sidebar;
