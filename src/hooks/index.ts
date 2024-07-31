import { SessionContext } from "@/providers/session";
import { useContext } from "react";

// tips afin de pouvoir utiliser useSession() dans le composant client, afin de le rendre non nullable
export function useSession() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error("useSession must be used within a SessionProvider");
    }

    return context;
}