'use client';
import React, { ElementRef, useEffect, useRef, useState } from 'react';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { MdAttachFile } from 'react-icons/md';
import { cn, getInitials } from '@/lib/utils';
import moment from 'moment';
import { BiMessageAltDetail } from 'react-icons/bi';
import { FaList } from 'react-icons/fa';
import { TASK_TYPE } from '@/lib/constants';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { v4 as uuid4 } from 'uuid';
import { ArrowBigRightDashIcon, HourglassIcon, LogOutIcon } from 'lucide-react';
import Hint from '@/app/(main)/_component/hint';
import TaskActivityHoverCard from './task-activity-hover-card';
import { Button } from '@/components/ui/button';
import TextInputEdit from './text-input-edit';
import SelectInputEdit from './select-input-edit';
import { PRIORITIES } from './add-task';
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowUp } from 'react-icons/md';
import TaskNextStageDialog from './task-next-stage-dialog';
import { useAuth } from '@clerk/nextjs';
import { getUnassignedUsersOnTask } from '@/app/actions/task';

type Props = {
    task: any,
    setProject: (proj: any) => void
}

const BGS: string[] = [
    'bg-purple-400',
    'bg-sky-400',
    'bg-fuchsia-400',
    "bg-blue-400",
    "bg-yellow-400",
    "bg-green-400",
    "bg-violet-400",
    'bg-slate-400',
    'bg-stone-400',
    'bg-orange-400',
    'bg-rose-400',
    'bg-pink-400'
];

const PRIOTITYSTYLES: any = {
    high: "text-red-700 bg-rose-200",
    medium: "text-yellow-700 bg-yellow-200",
    low: "text-blue-700 bg-blue-200",
};

const ICONS: any = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />
}

const TaskCard = ({ task, setProject }: Props) => {
    // if (!task) return;
    const uuid = uuid4();
    // console.log(task?.assignee.avatar);
    // const router = useRouter();

    const { userId } = useAuth();
    const taskId = task?.id;
    const [openTaskActivity, setOpenTaskActivity] = useState<boolean>(false);
    // console.log(params.tid);
    const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
    const [taskTitle, setTaskTitle] = useState<string>(task?.title);

    const [isEditingDesc, setIsEditingDesc] = useState<boolean>(false);
    const [taskDesc, setTaskDesc] = useState<string>(task?.description);

    const [isEditingPriority, setIsEditingPriority] = useState<boolean>(false);
    const [taskPriority, setTaskPriority] = useState<string>(task?.priority);

    const [unassignedUsers, setUnassignedUsers] = useState<any>();

    const [openStageDialog, setOpenStageDialog] = useState<boolean>(false);

    useEffect(() => {
        getAvailableUsers();
    }, [setUnassignedUsers]);

    const getAvailableUsers = async () => {
        const users = await getUnassignedUsersOnTask(task?.id);
        setUnassignedUsers(users);
    }

    return (
        <>
            <Card className='h-full'>
                <CardHeader>
                    <CardTitle>
                        <div className='flex flex-col items-center text-muted-foreground w-full text-sm'>
                            {isEditingTitle ? (
                                <>
                                    <TextInputEdit setValue={setTaskTitle}
                                        colName='title'
                                        value={taskTitle}
                                        id={taskId} model='Task'
                                        setEditable={setIsEditingTitle} />
                                </>
                            ) : (
                                <Button onClick={() => setIsEditingTitle(true)}
                                    variant={'secondary'} className={cn(
                                        'line-clamp-1 text-md font-semibold capitalize flex gap-1 w-full text-slate-200',
                                        TASK_TYPE[task?.stage]
                                    )}>
                                    {taskTitle}
                                </Button>
                            )}
                        </div>
                        <div className='w-full border-t border-gray-200 mt-2' />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='mb-3 text-sm text-slate-700 p-1 bg-slate-50 rounded-md'>
                        {isEditingDesc ? (
                            <>
                                <TextInputEdit setValue={setTaskDesc}
                                    colName='description'
                                    value={taskDesc}
                                    id={taskId} model='Task'
                                    setEditable={setIsEditingDesc} />
                            </>
                        ) : (
                            <Hint label={taskDesc}>
                                <div onClick={() => setIsEditingDesc(true)} role='button'
                                    className='line-clamp-1 text-sm font-normal capitalize'>
                                    {taskDesc}
                                </div>
                            </Hint>
                        )}
                    </div>
                    <div className='flex items-center place-content-between mb-2 gap-3 flex-col sm:flex-col xl:flex-row'>
                        <Hint label='Start date'>
                            <span className='flex gap-2 text-xs bg-teal-500 py-1 px-2 rounded-md'>
                                <HourglassIcon color='white' className='h-4 w-4' />
                                <p className='font-semibold text-slate-100'>{moment(task?.createdAt).format('MM/DD/YY')}</p>
                            </span>
                        </Hint>
                        <Hint label='Due date'>
                            <span className='flex gap-2 text-xs bg-fuchsia-400 py-1 px-2 rounded-md'>
                                <LogOutIcon color='white' className='h-4 w-4' />
                                <p className='font-semibold text-slate-100'>{moment(task?.createdAt).format('MM/DD/YY')}</p>
                            </span>
                        </Hint>
                    </div>
                    <div className='p-1'>
                        <div className={cn(
                            "flex flex-row items-center justify-center text-xs font-semibold rounded-md bg-slate-200 px-2 py-1",
                            PRIOTITYSTYLES[taskPriority],
                        )}>

                            {isEditingPriority ? (
                                <>
                                    <SelectInputEdit
                                        setValue={setTaskPriority}
                                        selectValues={PRIORITIES}
                                        colName='priority'
                                        value={taskPriority}
                                        id={taskId} model='Task'
                                        setEditable={setIsEditingPriority} />
                                </>
                            ) : (
                                <div onClick={() => setIsEditingPriority(true)} role='button'
                                    className='flex items-center justify-center gap-1'>
                                    <span>{taskPriority ? ICONS[taskPriority] : ICONS.low}</span>
                                    <p className='capitalize'>{taskPriority}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className='px-4 py-1'>
                    {/* <div key={uuid} className={cn(
                    "text-white flex items-center rounded-md justify-center text-sm -mr-1 p-2 w-full",
                    BGS[(Math.floor(Math.random() * BGS.length)) % BGS?.length]
                )}>
                    <span className='flex gap-2 text-xs text-muted-foreground bg-slate-100 p-1 rounded-md'>
                        <p className='font-semibold'>Due:</p>{moment(task?.date).fromNow()}
                    </span>
                </div> */}
                    <div className='flex items-center place-items-center gap-3 flex-col xl:flex-row'>
                        <div className='flex items-center justify-start gap-2'>
                            <Hint label='Notes'>
                                <div className='flex gap-1 items-center text-sm text-gray-600'>
                                    <BiMessageAltDetail />
                                    <span>
                                        {task?.activities?.length}
                                    </span>
                                </div>
                            </Hint>
                            <Hint label='Assets'>
                                <div className='flex gap-1 items-center text-sm text-gray-600'>
                                    <MdAttachFile />
                                    <span>
                                        {task?.assets?.length}
                                    </span>
                                </div>
                            </Hint>
                            <Hint label='Activities'>
                                <div className='flex gap-1 items-center text-sm text-gray-600' role='button' onClick={() => setOpenTaskActivity(true)}>
                                    <FaList />
                                    <span>
                                        {task?.activities?.length}
                                    </span>
                                </div>
                            </Hint>
                        </div>
                        {/* <div className='w-48' /> */}
                        <div className='flex flex-row gap-4 items-center ustify-center ml-8'>
                            <>
                                <TooltipProvider delayDuration={100} key={uuid}>
                                    <Tooltip>
                                        <TooltipTrigger className='mt-1 rounded-full bg-white/5 flex justify-center items-center group'>
                                            <Avatar key={uuid} className='h-8 w-8'>
                                                <AvatarImage src={`https://api.dicebear.com/9.x/bottts/svg?seed=${task?.assignee?.name}&backgroundColor=b6e3f4,c0aede&backgroundType=solid`} />
                                                <AvatarFallback><span className='text-center'>{getInitials(task?.assignee?.name)}</span></AvatarFallback>
                                            </Avatar>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <div className='flex flex-col gap-y-1 p-3'>
                                                <p className='text-black text-lg font-semibold flex items-center justify-center gap-2'>
                                                    {task?.assignee?.name}
                                                    {task?.assignee?.avatar! ? (
                                                        <>
                                                            <Avatar key={uuid}>
                                                                <AvatarImage src={task?.assignee?.avatar} />
                                                                <AvatarFallback><span className='text-center'>{getInitials(task?.assignee?.name)}</span></AvatarFallback>
                                                            </Avatar>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Avatar key={uuid}>
                                                                <AvatarImage src={`https://api.dicebear.com/9.x/bottts/svg?seed=${task?.assignee?.name}&backgroundColor=b6e3f4,c0aede&backgroundType=solid`} />
                                                                <AvatarFallback><span className='text-center'>{getInitials(task?.assignee?.name)}</span></AvatarFallback>
                                                            </Avatar>
                                                        </>
                                                    )}
                                                </p>
                                                <span className='text-xs text-muted-foreground'>{task?.assignee?.title}</span>
                                                <span className='text-blue-500 text-xs'>{task?.assignee?.email}</span>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                {task?.stage !== 'completed' && <Hint label='Move to next stage'>
                                    <div className='bg-purple-200 mt-1 rounded-full h-8 w-8 flex items-center justify-center'>
                                        <ArrowBigRightDashIcon onClick={() => setOpenStageDialog(true)}
                                            color='#303491'
                                            className='h-5 w-5 hover:cursor-pointer' />
                                    </div>
                                </Hint>}
                            </>
                        </div>
                    </div>
                </CardFooter>
            </Card>
            <TaskActivityHoverCard
                activities={task?.activities}
                open={openTaskActivity}
                onOpenChange={setOpenTaskActivity}
                taskName={task?.title}
                taskId={task?.id} />
            <TaskNextStageDialog
                setProject={setProject}
                open={openStageDialog}
                onOpenChange={setOpenStageDialog}
                taskId={task?.id}
                currentStage={task?.stage}
                userId={userId!}
                users={unassignedUsers} />
        </>
    )
}

export default TaskCard;