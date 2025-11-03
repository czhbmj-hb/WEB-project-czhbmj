-- ============================================================
-- 🔧 最终修复脚本 - 解决 42501 权限错误
-- ============================================================
-- 这个脚本必须在 Supabase SQL Editor 中执行
-- ============================================================

-- 步骤1: 完全禁用 RLS（临时测试）
ALTER TABLE public.enquiries DISABLE ROW LEVEL SECURITY;

-- 步骤2: 删除所有现有策略
DROP POLICY IF EXISTS "allow_anon_insert" ON public.enquiries;
DROP POLICY IF EXISTS "allow_authenticated_insert" ON public.enquiries;
DROP POLICY IF EXISTS "allow_authenticated_select" ON public.enquiries;
DROP POLICY IF EXISTS "allow_service_role_all" ON public.enquiries;
DROP POLICY IF EXISTS "allow_all_anon" ON public.enquiries;
DROP POLICY IF EXISTS "allow_all_authenticated" ON public.enquiries;
DROP POLICY IF EXISTS "Enable insert for anon users" ON public.enquiries;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.enquiries;

-- 步骤3: 授予完整权限给 anon 角色
GRANT ALL ON public.enquiries TO anon;
GRANT ALL ON public.enquiries TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 步骤4: 授予序列权限
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 步骤5: 重新启用 RLS
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- 步骤6: 创建最简单的策略（允许所有操作）
CREATE POLICY "allow_all_operations"
ON public.enquiries
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- 验证
SELECT
    '✅ RLS 状态' as 检查项,
    CASE WHEN rowsecurity THEN '已启用' ELSE '未启用' END as 结果
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'enquiries';

SELECT
    '✅ 策略列表' as 检查项,
    policyname as 策略名,
    roles::text as 角色,
    cmd as 操作
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'enquiries';

SELECT
    '✅ anon权限' as 检查项,
    'INSERT: ' || CASE WHEN has_table_privilege('anon', 'public.enquiries', 'INSERT')
        THEN '✓' ELSE '✗' END ||
    ' SELECT: ' || CASE WHEN has_table_privilege('anon', 'public.enquiries', 'SELECT')
        THEN '✓' ELSE '✗' END as 结果;
