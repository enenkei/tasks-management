import { cn, getInitials } from '@/lib/utils';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from 'moment';
import { ICONS, TASK_TYPE } from '@/lib/constants';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { differenceInCalendarDays } from 'date-fns';

type Props = {
  tasks: any
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
  if (diff < 0) {
    bgColor = 'bg-red-500';
  } else if (diff >= 0 && diff <= 3) {
    bgColor = 'bg-amber-500';
  } else if (diff > 3) {
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

const TaskTable = ({ tasks }: Props) => {
  return (
    <Table className='min-w-[800px] overflow-x-auto my-5 shadow-md rounded-md'>
      <TableHeader>
        <TableRow key={"81028a"} className='bg-teal-100'>
          <TableHead className="w-[300px]">Task</TableHead>
          <TableHead className="text-center w-[100px]">Priority</TableHead>
          <TableHead className="text-center">Owner</TableHead>
          <TableHead className="text-center w-[200px]">Due</TableHead>
          <TableHead className="text-center w-[150px]">Created at</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks?.map((task: any, idx: number) => (
          <>
            <TableRow className='text-gray-600' key={task.title + idx}>
              <TableCell>
                <div className='flex items-center gap-2'>
                  <p className='w-full line-clamp-1 capitalize text-base text-stone-700 p-1 rounded-md'>
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
                <div className='flex items-center justify-start gap-2'>
                  <Avatar>
                    <AvatarImage
                      src={`https://api.dicebear.com/9.x/bottts/svg?seed=${task?.assignee?.name}&backgroundColor=b6e3f4,c0aede&backgroundType=solid`} />
                    <AvatarFallback><span className='text-center'>{getInitials(task?.assignee?.name)}</span></AvatarFallback>
                  </Avatar>
                  {task?.assignee.name}
                </div>
              </TableCell>
              <TableCell className="text-left">
                {dueDateColFormat(task?.date)}
              </TableCell>
              <TableCell className="text-left">
                {moment(task?.createdAt).format('DD-MMM-YY HH:mm')}
              </TableCell>
            </TableRow>
          </>
        ))}
      </TableBody>
    </Table>
  )
}

export default TaskTable;
