'use client';
import { ArrowBigLeftDash, Edit2Icon, PencilLineIcon, SquareActivity } from 'lucide-react';
import React, { ElementRef, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { FaTasks } from 'react-icons/fa';
import { MdPinDrop } from 'react-icons/md';
import { tasks } from '@/app/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, getInitials } from '@/lib/utils';
import moment from 'moment';
import Activities from '../../_component/activities';
import { ICONS, TASK_TYPE } from '@/lib/constants';
import { updateRecord } from '@/app/actions/crud';
import { Activity, User } from '@prisma/client';
import { Button } from '@/components/ui/button';
import Hint from '@/app/(main)/_component/hint';
import { Input } from '@/components/ui/input';
import { useOnClickOutside } from 'usehooks-ts';
import { toast } from '@/components/ui/use-toast';
import { getTaskbyTaskId, getUnassignedUsersOnTask } from '@/app/actions/task';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import EditTask from '../../_component/edit-task';
import { useRouter } from 'next/navigation';

const assets = [
    "https://images.pexels.com/photos/2418664/pexels-photo-2418664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/8797307/pexels-photo-8797307.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/2534523/pexels-photo-2534523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/804049/pexels-photo-804049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
];

const PRIOTITYSTYLES: any = {
    high: "text-red-600",
    medium: "text-yellow-600",
    low: "text-blue-600",
};

const bgColor: any = {
    high: "bg-red-200",
    medium: "bg-yellow-200",
    low: "bg-blue-200",
};

const activity_types = [
    "Started",
    "Completed",
    "In Progress",
    "Commented",
    "Bug",
    "Assigned",
];

type Props = {
    params: {
        tid: string
    }
}
const TaskDetailPage = ({ params }: Props) => {
    const tmpTask = tasks[3];
    const taskId = params?.tid;
    const [task, setTask] = useState<any>();
    // console.log(params.tid);
    const [isEditTitle, setIsEditTitle] = useState<boolean>(false);
    const titleRef = useRef<ElementRef<"input">>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [unassignedUsers, setUnassignedUsers] = useState<any>();
    const router = useRouter();

    useEffect(() => {
        getTask();
        getAvailableUsers();
    }, [setTask]);

    const getTask = async () => {
        const t: any & { assignee: User & { activities: Activity[] & { owner: User } } } = await getTaskbyTaskId(taskId);
        setTask(t);
    }

    const getAvailableUsers = async () => {
        const users = await getUnassignedUsersOnTask(params?.tid);
        setUnassignedUsers(users);
    }
    // console.log(task);
    const onKeydown = async (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            // console.log(titleRef.current?.value);
            const task = await updateRecord('Task', params.tid, { title: titleRef.current?.value });
            if (task) {
                toast({
                    title: 'Success!',
                    description: 'Task title updated!'
                });
                getTask();
            }
            setIsEditTitle(false);
        } else if (e.key === 'Escape') {
            setIsEditTitle(false);
        }
    }
    const handleClickOutside = () => {
        // Your custom logic here
        // console.log('clicked outside');
        setIsEditTitle(false);
    }
    useOnClickOutside(titleRef, handleClickOutside);
    return (
        <div className='flex flex-col w-full gap-3 mb-4 overflow-y-hidden'>
            <div className='mb-5 flex items-center justify-start'>
                <Button variant={'ghost'} onClick={() => router.push(`/project/${task?.projectId}/tasks`)}>
                    Back<ArrowBigLeftDash className='h-5 w-5 ml-2' />
                </Button>
            </div>
            {!isEditTitle && (
                <Hint label='Click to edit title'>
                    <Button className='p-3 mb-9 bg-violet-100' variant={'ghost'} onClick={() => setIsEditTitle(true)}>
                        <h1 className='text-2xl text-gray-600 font-semibold underline underline-offset-2 flex items-center justify-center'>
                            {task?.title}
                        </h1>
                    </Button>
                </Hint>
            )}
            {isEditTitle && (
                <div className='flex items-center justify-center gap-2'>
                    <Input type='text' defaultValue={task?.title} autoFocus
                        ref={titleRef} onKeyDown={onKeydown}
                        className='border-none w-[300px]' />
                    <Edit2Icon className='h-6 w-6 border bg-slate-400 p-1 rounded-md' />
                </div>
            )}
            <Tabs defaultValue="taskDetails" className="w-full">
                <TabsList>
                    <TabsTrigger value="taskDetails">Task Detail<FaTasks className='h-4 w-4 ml-2' /></TabsTrigger>
                    <TabsTrigger value="timeline">Activities/Timeline<SquareActivity className='h-4 w-4 ml-2' /></TabsTrigger>
                </TabsList>
                <TabsContent value="taskDetails">
                    <div className='w-full flex flex-col md:flex-row gap-5 2xl:gap-8 shadow-sm p-8 overflow-y-auto'>
                        <div className='w-full md:w-1/2 space-y-8'>
                            <div className="flex items-center gap-5">
                                <div className={cn(
                                    "flex gap-1 items-center text-base font-semibold px-3 py-1 rounded-md",
                                    PRIOTITYSTYLES[task?.priority!],
                                    bgColor[task?.priority!]
                                )}>
                                    <span className='text-lg'>{ICONS[task?.priority!]}</span>
                                    <span className='uppercase'>{task?.priority}&nbsp;Priority</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "w-4 h-4 rounded-full",
                                        TASK_TYPE[task?.stage!]
                                    )} />
                                    <span className='text-black uppercase'>{task?.stage}</span>
                                </div>
                                {task?.stage !== 'completed' && <div>
                                    <PencilLineIcon onClick={() => setOpen(true)}
                                        className='h-5 w-5 hover:cursor-pointer' color='#2477b7' />
                                </div>}
                            </div>
                            <p className='text-muted-foreground text-sm'>
                                Created&nbsp;at:&nbsp;{moment(task?.createdAt).format('MM/DD/YYYY HH:mm')}
                            </p>
                            {/* <div className='flex items-center gap-8 p-4 border-y border-gray-200'>
                                <div className='space-x-2'>
                                    <span className='font-semibold'>Attachments:</span>
                                    <span>{tmpTask?.assets.length}</span>
                                </div>
                                <span className='text-gray-400'>|</span>
                                <div className='space-x-2'>
                                    <span className='font-semibold'>Sub-tasks:</span>
                                    <span>{tmpTask?.subTasks?.length}</span>
                                </div>
                            </div> */}
                            <div className='space-y-4 py-6'>
                                <p className='text-gray-600 font-semibold text-sm'>Assignee</p>
                                <div className='space-y-3'>
                                    <div className='flex gap-4 py-2 items-center border-t border-gray-200'>
                                        <div className='w-10 h-10 rounded-full text-white flex items-center justify-center text-sm -mr-1 bg-blue-600'>
                                            <Avatar key={task?.id}>
                                                <AvatarImage src={`https://api.dicebear.com/9.x/bottts/svg?seed=${task?.assignee?.name}&backgroundColor=b6e3f4,c0aede&backgroundType=solid`} />
                                                <AvatarFallback><span className='text-center'>{task?.assignee?.name && getInitials(task?.assignee?.name)}</span></AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div>
                                            <p className='text-sm font-semibold'>{task?.assignee?.name}</p>
                                            <span className='text-xs text-muted-foreground'>{task?.assignee?.title}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='space-y-4 py-6'>
                                <p className='text-gray-500 font-semibold text-sm'>
                                    Due date
                                </p>
                                <div className='space-y-8'>
                                    <div className='flex gap-3 border-t py-2'>
                                        <div className='w-10 h-10 flex items-center justify-center rounded-full bg-violet-50'>
                                            <MdPinDrop className='text-violet-600' size={26} />
                                        </div>
                                        <div className='space-y-1'>
                                            <div className='flex gap-2 items-center'>
                                                <span className='text-sm text-gray-500'>
                                                    {moment(task?.date).format('MM/DD/YYYY HH:mm')}
                                                </span>
                                            </div>
                                            <p className='text-xs bg-gray-200 p-1 rounded-md text-center text-gray-700 capitalize'>{moment(task?.date).fromNow()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='w-full md:w-1/2 space-y-8'>
                            <p className='text-lg font-semibold'>Attachments</p>
                            <div className='w-full grid grid-cols-2 gap-4'>
                                {tmpTask?.assets?.map((asset, idx) => (
                                    <img key={idx} src={asset} alt={`asset-${idx}`}
                                        className='w-full rounded-2xl shadow-md h-28 md:h-36 2xl:h-52 object-contain cursor-pointer transition-all duration-700 hover:scale-125 hover:z-50' />
                                ))}
                            </div>
                        </div>
                        <EditTask onOpenChange={setOpen} open={open} setTask={setTask} task={task} users={unassignedUsers} />
                    </div>
                </TabsContent>
                <TabsContent value="timeline">
                    <Activities activities={task?.activities} setTask={setTask} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default TaskDetailPage;
