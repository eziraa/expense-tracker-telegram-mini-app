"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Tag, Plus, Loader2Icon } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { createCategory } from "@/app/actions/categories";
import { toast } from "sonner";
import { EmojiSelector } from "./emoji-picker";

const categorySchema = z.object({
    name: z.string().min(1, "Category name is required"),
    type: z.enum(["expense", "income"], { required_error: "Type is required" }),
    icon: z.string().optional(),
    color: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function AddCategoryDialog({ userId, open, setOpen }: { userId: string, open: boolean, setOpen: (open: boolean) => void }) {

    const [color, setColor] = React.useState("#6b7280");
    const [isAdding, setIsAdding] = React.useState(false);

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            type: "expense",
            icon: "tag",
            color: "#6b7280",
        },
    });


    const handleAdd = async (data: CategoryFormValues) => {
        setIsAdding(true)

        try {

            await createCategory({
                user_id: userId,
                name: data.name,
                type: data.type,
                icon: data.icon,
                color: color,
            })
            setOpen(false)
            toast.success("Category created successfully")
            form.reset()
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to create transaction")
        } finally {
            setIsAdding(false)
        }
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent >
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="space-y-4"
                    >
                        <DialogHeader>
                            <DialogTitle className="text-lg font-semibold">Add New Category</DialogTitle>
                            <DialogDescription>
                                Create a category for your transactions.
                            </DialogDescription>
                        </DialogHeader>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Groceries" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="expense">Expense</SelectItem>
                                                    <SelectItem value="income">Income</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="icon"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category Icon</FormLabel>
                                            <FormControl>
                                                <EmojiSelector
                                                    value={field.value}
                                                    onChange={(emoji) => field.onChange(emoji)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                                <div className="space-y-2">
                                    <FormLabel>Color</FormLabel>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-6 h-6 rounded-full border"
                                            style={{ backgroundColor: color }}
                                        ></div>
                                        <HexColorPicker color={color} onChange={setColor} />
                                    </div>
                                </div>

                                <DialogFooter className="mt-6">
                                    <Button disabled={isAdding} type="submit" className="w-1/2 flex items-center space-x-0.5 bg-primary text-white">
                                        {
                                            isAdding ? (
                                                <>
                                                    <Loader2Icon className=" animate-spin text-accent" />
                                                    Saving
                                                </>
                                            ) : (
                                                <>
                                                    <Tag className="w-4 h-4 mr-2" /> Save Category
                                                </>
                                            )

                                        }
                                    </Button>
                                    <DialogClose asChild>
                                        <Button variant="ghost" className="w-1/2">Cancel</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </form>
                        </Form>
                    </motion.div>
                </AnimatePresence>
            </DialogContent>

        </Dialog>
    );
}
