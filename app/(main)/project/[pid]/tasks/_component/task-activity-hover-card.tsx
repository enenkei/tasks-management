'use client';
import { Activity } from '@prisma/client';
import React from 'react';
import ActivityCard from './activity-card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ArrowBigRightDashIcon, MonitorCheckIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { DialogDescription } from '@radix-ui/react-dialog';


type Props = {
    activities: Activity[],
    open: boolean,
    onOpenChange: (open: boolean) => void,
    taskName?: string,
    taskId : string
}

const TaskActivityHoverCard = ({ activities, open, onOpenChange, taskName, taskId }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    // console.log(path);
    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <div className='flex items-center justify-between gap-2'>
                                <span className='flex items-center justify-start gap- 2'>
                                    Activity records&nbsp;<MonitorCheckIcon className='h-5 w-5' color='#903091' />
                                </span>
                                {/* <span className='flex items-center justify-end gap-2 mr-6'>
                                    Details
                                    <ArrowBigRightDashIcon 
                                        onClick={() => router.push(`${pathname}/detail/${taskId}`)}
                                        className='h-5 w-5 hover:cursor-pointer' color='#303491' />
                                </span> */}
                            </div>                            
                        </DialogTitle>
                        <DialogDescription>
                            <span className='text-xs text-pretty text-muted-foreground'>List of all activities on {taskName}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className='w-full flex gap-10 px-6 py-8 bg-white shadow rounded-md justify-between overflow-y-auto'>
                        <div className='w-full'>
                            <h4 className='text-gray-400 font-semibold text-lg mb-5 underline capitalize'>
                                {taskName}
                            </h4>
                            <div className='w-full'>
                                {activities?.map((activity: any, idx: number) => (
                                    <ActivityCard key={idx} item={activity} isConnected={idx < activities?.length - 1} />
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </>
    )
}

export default TaskActivityHoverCard;
