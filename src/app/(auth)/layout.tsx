import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

interface Props {}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const {user} = await validateRequest()
    if(user) {
        redirect('/')
    }
  return (
    <>{children}</>
  );
}