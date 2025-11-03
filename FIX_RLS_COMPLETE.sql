-- ========================================
-- 完整的 RLS 权限修复脚本
-- ========================================
-- 此脚本将彻底修复所有表的 RLS 权限问题
-- 确保匿名用户可以正确访问数据
-- ========================================

-- ========================================
-- 第一步：检查当前数据状态
-- ========================================
SELECT '=== 数据检查 ===' AS info;
SELECT 'Products' as table_name, COUNT(*) as count FROM products
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Materials', COUNT(*) FROM materials;

-- ========================================
-- 第二步：检查 RLS 是否启用
-- ========================================
SELECT '=== RLS 状态 ===' AS info;
SELECT
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('products', 'categories', 'materials');

-- ========================================
-- 第三步：删除所有现有的 RLS 策略
-- ========================================
SELECT '=== 删除所有旧策略 ===' AS info;

-- Products 表的所有策略
DO $$
DECLARE
    policy_rec RECORD;
BEGIN
    FOR policy_rec IN
        SELECT policyname
        FROM pg_policies
        WHERE tablename = 'products'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON products', policy_rec.policyname);
        RAISE NOTICE '删除策略: %', policy_rec.policyname;
    END LOOP;
END $$;

-- Categories 表的所有策略
DO $$
DECLARE
    policy_rec RECORD;
BEGIN
    FOR policy_rec IN
        SELECT policyname
        FROM pg_policies
        WHERE tablename = 'categories'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON categories', policy_rec.policyname);
        RAISE NOTICE '删除策略: %', policy_rec.policyname;
    END LOOP;
END $$;

-- Materials 表的所有策略
DO $$
DECLARE
    policy_rec RECORD;
BEGIN
    FOR policy_rec IN
        SELECT policyname
        FROM pg_policies
        WHERE tablename = 'materials'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON materials', policy_rec.policyname);
        RAISE NOTICE '删除策略: %', policy_rec.policyname;
    END LOOP;
END $$;

-- ========================================
-- 第四步：暂时禁用 RLS（核心步骤）
-- ========================================
SELECT '=== 暂时禁用 RLS ===' AS info;

ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE materials DISABLE ROW LEVEL SECURITY;

-- ========================================
-- 第五步：重新启用 RLS
-- ========================================
SELECT '=== 重新启用 RLS ===' AS info;

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 第六步：创建新的宽松策略
-- ========================================
SELECT '=== 创建新的 RLS 策略 ===' AS info;

-- Products - 允许所有人查看
CREATE POLICY "Enable read access for all users"
ON products FOR SELECT
USING (true);

-- Products - 允许所有人插入（后台管理）
CREATE POLICY "Enable insert for all users"
ON products FOR INSERT
WITH CHECK (true);

-- Products - 允许所有人更新（后台管理）
CREATE POLICY "Enable update for all users"
ON products FOR UPDATE
USING (true)
WITH CHECK (true);

-- Products - 允许所有人删除（后台管理）
CREATE POLICY "Enable delete for all users"
ON products FOR DELETE
USING (true);

-- Categories - 允许所有人查看
CREATE POLICY "Enable read access for all users"
ON categories FOR SELECT
USING (true);

-- Categories - 允许所有人管理
CREATE POLICY "Enable insert for all users"
ON categories FOR INSERT
WITH CHECK (true);

CREATE POLICY "Enable update for all users"
ON categories FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for all users"
ON categories FOR DELETE
USING (true);

-- Materials - 允许所有人查看
CREATE POLICY "Enable read access for all users"
ON materials FOR SELECT
USING (true);

-- Materials - 允许所有人管理
CREATE POLICY "Enable insert for all users"
ON materials FOR INSERT
WITH CHECK (true);

CREATE POLICY "Enable update for all users"
ON materials FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for all users"
ON materials FOR DELETE
USING (true);

-- ========================================
-- 第七步：授予必要的权限
-- ========================================
SELECT '=== 授予表权限 ===' AS info;

-- 授予 anon 角色权限
GRANT SELECT ON products TO anon;
GRANT INSERT, UPDATE, DELETE ON products TO anon;

GRANT SELECT ON categories TO anon;
GRANT INSERT, UPDATE, DELETE ON categories TO anon;

GRANT SELECT ON materials TO anon;
GRANT INSERT, UPDATE, DELETE ON materials TO anon;

-- 授予 authenticated 角色权限
GRANT SELECT ON products TO authenticated;
GRANT INSERT, UPDATE, DELETE ON products TO authenticated;

GRANT SELECT ON categories TO authenticated;
GRANT INSERT, UPDATE, DELETE ON categories TO authenticated;

GRANT SELECT ON materials TO authenticated;
GRANT INSERT, UPDATE, DELETE ON materials TO authenticated;

-- 授予 public 权限（包含 anon）
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- ========================================
-- 第八步：测试匿名用户访问
-- ========================================
SELECT '=== 测试匿名用户访问 ===' AS info;

-- 切换到匿名用户角色
SET ROLE anon;

-- 测试查询
SELECT 'Testing Products...' as test;
SELECT COUNT(*) as products_count FROM products;

SELECT 'Testing Categories...' as test;
SELECT COUNT(*) as categories_count FROM categories;

SELECT 'Testing Materials...' as test;
SELECT COUNT(*) as materials_count FROM materials;

-- 显示前3个产品
SELECT 'First 3 Products:' as test;
SELECT id, name, category, material, price FROM products LIMIT 3;

-- 恢复角色
RESET ROLE;

-- ========================================
-- 第九步：显示最终状态
-- ========================================
SELECT '=== 最终验证 ===' AS info;

-- 显示当前的 RLS 策略
SELECT
    tablename,
    policyname,
    cmd,
    roles::text
FROM pg_policies
WHERE tablename IN ('products', 'categories', 'materials')
ORDER BY tablename, cmd;

-- 显示数据统计
SELECT '=== 数据统计 ===' AS info;
SELECT 'Products' as table_name, COUNT(*) as count FROM products
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Materials', COUNT(*) FROM materials;

-- ========================================
-- 完成
-- ========================================
SELECT '========================================' AS separator;
SELECT '✅ RLS 权限修复完成！' AS result;
SELECT '✅ 所有表都已设置正确的 SELECT 策略' AS result;
SELECT '✅ anon 角色已获得必要权限' AS result;
SELECT '✅ 匿名用户现在应该可以访问数据了' AS result;
SELECT '========================================' AS separator;
SELECT '请清除浏览器缓存并刷新页面 (Ctrl+Shift+R)' AS instruction;