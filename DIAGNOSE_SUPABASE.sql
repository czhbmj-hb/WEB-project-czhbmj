-- ============================================================
-- 🔍 Supabase 诊断脚本
-- ============================================================
-- 先运行这个脚本，看看当前状态
-- ============================================================

-- 检查1: enquiries 表是否存在
SELECT
    '=== 1️⃣ 表是否存在 ===' as section,
    schemaname,
    tablename,
    tableowner,
    rowsecurity as RLS是否启用
FROM pg_tables
WHERE tablename = 'enquiries';

-- 如果上面没有结果，说明表不存在！需要先创建表

-- 检查2: 表结构
SELECT
    '=== 2️⃣ 表结构 ===' as section,
    column_name as 字段名,
    data_type as 数据类型,
    is_nullable as 可为空
FROM information_schema.columns
WHERE table_name = 'enquiries'
ORDER BY ordinal_position;

-- 检查3: 当前的RLS策略
SELECT
    '=== 3️⃣ 当前策略 ===' as section,
    policyname as 策略名,
    roles::text as 适用角色,
    cmd as 操作类型,
    permissive as 许可类型
FROM pg_policies
WHERE tablename = 'enquiries';

-- 检查4: 权限设置
SELECT
    '=== 4️⃣ 权限检查 ===' as section,
    'anon角色' as 角色,
    'INSERT' as 操作,
    has_table_privilege('anon', 'public.enquiries', 'INSERT') as 是否允许
UNION ALL
SELECT
    '===',
    'anon角色',
    'SELECT',
    has_table_privilege('anon', 'public.enquiries', 'SELECT')
UNION ALL
SELECT
    '===',
    'authenticated角色',
    'INSERT',
    has_table_privilege('authenticated', 'public.enquiries', 'INSERT')
UNION ALL
SELECT
    '===',
    'authenticated角色',
    'SELECT',
    has_table_privilege('authenticated', 'public.enquiries', 'SELECT');

-- 检查5: Schema权限
SELECT
    '=== 5️⃣ Schema权限 ===' as section,
    'anon' as 角色,
    has_schema_privilege('anon', 'public', 'USAGE') as 是否有USAGE权限
UNION ALL
SELECT
    '===',
    'authenticated',
    has_schema_privilege('authenticated', 'public', 'USAGE');

-- 总结
SELECT '✅ 诊断完成！请检查上面的结果' as 状态;
