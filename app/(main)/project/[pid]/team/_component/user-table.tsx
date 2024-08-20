'use client';
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from 'moment';
import { cn, getInitials } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit2Icon, MenuSquareIcon, ShieldMinusIcon, Trash2Icon } from 'lucide-react';
import { v4 as uuid4 } from 'uuid';
import { User } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  users: User[]
}

const UserTable = ({ users }: Props) => {
  const uuid = uuid4();

  const TblHeader = () => {
    return (
      <>
        <TableHeader>
          <TableRow className='text-black dark:text-white text-left'>
            <TableHead className="py-2">Name</TableHead>
            <TableHead className='py-2'>Title</TableHead>
            <TableHead className='py-2'>Email</TableHead>
            <TableHead className='py-2'>Role</TableHead>
            <TableHead className='py-2'>Status</TableHead>
            <TableHead className="py-2 text-nowrap">Created At</TableHead>
          </TableRow>
        </TableHeader>
      </>
    )
  }
  const TblRow = ({ user }: any) => {
    return (
      <TableRow className='text-gray-600 hover:bg-gray-300/10 text-sm p-1'>
        <TableCell className="py-2">
          <div className='flex flex-1 items-center gap-1'>
            {user?.avatar! ? (
              <>
                <Avatar>
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback><span className='text-center'>{getInitials(user?.name)}</span></AvatarFallback>
                </Avatar>
              </>
            ) : (
              <>
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/9.x/bottts/svg?seed=${user?.name}&backgroundColor=b6e3f4,c0aede&backgroundType=solid`} />
                  <AvatarFallback><span className='text-center'>{getInitials(user?.name)}</span></AvatarFallback>
                </Avatar>
                {/* <div className='w-9 h-9 rounded-full text-white flex items-center justify-center bg-violet-700'>
                  <span className='text-center'>{getInitials(user?.name)}</span>
                </div> */}
                
              </>
            )}

            <div>
              <span className='text-left text-nowrap'>{user?.name}</span>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <span className='text-xs text-black'>{user?.title}</span>
        </TableCell>
        <TableCell>
          <span className='text-xs text-black'>{user?.email}</span>
        </TableCell>
        <TableCell>
          <span className='text-xs text-black'>{user?.role}</span>
        </TableCell>
        <TableCell>
          <p className={cn(
            "w-fit px-3 py-1 rounded-full",
            user?.isActive ? "bg-green-300" : "bg-yellow-100"
          )}>
            {user?.isActive ? 'Active' : 'Disabled'}
          </p>
        </TableCell>
        <TableCell className="text-left">
          <span className='text-nowrap text-gray-600 text-xs'>{moment(user?.createdAt).fromNow()}</span>
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MenuSquareIcon className='h-4 w-4 mt-1' />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Action</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><ShieldMinusIcon className='h-4 w-4 mr-2' />Disable</DropdownMenuItem>
              <DropdownMenuItem><Edit2Icon className='h-4 w-4 mr-2' /> Edit</DropdownMenuItem>
              <DropdownMenuItem><Trash2Icon className='h-4 w-4 mr-2' />Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </TableCell>
      </TableRow>
    )
  }
  return (
    <>
      <div className='w-full bg-white px-2 md:px-4 pt-4 pb-4'>
        <Table className='w-full mb-5 shadow-md rounded-lg'>
          <TblHeader />
          <TableBody>
            {
              users.map((user: any, idx: number) => {
                return <TblRow key={idx + uuid} user={user} />
              })
            }
          </TableBody>
        </Table>
      </div>
    </>
  )
}

export default UserTable;
