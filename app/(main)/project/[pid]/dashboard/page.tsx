'use client';
import { ArrowDownToDot, ClipboardEditIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { FaNewspaper } from 'react-icons/fa';
import { MdAdminPanelSettings } from 'react-icons/md';
import StatsCard from './_component/stats-card';
import PrioritiesChart from './_component/priorities-chart';
import TaskTable from './_component/task-table';
import { useUser } from '@clerk/nextjs';
import { createRecord, readRecordByUserId } from '@/app/actions/crud';
import StageChart from './_component/stage-chart';
import { useParams } from 'next/navigation';
import { getTasksByProject } from '@/app/actions/task';

const DashboardPage = () => {
  const { user } = useUser();
  // console.log(user?.id);
  const params = useParams();
  const [taskStats, setTaskStats] = useState<any>();
  const [tasks, setTasks] = useState<any>();

  useEffect(() => {
    findUser(user?.id!);
    getTaskStatistics();
  }, [user]);

  const findUser = async (userId: string) => {
    if (!userId) return;
    let dbUser = await readRecordByUserId('User', userId);
    // console.log(dbUser);
    if (!dbUser) {
      const data: any = {
        userId: userId,
        name: user?.fullName || 'Felix',
        title: 'Developer',
        email: user?.primaryEmailAddress?.emailAddress!,
        avatar: user?.imageUrl!
      }
      dbUser = await createRecord('User', data);
    }
    return dbUser;
  }
  const getTaskStatistics = async () => {
    const project = await getTasksByProject(user?.id!, params?.pid as string);
    setTasks(project?.tasks);
    const totalTasks = project?.tasks?.length;
    const completed = project?.tasks?.filter((task: any) => task.stage === 'completed')?.length;
    const todo = project?.tasks?.filter((task: any) => task.stage === 'todo')?.length;
    const inprogress = project?.tasks?.filter((task: any) => task.stage === 'inprogress')?.length;
    // const review = project?.tasks?.filter((task: any) => task.stage === 'review')?.length;
    // console.log(review);
    let data: any = [];
    const totalStats = {
      _id: 7,
      label: 'Total tasks',
      total: totalTasks,
      icon: <FaNewspaper />,
      bg: 'bg-[#0f766e]'
    };
    data.push(totalStats);
    const completedStats = {
      _id: 7,
      label: 'Completed tasks',
      total: completed,
      icon: <MdAdminPanelSettings />,
      bg: 'bg-[#0f766e]'
    }
    data.push(completedStats);
    const todoStats = {
      _id: 2,
      label: 'Todos',
      total: todo,
      icon: <ArrowDownToDot />,
      bg: 'bg-[#be185d]'
    }
    data.push(todoStats);
    const inprogressStats = {
      _id: 4,
      label: 'In-progress tasks',
      total: inprogress,
      icon: <ClipboardEditIcon />,
      bg: 'bg-[#1d4ed8]'
    };
    data.push(inprogressStats);
    // const reviewStats = {
    //   _id: 29,
    //   label: 'Review',
    //   total: review,
    //   icon: <ArrowDownToDot />,
    //   bg: 'bg-[#be185d]'
    // }
    // data.push(reviewStats);
    setTaskStats(data);
  }
  // const totals = summary.tasks;
  // const stats = [
  //   {
  //     _id: "1",
  //     label: 'Total tasks',
  //     total: summary?.totalTasks || 0,
  //     icon: <FaNewspaper />,
  //     bg: 'bg-[#1d4ed8]'
  //   },
  //   {
  //     _id: "2",
  //     label: 'Completed tasks',
  //     total: totals['completed'] || 0,
  //     icon: <MdAdminPanelSettings />,
  //     bg: 'bg-[#0f766e]'
  //   },
  //   {
  //     _id: "3",
  //     label: 'In-progress tasks',
  //     total: totals['in progress'] || 0,
  //     icon: <ClipboardEditIcon />,
  //     bg: 'bg-[#1d4ed8]'
  //   },
  //   {
  //     _id: "4",
  //     label: 'Todos',
  //     total: totals['todo'],
  //     icon: <ArrowDownToDot />,
  //     bg: 'bg-[#be185d]' || 0
  //   }
  // ];
  return (
    <div className='h-full py-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        {taskStats?.map(({ icon, bg, label, total }: any, idx: number) => {
          return <StatsCard key={idx} icon={icon} bg={bg} label={label} count={total} />
        })}
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5 py-4 my-4'>
        <PrioritiesChart />
        <StageChart />
      </div>
      <div className='w-full flex flex-col md:flex-row gap-4 2xl:gap-10 py-4'>
        <TaskTable tasks={tasks} />
        {/* <UserTable users={summary.users} /> */}
      </div>
    </div>
  )
}

export default DashboardPage;