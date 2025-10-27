-- Add receipt_url and tags to transactions (already in schema, just ensuring)
-- Add recurring_transaction_id for recurring transactions
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS recurring_transaction_id UUID;

-- Create recurring_transactions table
CREATE TABLE IF NOT EXISTS public.recurring_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  amount DECIMAL(15, 2) NOT NULL,
  description TEXT,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for recurring_transactions
ALTER TABLE public.recurring_transactions ENABLE ROW LEVEL SECURITY;

-- Recurring transactions policies
CREATE POLICY "recurring_transactions_select_own" ON public.recurring_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "recurring_transactions_insert_own" ON public.recurring_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "recurring_transactions_update_own" ON public.recurring_transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "recurring_transactions_delete_own" ON public.recurring_transactions FOR DELETE USING (auth.uid() = user_id);
