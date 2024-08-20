'use client';
import React from 'react';
import Title from '../tasks/_component/title';
import UserTable from './_component/user-table';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { Loader2Icon } from 'lucide-react';

const TeamPage = () => {
  const { userId } = useAuth();
  const { data: users, refetch: refetchUsers } = useQuery({
    queryKey: ['get-users', userId],
    queryFn: async () => {
      const { data } = await axios.get('/api/user/get/all');
      return data.users;
    }
  });
  // console.log(users);
  return (
    <div className='w-full md:px-1 px-0 mb-6'>
      <div className='flex items-center justify-between mb-8'>
        <Title title='Team Members' />
        {/* <Button className='flex flex-row-reverse gap-1 items-center bg-blue-600'
          onClick={() => setOpen(true)}>
          Add user<IoMdAddCircle className='text-lg' />
        </Button> */}
      </div>
      <div className='px-2 md:px-4 py-4 '>
        <div className='overflow-x-auto'>
          {users && users?.length > 0 ? (
            <UserTable users={users} />
          ) : (
            <Loader2Icon className='w-16 h-16 animate-spin' />
          )}

        </div>
      </div>
    </div>
  )
}

export default TeamPage;
