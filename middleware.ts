import { clerkMiddleware } from "@clerk/nextjs/server";

const securedPath = ["dashboard","tasks","project","team"];

export default clerkMiddleware((auth,req) => {
  const path = req.nextUrl.pathname;  
  const split = path.split("/");
  const endpoint = split.pop();
  // console.log(securedPath.includes(endpoint!));
  if (securedPath.includes(endpoint!)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};