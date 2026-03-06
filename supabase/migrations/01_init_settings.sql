-- 5. Create Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY,
    pro_seats_total INT NOT NULL,
    pro_seats_remaining INT NOT NULL,
    elite_seats_total INT NOT NULL,
    elite_seats_remaining INT NOT NULL,
    hero_total_return TEXT NOT NULL,
    hero_active_investors TEXT NOT NULL,
    hero_strategies TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Initial Settings
INSERT INTO public.settings (
    id, pro_seats_total, pro_seats_remaining, elite_seats_total, elite_seats_remaining, 
    hero_total_return, hero_active_investors, hero_strategies, updated_at
) VALUES (
    'fallback', 24, 0, 5, 0, '+2,450%', '1,500+', '4', '2026-03-05T13:30:59.978Z'
)
ON CONFLICT (id) DO NOTHING;
