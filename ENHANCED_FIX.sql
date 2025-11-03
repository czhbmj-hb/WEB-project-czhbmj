-- ============================================================
-- 🔧 增强版权限修复 - 解决 401 错误
-- ============================================================

-- 1. 确保 RLS 启用
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- 2. 完全清除旧策略
DO $$
DECLARE r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'enquiries')
    LOOP
        EXECUTE format('DROP POLICY %I ON public.enquiries', r.policyname);
    END LOOP;
END $$;

-- 3. 重新授权（包括序列权限）
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.enquiries TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- 4. 创建最宽松的策略
CREATE POLICY "allow_all_anon"
ON public.enquiries
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "allow_all_authenticated"
ON public.enquiries
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 5. 确保默认值设置
ALTER TABLE public.enquiries
    ALTER COLUMN created_at SET DEFAULT NOW(),
    ALTER COLUMN updated_at SET DEFAULT NOW();

-- 验证
SELECT
    '✅ 配置完成' as 状态,
    COUNT(*) || ' 个策略' as 策略数量
FROM pg_policies
WHERE tablename = 'enquiries';

SELECT
    '✅ 权限验证' as 状态,
    'anon ALL: ' ||
    CASE WHEN has_table_privilege('anon', 'public.enquiries', 'INSERT')
        AND has_table_privilege('anon', 'public.enquiries', 'SELECT')
    THEN '✓' ELSE '✗' END as 结果;
