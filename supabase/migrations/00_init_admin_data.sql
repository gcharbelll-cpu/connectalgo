-- Initialization script for Connect Algo Admin Data (Supabase)
-- You can copy-paste this into the Supabase SQL Editor to create the tables and populate the initial data.

-- 1. Create Admins Table
CREATE TABLE IF NOT EXISTS public.admins (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    password TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create FAQs Table
CREATE TABLE IF NOT EXISTS public.faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    rating SMALLINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Strategies Table
CREATE TABLE IF NOT EXISTS public.strategies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    roi NUMERIC NOT NULL,
    drawdown NUMERIC NOT NULL,
    "winRate" NUMERIC NOT NULL,
    price NUMERIC NOT NULL,
    "priceSixMonth" NUMERIC NOT NULL,
    "priceYearly" NUMERIC NOT NULL,
    subscribers INT NOT NULL,
    rating NUMERIC NOT NULL,
    "riskReward" TEXT NOT NULL,
    "provenRecordUrl" TEXT,
    "maxSubscribers" INT,
    "assetClass" TEXT,
    "assetSubtype" TEXT,
    tags JSONB,
    history JSONB,
    "advancedMetrics" JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- DATA SEEDING
-- --------------------------------------------------------

-- Insert Initial Admins
INSERT INTO public.admins (id, email, password)
VALUES ('master-admin', 'thebtcslayer@gmail.com', 'Boula2003')
ON CONFLICT (id) DO NOTHING;

-- Insert Initial FAQs
INSERT INTO public.faqs (id, question, answer) VALUES 
('1', 'How does the copy trading process work?', 'We utilize Bybit''s official Copy Trading infrastructure. Once you connect, our Master Account trades are replicated instantly in your own account. You maintain full custody of your funds and can disconnect at any time.'),
('2', 'Is my capital safe?', 'Yes. Your funds always remain in your own personal Bybit exchange account. We never have permission to withdraw or move your assets. The system only provides trade execution signals.'),
('3', 'What is the recommended minimum investment?', 'To ensure proper position sizing and risk management, we recommend a minimum capital of $3,000 for individual strategies. For ''The Ultimate'' portfolio, a minimum of $5,000 is advised to effectively diversify across all assets.'),
('4', 'Can I withdraw my profits at any time?', 'Absolutely. There is no lock-up period. You have 100% control over your funds and can withdraw your profits or your entire capital whenever you choose via Bybit.'),
('5', 'Do I need to keep my computer on?', 'No. All trading operations occur in the cloud on Bybit''s institutional servers. You do not need to install any software or keep your device running.')
ON CONFLICT (id) DO NOTHING;

-- Insert Initial Testimonials
INSERT INTO public.testimonials (id, name, role, content, rating) VALUES 
('michael-r', 'Michael R.', 'Software Engineer', 'I''ve been looking for a passive income stream that doesn''t require my constant attention. The Trend Intraday strategy has been incredible—consistent gains without me lifting a finger.', 5),
('sarah-l', 'Sarah L.', 'Entrepreneur', 'The transparency is what sold me. Being able to see every trade executed in real-time on Bybit gives me huge peace of mind. The returns speak for themselves.', 5),
('david-k', 'David K.', 'Crypto Investor', 'I started with a small amount on the Range Intraday strategy just to test it out. After seeing the risk management in action during the last dip, I moved my entire portfolio over.', 5)
ON CONFLICT (id) DO NOTHING;

-- Insert Initial Strategies
INSERT INTO public.strategies (
    id, name, description, roi, drawdown, "winRate", price, "priceSixMonth", "priceYearly",
    subscribers, rating, "riskReward", "assetClass", "assetSubtype", tags, history, "maxSubscribers", "advancedMetrics", "provenRecordUrl"
) VALUES 
(
    'trend-intraday', 'Trend Intraday', 'High-velocity day trading strategy capturing short-term trend extensions. Enters and exits positions within the same session to avoid overnight risk.',
    46.11, 6.5, 62.5, 350, 1899, 3299, 10, 4.8, '1:2.5', 'Crypto', 'BTC', 
    '["Intraday", "Momentum", "No Overnight Risk"]'::JSONB, 
    '[{"date": "2023-02", "profit": 42.5}, {"date": "2023-03", "profit": 38.1}, {"date": "2023-04", "profit": 51.2}, {"date": "2023-05", "profit": 29.8}, {"date": "2023-06", "profit": 65.4}, {"date": "2023-07", "profit": 45.9}, {"date": "2023-08", "profit": 48.1}, {"date": "2023-09", "profit": 39.5}, {"date": "2023-10", "profit": 55.8}, {"date": "2023-11", "profit": 32.2}, {"date": "2023-12", "profit": 71.8}, {"date": "2024-01", "profit": 49.5}]'::JSONB,
    10, 
    '{"avgTrade": 3.09, "winRate": 62.5, "bestTrade": 9.52, "worstTrade": 1.18, "maxDrawdown": 0, "totalTrades": 8, "profitFactor": 21.315, "sharpeRatio": 0.775, "sortinoRatio": 8.025, "recoveryFactor": 0}'::JSONB,
    NULL
),
(
    'trend-swing', 'Trend Swing', 'Classic swing trading system designed to ride major market waves for days or weeks. Captures the bulk of significant price movements.',
    1450.8, 14.5, 75, 650, 3499, 5999, 2, 5, '1:4.0', 'Crypto', 'ETH',
    '["Swing", "Multi-Day", "Trend Following"]'::JSONB,
    '[{"date": "2023-02", "profit": 88.5}, {"date": "2023-03", "profit": 112.4}, {"date": "2023-04", "profit": -12.5}, {"date": "2023-05", "profit": 145.8}, {"date": "2023-06", "profit": 210.2}, {"date": "2023-07", "profit": 95.6}, {"date": "2023-08", "profit": 135.5}, {"date": "2023-09", "profit": -8.1}, {"date": "2023-10", "profit": 245.4}, {"date": "2023-11", "profit": 195.2}, {"date": "2023-12", "profit": 110.7}, {"date": "2024-01", "profit": 168.1}]'::JSONB,
    10, NULL, NULL
),
(
    'steady-income', 'Range Intraday', 'Mean-reversion strategy that profits from sideways markets. Buys support and sells resistance during low volatility periods.',
    215.2, 3.2, 94, 350, 1899, 3299, 890, 4.9, '1:1.5', 'Crypto', 'SOL',
    '["Range Bound", "Consolidation", "High Win Rate"]'::JSONB,
    '[{"date": "2023-02", "profit": 18.5}, {"date": "2023-03", "profit": 21.2}, {"date": "2023-04", "profit": 19.8}, {"date": "2023-05", "profit": 23.5}, {"date": "2023-06", "profit": 20.1}, {"date": "2023-07", "profit": 18.9}, {"date": "2023-08", "profit": 22.8}, {"date": "2023-09", "profit": 25.9}, {"date": "2023-10", "profit": 21.7}, {"date": "2023-11", "profit": 28.1}, {"date": "2023-12", "profit": 24.8}, {"date": "2024-01", "profit": 26.9}]'::JSONB,
    NULL, NULL, '234'
),
(
    'the-ultimate', 'The Ultimate', 'The complete ecosystem. Combines Trend Intraday, Trend Swing, and Range Intraday for maximum alpha and minimized volatility.',
    2450.5, 5.5, 86, 999, 5399, 9499, 154, 5, 'Dynamic', 'Crypto', 'Multi',
    '["Full Portfolio", "Max Alpha", "Diversified"]'::JSONB,
    '[{"date": "2023-02", "profit": 125.4}, {"date": "2023-03", "profit": 142.1}, {"date": "2023-04", "profit": 98.6}, {"date": "2023-05", "profit": 165.2}, {"date": "2023-06", "profit": 188.9}, {"date": "2023-07", "profit": 212.5}, {"date": "2023-08", "profit": 206.4}, {"date": "2023-09", "profit": 57.3}, {"date": "2023-10", "profit": 322.9}, {"date": "2023-11", "profit": 255.5}, {"date": "2023-12", "profit": 207.3}, {"date": "2024-01", "profit": 244.5}]'::JSONB,
    NULL, NULL, NULL
)
ON CONFLICT (id) DO NOTHING;
