'use client';
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { addTaskSchema } from '@/app/data/form-schema/add-task';
import { CalendarIcon, ListTodoIcon, LoaderIcon, VideotapeIcon } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn, getInitials } from '@/lib/utils';
import { ICONS, TASK_TYPE } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { User } from '@prisma/client';

import { v4 as uuid4 } from 'uuid';
import UserAvatar from '@/app/(main)/_component/user-avatar';
import { editTaskSchema } from '@/app/data/form-schema/edit-task';
import moment from 'moment';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from '@/components/ui/calendar';
import { getTaskbyTaskId, updateTask } from '@/app/actions/task';

type Props = {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    users: User[],
    setTask: (tasks: any) => void,
    task: any
}

export const STAGES = [
    { name: 'todo', value: 'TODO' },
    { name: 'inprogress', value: 'IN PROGRESS' },
    { name: 'completed', value: 'COMPLETED' }
];

const PRIORITIES = [
    { name: 'low', value: 'Low' },
    { name: 'medium', value: 'Medium' },
    { name: 'high', value: 'High' }
];

const PRIOTITYSTYLES: any = {
    high: "text-red-600",
    medium: "text-yellow-600",
    low: "text-blue-600",
};

const EditTask = ({ open, onOpenChange, users, setTask, task }: Props) => {
    // if (!task) return;
    const uuid = uuid4();
    const [isPending, setIsPending] = useState<boolean>(false);
    const form = useForm<z.infer<typeof editTaskSchema>>({
        resolver: zodResolver(editTaskSchema),
        // defaultValues: {
        //     stage: '',
        //     date: '',
        //     priority: '',
        //     assigneeId : '',
        // }
    });

    // console.log(users);

    async function onSubmit(values: z.infer<typeof editTaskSchema>) {
        setIsPending(true);
        // console.log(values);
        try {
            const tmp = await updateTask(task?.id!, values);
            if (tmp) {
                const t: any & { assignee: User } = await getTaskbyTaskId(task?.id!);
                setTask(t);
                form.reset();
                onOpenChange(!open);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsPending(false);
        }
    }
    return (
        <Dialog open={open} onOpenChange={() => onOpenChange(!open)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <div className='flex items-center gap-2'>
                            <p>Edit task:&nbsp;{task?.title}</p><ListTodoIcon className='h-4 w-4' />
                        </div>
                    </DialogTitle>
                    <DialogDescription>
                        Here you can edit a task
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                        <div className='grid grid-cols-2 gap-3'>
                            <FormField
                                control={form.control}
                                name='stage'
                                render={({ field }) => (
                                    <FormItem>
                                        <Select defaultValue={task?.stage} value={field.value} onValueChange={(stage) => field.onChange(stage)}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Task stage' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {STAGES.map((stage, idx) => (
                                                    <SelectItem value={stage.name} key={idx}>
                                                        <div className='flex items-center justify-center gap-3'>
                                                            <div className={cn(
                                                                "h-4 w-4 rounded-full", TASK_TYPE[stage?.name]
                                                            )} />
                                                            {stage.value}
                                                        </div>
                                                    </SelectItem>
                                                ))}

                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='date'
                                render={({ field }) => (
                                    <FormItem>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <div className='flex items-center justify-center gap-2'>
                                                        <Input type='text' value={moment(field.value).format('MM/DD/YYYY')}
                                                            onChange={field.onChange} />
                                                        <CalendarIcon className="h-5 w-5 opacity-50" />
                                                    </div>

                                                    {/* <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[240px] pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {task?.date ? (
                                                            moment(field.value).format('MM/DD/YYYY')
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="h-5 w-5 opacity-50" />
                                                    </Button> */}
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    // selected={field.value as any}
                                                    onSelect={field.onChange}
                                                    disabled={(date: any) =>
                                                        date > moment(new Date()).add(45, 'days') || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='grid grid-cols-2 gap-3'>
                            <FormField
                                control={form.control}
                                name='priority'
                                render={({ field }) => (
                                    <FormItem>
                                        <Select onValueChange={field.onChange} value={field.value} defaultValue={task?.priority}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Task priority' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {PRIORITIES.map((prio, idx) => (
                                                    <SelectItem key={idx} value={prio.name}>
                                                        <div className='items-center flex gap-1'>
                                                            <span className={cn(
                                                                "text-lg", PRIOTITYSTYLES[prio.name]
                                                            )}>{ICONS[prio.name]}</span>
                                                            <span className='capitalize'>{prio.value}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='assigneeId'
                                render={({ field }) => (
                                    <FormItem>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Reassign to' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {users?.length > 0 && users.map((unassigned: User, idx: number) => {
                                                    return (
                                                        <SelectItem key={uuid + idx} value={unassigned?.id}>
                                                            <div key={uuid + idx} className='flex items-center gap-2 justify-center'>
                                                                {unassigned?.name}
                                                                <UserAvatar key={uuid}
                                                                    imgSrc={`https://api.dicebear.com/9.x/bottts/svg?seed=${unassigned?.name}&backgroundColor=b6e3f4,c0aede&backgroundType=solid`}
                                                                    fallbackText={getInitials(unassigned?.name)} />
                                                            </div>
                                                        </SelectItem>
                                                    )
                                                })}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <div className='flex items-center justify-center'>
                                <Button variant={'secondary'} type='button'>
                                    Add assets<VideotapeIcon className='h-4 w-4 ml-2' color='#249e69' />
                                </Button>
                            </div>
                        </div>
                        <div className='flex gap-4 items-right justify-right'>
                            <Button type='submit' variant={'outline'}
                                disabled={isPending}>Submit{isPending && <LoaderIcon className='h-4 w-4 ml-2 animate-spin' />}</Button>
                            <Button variant={'ghost'} onClick={(e) => {
                                e.preventDefault();
                                form.reset();
                                onOpenChange(!open);
                            }}>Cancel</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}

export default EditTask;