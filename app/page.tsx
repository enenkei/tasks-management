'use client';
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { LayoutDashboardIcon, LogInIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <main>
        <div className="flex h-screen items-center justify-center bg-slate-50 p-5">
          <div className="grid md:grid-cols-2 grid-cols-1 items-center gap-10 md:px-10">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-slate-700"><span className="text-green-500">Hi,</span>&nbsp;there! Welcome to TaskRite, your reliable task management solution. Let&apos;s start organizing!</h1>
              <p className="mb-6 text-orange-400 text-center">Task Management Made Simple.</p>
              <div className="flex flex-row w-full justify-center space-x-5">
                <SignedOut>
                  <div className="flex items-center justify-center gap-2 w-1/2 bg-stone-200 p-2 rounded-lg">
                    <SignInButton>Sign in to get started</SignInButton><LogInIcon className="h-4 w-4" />
                  </div>
                </SignedOut>
                <SignedIn>
                  <Button variant={'outline'} onClick={() => router.push('/project')}>Your dashboard<LayoutDashboardIcon className="h-5 w-5 ml-2" /></Button>
                </SignedIn>
              </div>
            </div>
            <div>
              <img src="/images/undraw_start_building_re_xani.svg" alt="" className="md:size-96 size-72 rounded-lg" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
