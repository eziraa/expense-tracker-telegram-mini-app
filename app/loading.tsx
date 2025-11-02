import { Loader2Icon } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center flex-col space-y-4">
            <Loader2Icon className=" animate-spin text-accent" />
        </div>
    )
}