import * as React from "react";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type DeleteDialogProps<T = unknown> = {
    /**
     * Optional trigger element (e.g. an IconButton). If not provided the dialog
     * can be controlled with `open` + `onOpenChange`.
     */
    trigger?: React.ReactNode;
    /**
     * Optional item that will be passed to onConfirm
     */
    item?: T;
    /**
     * Title shown in the dialog
     */
    title?: string;
    /**
     * Description shown in the dialog. Can be a function that receives the item.
     */
    itemName?: string;
    /**
     * Called when the user confirms deletion. Can be async.
     */
    onConfirm: (item?: T) => Promise<void> | void;
    /**
     * Text for the confirm button
     */
    confirmLabel?: string;
    /**
     * Text for the cancel button
     */
    cancelLabel?: string;
    /**
     * Optional controlled open state
     */
    open?: boolean;
    /**
     * Optional callback when open changes
     */
    onOpenChange?: (open: boolean) => void;
};

export default function DeleteDialog<T = unknown>({
    trigger,
    item,
    title = "Delete item",
    itemName,
    onConfirm,
    confirmLabel = "Delete",
    cancelLabel = "Cancel",
    open: controlledOpen,
    onOpenChange,
}: DeleteDialogProps<T>) {
    const [internalOpen, setInternalOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);

    React.useEffect(() => {
        if (typeof controlledOpen === "boolean") {
            setInternalOpen(controlledOpen);
        }
    }, [controlledOpen]);
    const setOpen = (v: boolean) => {
        setInternalOpen(v);
        onOpenChange?.(v);
    };

    const handleConfirm = async () => {
        try {
            setIsDeleting(true);
            await onConfirm(item);
            setOpen(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const renderedDescription = `Are you sure you want to delete this ${itemName ? itemName : "item"}? This action cannot be undone.`

    return (
        <AlertDialog
            open={internalOpen}
            onOpenChange={value => {
                setOpen(value);
                onOpenChange?.(value);
            }}
        >
            {trigger ? <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger> : null}
            <AlertDialogContent className="">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-destructive">{title}</AlertDialogTitle>
                    <AlertDialogDescription>{renderedDescription}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-row gap-2.5 justify-end">
                    <AlertDialogCancel asChild>
                        <Button variant="ghost">{cancelLabel}</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            variant="destructive"
                            onClick={handleConfirm}
                            disabled={isDeleting}
                            className="bg-destructive"
                        >
                            {isDeleting ? "Deleting..." : (
                                <>
                                    <Trash className="mr-1 h-4 w-4" />
                                    {confirmLabel}
                                </>
                            )}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}