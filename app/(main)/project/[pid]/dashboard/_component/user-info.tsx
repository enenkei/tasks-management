import React from 'react';
import { getInitials } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type Props = {
    user: any
}

const UserInfo = ({ user }: Props) => {
    return (
        <div className='px-4'>
            <div className='group inline-flex items-center outline-none'>
                <span>{getInitials(user?.name)}</span>
            </div>
            <div className='absolute left-1/2 z-10 mt-3 w-96 translate-x-1/2 transform px-4 sm:px-0'>
                <div className='flex items-center gap-4 rounded-lg shadow-sm bg-white p-4'>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className='w-16 h-16 bg-blue-600 rounded-full text-white items-center justify-center text-2xl'>
                                    <span className='flex items-center place-content-center mt-4'>
                                        {getInitials(user?.name)}
                                    </span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className='flex flex-col gap-y-1'>
                                    <p className='text-black text-xl font-bold'>
                                        {user?.name}
                                    </p>
                                    <span className='text-base text-muted-foreground'>{user?.title}</span>
                                    <span className='text-blue-500'>{user?.email}</span>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </div>
    )
}

export default UserInfo;
