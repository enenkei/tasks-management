import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowUp } from 'react-icons/md';
export const ICONS: any = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />
}


export const TASK_TYPE: any = {
    todo: "bg-indigo-600",
    inprogress: "bg-amber-600",
    review: "bg-cyan-600",
    completed: "bg-green-600",
};

export const BGS : string[] = [
    "bg-blue-600",
    "bg-yellow-600",
    "bg-green-600",
    "bg-violet-600",
    'bg-slate-600',
    'bg-stone-600',
    'bg-orange-600'
];