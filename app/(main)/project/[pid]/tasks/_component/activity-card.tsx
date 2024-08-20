import React from 'react';
import { FaBug, FaThumbsUp, FaUser } from 'react-icons/fa';
import { MdOutlineDoneAll, MdOutlineMessage, MdReviews } from 'react-icons/md';
import { AiOutlineUserSwitch } from "react-icons/ai";
import moment from 'moment';
import { Activity, User } from '@prisma/client';
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";
import { RiCameraSwitchLine } from "react-icons/ri";

type Props = {
    item: Activity & {owner : User},
    isConnected: boolean
}

// type activity = 'started' | 'completed' | 'commented' | 'bug' | 'assigned' | 'review';

const TASKTYPEICON: any = {
    commented: (
        <div className='w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white'>
            <MdOutlineMessage size={14} />,
        </div>
    ),
    started: (
        <div className='w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white'>
            <FaThumbsUp size={14} />
        </div>
    ),
    assigned: (
        <div className='w-10 h-10 flex items-center justify-center rounded-full bg-cyan-500 text-white'>
            <FaUser size={14} />
        </div>
    ),
    reassigned: (
        <div className='w-10 h-10 flex items-center justify-center rounded-full bg-orange-500 text-white'>
            <AiOutlineUserSwitch size={14} />
        </div>
    ),
    'change status': (
        <div className='bg-red-600 flex items-center justify-center rounded-full text-white w-10 h-10'>
            <RiCameraSwitchLine  size={24} />
        </div>
    ),
    completed: (
        <div className='w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white'>
            <MdOutlineDoneAll size={14} />
        </div>
    ),
    review: (
        <div className='w-10 h-10 flex items-center justify-center rounded-full bg-violet-600 text-white'>
            <MdReviews size={14} />
        </div>
    ),
};

const ActivityCard = ({ item, isConnected }: Props) => {
    // console.log(item);
    return (
        <div className='flex space-x-4 space-y-1'>
            <div className='flex flex-col items-center flex-shrink-0'>
                <div className='w-10 h-10 flex items-center justify-center'>
                    {TASKTYPEICON[item?.type]}
                </div>
                {isConnected && <div className='w-full flex items-center justify-center'>
                    <div className='w-0.5 bg-gray-300 h-20' />
                </div>}
            </div>
            <div className='flex flex-col gap-y-2 mb-8'>
                <p className='font-semibold'>{item?.owner?.name}</p>
                <div className='text-gray-500 space-y-2'>
                    <span className='text-sm capitalize bg-slate-100 p-2 rounded-lg'>{item?.type}</span>
                    <span className='text-xs'>&nbsp;{moment(item?.createdAt).fromNow()}</span>
                </div>
                <div className='text-gray-800 text-sm ml-4 flex items-start justify-start'>
                    <MdOutlineSubdirectoryArrowRight />
                    <p className='text-pretty p-1 bg-yellow-100 rounded-md'>{item?.comment}</p>
                </div>
            </div>
        </div>
    )
}

export default ActivityCard;