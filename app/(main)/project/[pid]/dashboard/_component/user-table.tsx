import React from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowUp } from 'react-icons/md';
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

type Props = {
    users : any
}

const UserTable = ({users} : any) => {
      const TblHeader = () => {
        return (
          <>
            <TableHeader>
              <TableRow className='text-black dark:text-white text-left'>
                <TableHead className="py-2 w-full">Full name</TableHead>
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
                <div className='w-9 h-9 rounded-full text-white flex items-center justify-center bg-violet-700'>
                    <span className='text-center'>{getInitials(user?.name)}</span>
                </div>
                <div>
                    <p className='text-left text-nowrap'>{user?.name}</p>
                    <span className='text-xs text-black'>{user?.role}</span>
                </div>
              </div>
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
              <span className='text-nowrap text-gray-600'>{moment(user?.createdAt).fromNow()}</span>
            </TableCell>
          </TableRow>
        )
      }
      return (
        <>
          <div className='w-full md:w-1/3 bg-white px-2 md:px-4 pt-4 pb-4 shadow-sm rounded-lg'>
            <Table className='w-full mb-5'>
              <TblHeader />
              <TableBody>
                {
                  users.map((user: any, idx: number) => {
                    return <TblRow key={idx + user?.id} user={user} />
                  })
                }
              </TableBody>
            </Table>
          </div>
        </>
      )
}

export default UserTable;
