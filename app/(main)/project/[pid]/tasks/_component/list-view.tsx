'use client';
import React, { useState } from 'react';
import { MdAttachFile } from 'react-icons/md';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn, getInitials } from '@/lib/utils';
import moment from 'moment';
import { BiMessageAltDetail } from 'react-icons/bi';
import { FaList } from 'react-icons/fa';
import { MessageSquarePlusIcon, PaperclipIcon, Trash2Icon } from 'lucide-react';
// import Link from 'next/link';
import { ICONS, TASK_TYPE } from '@/lib/constants';
import { v4 as uuid4 } from 'uuid';
// import { useAuth } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Hint from '@/app/(main)/_component/hint';
// import EditTask from './edit-task';
import { differenceInCalendarDays } from "date-fns";

type Props = {
    tasks: any,
    setProject: (tasks: any) => void
}

const PRIOTITYSTYLES: any = {
    high: "text-red-700",
    medium: "text-yellow-700",
    low: "text-blue-700",
};

const PRIOTITYBG: any = {
    high: "bg-rose-300",
    medium: "bg-yellow-300",
    low: "bg-blue-300",
};

const dueDateColFormat = (dueDate: Date) => {
    const diff = differenceInCalendarDays(
        dueDate,
        new Date()
    );
    // console.log(diff);
    let bgColor;
    if(diff < 0) {
        bgColor = 'bg-red-500';
    }else if(diff >= 0 && diff <= 3){
        bgColor = 'bg-amber-500';
    }else if(diff > 3){
        bgColor = 'bg-emerald-500';
    }
    return (
        <span className='flex gap-1 items-center justify-start'>
            <div className='flex flex-col gap-y-1 w-full text-center'>
                {moment(dueDate).format('DD-MMM-YY')}
                <p className={cn(
                    "text-xs rounded-md p-1 text-white",
                    bgColor
                )}>{moment(dueDate).fromNow()}</p>
            </div>
        </span>
    )
}

const ListView = ({ tasks, setProject }: Props) => {
    const uuid = uuid4();
    // console.log(tasks);
    // const router = useRouter();
    // const { userId } = useAuth();
    // const [selectedTask, setSelectedTask] = useState<any>();
    // const [openEditTask, setOpenEditTask] = useState<boolean>(false);
    // const [openAssignUser, setOpenAssignUser] = useState<boolean>(false);
    
    const params = useParams();

    return (
        <Table className='min-w-[800px] overflow-x-auto my-5 shadow-md rounded-md'>
            <TableHeader>
                <TableRow className='bg-teal-100'>
                    <TableHead className="w-[250px]">Task</TableHead>
                    <TableHead className="text-left w-[100px]">Priority</TableHead>
                    <TableHead className="text-left w-[200px]">Description</TableHead>
                    <TableHead className="text-left">Assets</TableHead>
                    <TableHead className="text-left">Owner</TableHead>
                    <TableHead className="text-left">Due</TableHead>
                    {/* <TableHead className="text-left w-[150px]">Created at</TableHead> */}
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tasks?.map((task: any, idx: number) => (
                    <>
                        <TableRow key={idx + task?.id} className='text-gray-600'>
                            <TableCell>
                                <div className='flex items-center gap-2'>
                                    <p className={cn(
                                        'w-full line-clamp-1 capitalize text-base text-stone-200 p-1 rounded-md',
                                        TASK_TYPE[task.stage]
                                    )}>
                                        {task.title}
                                    </p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-1 items-center">
                                    <span className={cn(
                                        'text-2xl', PRIOTITYSTYLES[task?.priority]
                                    )}>
                                        {ICONS[task?.priority]}
                                    </span>
                                    <span className={cn(
                                        'capitalize line-clamp-1 p-1 rounded-md text-slate-800 w-full text-center',
                                        PRIOTITYBG[task?.priority]
                                    )}>
                                        {task?.priority}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="text-pretty text-left font-light text-sm text-slate-400">
                                    {task?.description}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className='flex items-center gap-3'>
                                    <div className='flex gap-1 items-center text-sm text-gray-600'>
                                        <BiMessageAltDetail />
                                        <span>
                                            {task?.activities?.length}
                                        </span>
                                    </div>
                                    <div className='flex gap-1 items-center text-sm text-gray-600'>
                                        <MdAttachFile />
                                        <span>
                                            {task?.assets?.length}
                                        </span>
                                    </div>
                                    <div className='flex gap-1 items-center text-sm text-gray-600'
                                        >
                                        <FaList />
                                        <span>
                                            {task?.activities?.length}
                                        </span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-left">
                                <Avatar key={task?.assignee?.id}>
                                    <AvatarImage
                                        src={`https://api.dicebear.com/9.x/bottts/svg?seed=${task?.assignee?.name}&backgroundColor=b6e3f4,c0aede&backgroundType=solid`} />
                                    <AvatarFallback><span className='text-center'>{getInitials(task?.assignee?.name)}</span></AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell className="text-left">
                                {dueDateColFormat(task?.date)}
                            </TableCell>
                            {/* <TableCell className="text-left">
                                {moment(task?.createdAt).format('DD-MMM-YY HH:mm')}
                            </TableCell> */}
                            <TableCell>
                                <div className='flex items-center justify-end gap-2'>
                                    <Hint label='Add activity' key={2 + uuid}>
                                        <MessageSquarePlusIcon className='h-4 w-4 mr-2 hover:cursor-pointer'
                                            color='#2227bf'
                                            onClick={() => {}} />
                                    </Hint>
                                    <Hint label='Add attachment' key={61 + uuid}>
                                        <PaperclipIcon className='h-4 w-4 mr-2 hover:cursor-pointer'
                                            color='#903091'
                                            onClick={() => { }} />
                                    </Hint>
                                    <Hint label='Remove task' key={uuid + 3}>
                                        <Trash2Icon className='h-4 w-4 mr-2 hover:cursor-pointer'
                                            color='#bf2222' />
                                    </Hint>
                                </div>
                            </TableCell>
                        </TableRow>                        
                    </>
                ))}
            </TableBody>
        </Table>
    )
}

export default ListView;