import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, Loader2Icon, PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Account } from "@/lib/types";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/auth.privider";
import { updateAccount } from "@/app/actions/accounts";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";


type EditAccountDialogProps = {

    onConfirm: (account: Account) => void;
    account: Account
};

export default function EditAccountDialog({
    onConfirm,
    account,
}: EditAccountDialogProps) {
    const { user, loading } = useAuth()
    const userProfile = user?.profiles?.[0]
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [formData, setFormData] = useState({
        name: "",
        type: "checking",
        balance: "",
        currency: userProfile?.currency || "ETB",
    })

    useEffect(() => {
        setFormData({
            name: account.name || "",
            type: account.type || "checking",
            balance: account.balance?.toString() || "",
            currency: userProfile?.currency || "ETB",
        })
    }, [account])

    const handleAddAccount = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setError(null)

        try {
            const newAccount = await updateAccount(account.id, {
                ...formData,
                balance: Number.parseFloat(formData.balance),
            })
            onConfirm(newAccount)
            setOpen(false)
            setFormData({ name: "", type: "checking", balance: "", currency: userProfile?.currency || "ETB" })
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create account")
        } finally {
            setIsSaving(false)
        }
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <PencilIcon className="h-4 w-4" />
            </DialogTrigger>
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle>Edit Account</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddAccount} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Account Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g., Checking"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={isSaving}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="checking">Checking</SelectItem>
                                <SelectItem value="savings">Savings</SelectItem>
                                <SelectItem value="credit">Credit Card</SelectItem>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="investment">Investment</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="balance">Initial Balance</Label>
                        <Input
                            id="balance"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={formData.balance}
                            onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                            disabled={isSaving}
                            required
                        />
                    </div>
                    {error && (
                        <div className="flex items-center gap-2 p-2 bg-destructive/10 text-destructive rounded text-xs">
                            <AlertCircle className="h-3 w-3" />
                            {error}
                        </div>
                    )}
                    <Button type="submit" className="w-full flex items-center space-x-0.5" disabled={isSaving || loading}>
                        {isSaving ? (
                            <>
                                <Loader2Icon className="animate-spin text-white" />
                                Saving account
                            </>
                        ) : (
                            'Save account'
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}