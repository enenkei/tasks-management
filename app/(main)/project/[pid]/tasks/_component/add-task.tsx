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
import { createNewTask, getTasksByProject } from '@/app/actions/task';
import { useAuth } from '@clerk/nextjs';
import UserAvatar from '@/app/(main)/_component/user-avatar';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import moment from 'moment';
import { Calendar } from '@/components/ui/calendar';

type Props = {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    users: User[],
    setProject: (tasks: any) => void,
    projectId: string
}

export const STAGES = [
    { name: 'todo', value: 'TODO' },
    { name: 'inprogress', value: 'IN PROGRESS' },
    { name: 'review', value: 'IN REVIEW' },
    { name: 'completed', value: 'COMPLETED' }
];
export const PRIORITIES = [
    { name: 'low', value: 'Low' },
    { name: 'medium', value: 'Medium' },
    { name: 'high', value: 'High' }
];

const PRIOTITYSTYLES: any = {
    high: "text-red-600",
    medium: "text-yellow-600",
    low: "text-blue-600",
};

const AddTask = ({ open, onOpenChange, users, setProject, projectId }: Props) => {
    const uuid = uuid4();
    const { userId } = useAuth();
    const [isPending, setIsPending] = useState<boolean>(false);
    const form = useForm<z.infer<typeof addTaskSchema>>({
        resolver: zodResolver(addTaskSchema),
        defaultValues: {
            title: "",
            userId: '',
            // stage: 'todo',
            date: new Date(),
            priority: '',
            description: '',
        }
    });

    async function onSubmit(values: z.infer<typeof addTaskSchema>) {
        // console.log(typeof values.date);
        setIsPending(true);
        try {
            const task = await createNewTask(userId!, values, projectId);
            if (task) {
                const tasks = await getTasksByProject(values.userId!, projectId!);
                setProject(tasks);
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
                            New task<ListTodoIcon className='h-4 w-4' />
                        </div>
                    </DialogTitle>
                    <DialogDescription>
                        Here you can add a new task
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                        <FormField
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder='Task title...' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='userId'
                            render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Assign task to a user' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {users && users?.map((user, idx) => (
                                                <SelectItem value={user.id} key={idx + uuid}>
                                                    <div className='flex items-center justify-center gap-3'>
                                                        {user?.avatar ? (
                                                            <>
                                                                <UserAvatar imgSrc={user?.avatar!} fallbackText={getInitials(user?.name)} />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserAvatar imgSrc={`https://api.dicebear.com/9.x/bottts/svg?seed=${user?.name!}&backgroundColor=b6e3f4,c0aede&backgroundType=solid`} fallbackText={getInitials(user?.name)} />
                                                            </>
                                                        )}
                                                        {user?.name}
                                                    </div>
                                                </SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='grid grid-cols-2 gap-3'>
                            <FormField
                                control={form.control}
                                name='priority'
                                render={({ field }) => (
                                    <FormItem>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                name='date'
                                render={({ field }) => (
                                    <FormItem>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[240px] pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            moment(field.value).format('MM/DD/YYYY')
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="h-5 w-5 opacity-50 ml-auto" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    // selected={field.value as string}
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

                            <div className='flex items-center justify-start'>
                                <Button variant={'secondary'} type='button' className='w-full'>
                                    Add attachments<VideotapeIcon className='h-4 w-4 ml-2 text-blue-700' />
                                </Button>
                            </div>
                        </div>
                        <FormField
                            control={form.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea {...field} className='resize-none' rows={8}
                                            placeholder='Task description (min 10 characters)...'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex gap-4 items-right justify-right'>
                            <Button type='submit' variant={'outline'}
                                disabled={isPending}>Submit{isPending && <LoaderIcon className='h-4 w-4 ml-2 animate-spin' />}</Button>
                            <Button variant={'ghost'} onClick={(e) => {
                                e.preventDefault();
                                onOpenChange(!open);
                            }}>Cancel</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}

export default AddTask;