-- ============================================================
-- 🔧 修复询价表权限问题 - QUICK FIX
-- ============================================================
-- 在 Supabase SQL Editor 中运行这个脚本
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql
-- ============================================================

-- 第1步：启用 RLS
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- 第2步：删除所有旧的冲突策略
DROP POLICY IF EXISTS "Public can insert enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Allow all inserts" ON public.enquiries;
DROP POLICY IF EXISTS "anon_insert_enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "authenticated_insert_enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "enable_insert_for_anon" ON public.enquiries;
DROP POLICY IF EXISTS "enable_insert_for_authenticated" ON public.enquiries;
DROP POLICY IF EXISTS "enable_select_for_authenticated" ON public.enquiries;
DROP POLICY IF EXISTS "Authenticated users can select enquiries" ON public.enquiries;

-- 第3步：授予必要的权限
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON TABLE public.enquiries TO anon, authenticated;
GRANT SELECT ON TABLE public.enquiries TO authenticated;

-- 第4步：创建简单的插入策略（允许所有人插入）
CREATE POLICY "allow_anon_insert"
ON public.enquiries
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "allow_authenticated_insert"
ON public.enquiries
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 第5步：创建查询策略（只允许认证用户查询）
CREATE POLICY "allow_authenticated_select"
ON public.enquiries
FOR SELECT
TO authenticated
USING (true);

-- ============================================================
-- 验证配置
-- ============================================================

-- 检查策略
SELECT
    '✅ 策略配置' as check_type,
    policyname,
    roles::text,
    cmd
FROM pg_policies
WHERE tablename = 'enquiries';

-- 检查权限
SELECT
    '✅ 权限配置' as check_type,
    'anon可以插入' as description,
    has_table_privilege('anon', 'public.enquiries', 'INSERT') as result
UNION ALL
SELECT
    '✅ 权限配置',
    'authenticated可以插入',
    has_table_privilege('authenticated', 'public.enquiries', 'INSERT')
UNION ALL
SELECT
    '✅ 权限配置',
    'authenticated可以查询',
    has_table_privilege('authenticated', 'public.enquiries', 'SELECT');

-- 成功提示
SELECT '🎉 修复完成！现在可以提交询价了！' as status;
