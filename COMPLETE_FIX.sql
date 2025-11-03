-- ============================================================
-- 🔧 完整修复脚本 - 包含创建表 + 权限配置
-- ============================================================
-- 这个脚本会：
-- 1. 创建 enquiries 表（如果不存在）
-- 2. 配置所有必要的权限
-- 3. 验证配置
-- ============================================================

-- 第1步：创建 enquiries 表（如果不存在）
CREATE TABLE IF NOT EXISTS public.enquiries (
    id BIGSERIAL PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    company_name TEXT,
    customer_address TEXT,
    products JSONB NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 第2步：启用 RLS
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- 第3步：删除所有旧策略（防止冲突）
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'enquiries'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.enquiries', r.policyname);
    END LOOP;
END $$;

-- 第4步：授予必要权限
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT INSERT ON TABLE public.enquiries TO anon, authenticated;
GRANT SELECT ON TABLE public.enquiries TO authenticated, service_role;
GRANT ALL ON TABLE public.enquiries TO service_role;

-- 第5步：创建新策略
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

CREATE POLICY "allow_authenticated_select"
ON public.enquiries
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "allow_service_role_all"
ON public.enquiries
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================
-- 验证配置
-- ============================================================

-- 验证1: 表是否存在
SELECT
    '✅ 步骤1: 表检查' as 步骤,
    CASE WHEN EXISTS (
        SELECT 1 FROM pg_tables
        WHERE schemaname = 'public' AND tablename = 'enquiries'
    ) THEN '✓ enquiries表存在'
    ELSE '✗ 表不存在' END as 结果;

-- 验证2: RLS是否启用
SELECT
    '✅ 步骤2: RLS检查' as 步骤,
    CASE WHEN rowsecurity THEN '✓ RLS已启用'
    ELSE '✗ RLS未启用' END as 结果
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'enquiries';

-- 验证3: 策略数量
SELECT
    '✅ 步骤3: 策略检查' as 步骤,
    COUNT(*)::text || ' 个策略已创建' as 结果
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'enquiries';

-- 验证4: 详细策略
SELECT
    '✅ 步骤4: 策略详情' as 步骤,
    policyname as 策略名,
    roles::text as 角色,
    cmd as 操作
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'enquiries'
ORDER BY policyname;

-- 验证5: 权限检查
SELECT
    '✅ 步骤5: 权限验证' as 步骤,
    'anon INSERT' as 检查项,
    CASE WHEN has_table_privilege('anon', 'public.enquiries', 'INSERT')
        THEN '✓ 允许' ELSE '✗ 拒绝' END as 结果
UNION ALL
SELECT
    '✅',
    'authenticated INSERT',
    CASE WHEN has_table_privilege('authenticated', 'public.enquiries', 'INSERT')
        THEN '✓ 允许' ELSE '✗ 拒绝' END
UNION ALL
SELECT
    '✅',
    'authenticated SELECT',
    CASE WHEN has_table_privilege('authenticated', 'public.enquiries', 'SELECT')
        THEN '✓ 允许' ELSE '✗ 拒绝' END;

-- 最终测试: 尝试插入一条测试数据
DO $$
BEGIN
    -- 设置为 anon 角色
    SET LOCAL ROLE anon;

    -- 尝试插入
    INSERT INTO public.enquiries (
        customer_name,
        customer_email,
        customer_phone,
        products
    ) VALUES (
        'SQL测试用户',
        'sqltest@example.com',
        '0400000000',
        '[{"name":"测试产品","quantity":1}]'::jsonb
    );

    RAISE NOTICE '✓ 测试插入成功！';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '✗ 测试插入失败: %', SQLERRM;
END $$;

-- 成功消息
SELECT '🎉 修复完成！现在可以提交询价了！' as 最终状态;
SELECT '📝 如果所有验证都显示 ✓ 则配置正确' as 提示;
