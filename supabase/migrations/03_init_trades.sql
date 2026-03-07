-- 03_init_trades.sql
-- Create trades table in Supabase to replace trades.json

CREATE TABLE IF NOT EXISTS public.trades (
    id TEXT PRIMARY KEY,
    "strategyId" TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    symbol TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('LONG', 'SHORT')),
    "entryPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "exitPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    pnl DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pnlValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('WIN', 'LOSS', 'OPEN')),
    duration TEXT,
    signal TEXT,
    "positionSize" DOUBLE PRECISION,
    "positionValue" DOUBLE PRECISION,
    "runUp" DOUBLE PRECISION,
    drawdown DOUBLE PRECISION,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast strategy lookups
CREATE INDEX IF NOT EXISTS idx_trades_strategy_id ON public.trades ("strategyId");

-- Index for date ordering
CREATE INDEX IF NOT EXISTS idx_trades_date ON public.trades (date);
