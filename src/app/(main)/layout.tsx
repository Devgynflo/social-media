import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import SessionProvider from "@/providers/session";
import { Navbar } from "@/components/navbar";

interface Props {}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const session = await validateRequest()
    if(!session.user) {
        redirect('/login')
    }
  return (
    <SessionProvider value={session}>
        <div className="flex min-h-screen flex-col">
            <Navbar/>
            <div className="max-w-7xl mx-auto p-5">
                {children}
            </div>
        </div>
    </SessionProvider>
  );
}