import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React from 'react';
import { MdAdd } from 'react-icons/md';

type Props = {
    label : string,
    className? : string
}

const TaskTitle = ({label, className} : Props) => {
    // console.log(className);
    return (
        <div className='w-full h-4 md:h-6 px-2 md:px-4 rounded flex items-center justify-evenly'>
            <div className='flex gap-2 items-center'>
                <div className={cn(
                    "w-3 h-3 rounded-full", className
                )} />
                <p className='text-sm text-gray-600'>{label}</p>
            </div>
            {/* <Button className='md:block hidden' variant={'ghost'}>
                <MdAdd className='text-lg text-black' />
            </Button> */}
        </div>
    )
}

export default TaskTitle;
