import { User } from '@prisma/client';
import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";  
import { cn, getInitials } from '@/lib/utils';
import UserAvatar from './user-avatar';
import { v4 as uuid4 } from 'uuid';

type Props = {
    user: User,
    idx : number,
}

const BGS : string[] = [
    'bg-purple-600',
    'bg-sky-600',
    'bg-fuchsia-600',
    "bg-blue-600",
    "bg-yellow-600",
    "bg-green-600",
    "bg-violet-600",
    'bg-slate-600',
    'bg-stone-600',
    'bg-orange-600',
    'bg-rose-600',
    'bg-pink-600'
];

const UserTooltip = ({ user, idx }: Props) => {
    const uuid = uuid4();
    return (
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger className='mt-1 rounded-full flex justify-center items-center group'>
                    <div key={uuid} className={cn(
                        "w-9 h-9 rounded-full text-white flex items-center justify-center text-sm -mr-2 hover:pointer-events-none",
                        BGS[idx % BGS?.length]
                    )}>
                        <span className='flex items-center place-content-center'>
                            {getInitials(user?.name)}
                        </span>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <div className='flex flex-col gap-y-1 p-3 w-[300px]'>
                        <p className='text-black text-lg font-semibold flex items-center justify-center gap-2'>
                            {user?.name}
                            {user?.avatar! ? (
                                <>
                                    <UserAvatar imgSrc={user?.avatar!} fallbackText={getInitials(user?.name)} />
                                </>
                            ) : (
                                <>
                                    <UserAvatar imgSrc={`https://api.dicebear.com/9.x/bottts/svg?seed=${user?.name!}&backgroundColor=b6e3f4,c0aede&backgroundType=solid`}
                                        fallbackText={getInitials(user?.name)} />
                                </>
                            )}
                        </p>
                        <span className='text-xs text-muted-foreground'>{user?.title}</span>
                        <span className='text-blue-500 text-xs'>{user?.email}</span>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default UserTooltip;
