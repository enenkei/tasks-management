'use client';
import React, { MouseEvent, useState } from 'react';
import ActivityCard from './activity-card';
import { Button } from '@/components/ui/button';
import { LoaderIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { createActivity, getTaskbyTaskId } from '@/app/actions/task';
import { useAuth } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import { Activity, User } from '@prisma/client';

type Props = {
    activities: any,
    setTask: (task: any) => void
}
const activity_types = [
    "Close",
    "Commented",
    "Bug",
    // "Re-assigned",
    "Review"
];

const Activities = ({ activities, setTask }: Props) => {
    const [text, setText] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selected, setSelected] = useState<string>("");
    const { userId } = useAuth();
    const params = useParams();

    const onSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!selected || !text) {
            toast({
                title: 'Missing required information!',
                description: 'Comment and activity type is required'
            });
            return;
        }
        const activity = await createActivity(selected.toLowerCase(), text, userId!, params?.tid! as string);
        // console.log(activity);
        if (activity) {
            toast({
                title: 'Success!',
                description: 'Activity added'
            });
            const t: any & { assignee: User & { activities: Activity[] & { owner: User } } } = await getTaskbyTaskId(params?.tid! as string);
            setTask(t);
            setText("");
            setSelected("");
        }
    }
    return (
        <div className='w-full flex gap-10 2xl:gap-20 min-h-screen px-10 py-8 bg-white shadow rounded-md justify-between overflow-y-auto'>
            <div className='w-full md:w-1/2'>
                <h4 className='text-gray-400 font-semibold text-lg mb-5'>
                    Activities
                </h4>
                <div className='w-full'>
                    {activities?.map((activity: any, idx: number) => (
                        <ActivityCard key={idx} item={activity} isConnected={idx < activities?.length - 1} />
                    ))}
                </div>
            </div>
            <div className='w-full md:w-1/2'>
                <h4 className='text-gray-600 font-semibold text-lg mb-5'>
                    Add Activity
                </h4>
                <div className='w-full flex flex-wrap gap-5'>
                    {activity_types.map((item, index) => (
                        <div key={item + index} className='flex gap-2 items-center'>
                            <input
                                type='checkbox'
                                className='w-4 h-4'
                                checked={selected === item ? true : false}
                                onChange={(e) => setSelected(item)}
                            />
                            <p>{item}</p>
                        </div>
                    ))}
                    <textarea
                        rows={10}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder='Type your comment here...'
                        className='bg-white w-full mt-10 border border-gray-300 outline-none p-4 rounded-md focus:ring-2 ring-blue-500'
                    ></textarea>
                    {isLoading ? (
                        <LoaderIcon className='h-10 w-10 animate-spin transition' />
                    ) : (
                        <Button onClick={(e) => onSubmit(e)}
                            type='button'
                            className='bg-blue-600 text-white rounded'
                        >
                            Submit
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Activities;
