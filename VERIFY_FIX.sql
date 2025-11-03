-- ============================================================
-- 🔍 验证修复是否成功
-- ============================================================
-- 运行这个查询，看看配置是否正确
-- ============================================================

-- 1. 检查表是否存在
SELECT
    '1️⃣ 表是否存在' as 检查项,
    CASE WHEN EXISTS (
        SELECT 1 FROM pg_tables
        WHERE schemaname = 'public' AND tablename = 'enquiries'
    ) THEN '✅ 存在' ELSE '❌ 不存在' END as 结果;

-- 2. 检查 RLS 是否启用
SELECT
    '2️⃣ RLS是否启用' as 检查项,
    CASE WHEN rowsecurity THEN '✅ 已启用' ELSE '❌ 未启用' END as 结果
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'enquiries';

-- 3. 检查策略
SELECT
    '3️⃣ 策略配置' as 检查项,
    COUNT(*)::text || ' 个策略' as 结果
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'enquiries';

-- 4. 列出所有策略
SELECT
    '4️⃣ 策略详情' as 检查项,
    policyname as 策略名,
    roles::text as 角色,
    cmd as 操作类型
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'enquiries';

-- 5. 检查 anon 权限
SELECT
    '5️⃣ anon权限' as 检查项,
    'INSERT: ' || CASE WHEN has_table_privilege('anon', 'public.enquiries', 'INSERT')
        THEN '✅' ELSE '❌' END ||
    ' SELECT: ' || CASE WHEN has_table_privilege('anon', 'public.enquiries', 'SELECT')
        THEN '✅' ELSE '❌' END as 结果;

-- 6. 尝试作为 anon 插入
DO $$
BEGIN
    SET LOCAL ROLE anon;

    INSERT INTO public.enquiries (
        customer_name,
        customer_email,
        customer_phone,
        products
    ) VALUES (
        '验证测试',
        'verify@test.com',
        '1234567890',
        '[]'::jsonb
    );

    RAISE NOTICE '6️⃣ anon插入测试: ✅ 成功';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '6️⃣ anon插入测试: ❌ 失败 - %', SQLERRM;
END $$;

RESET ROLE;

-- 显示最终结果
SELECT '==== 检查完成 ====' as 提示;
