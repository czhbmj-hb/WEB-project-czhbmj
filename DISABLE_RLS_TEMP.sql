-- ========================================
-- 临时禁用 RLS - 快速测试方案
-- ========================================
-- 此脚本将临时完全禁用 RLS
-- 用于快速确认是否是 RLS 导致的问题
-- ⚠️ 注意：这会暂时移除所有安全限制！
-- ========================================

-- 检查数据
SELECT '=== 当前数据统计 ===' AS info;
SELECT 'Products' as table_name, COUNT(*) as count FROM products
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Materials', COUNT(*) FROM materials;

-- ========================================
-- 完全禁用 RLS（临时测试）
-- ========================================
SELECT '=== 禁用 RLS ===' AS info;

-- 禁用所有表的 RLS
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries DISABLE ROW LEVEL SECURITY;

-- 验证 RLS 已禁用
SELECT
    tablename,
    rowsecurity as rls_enabled,
    CASE
        WHEN rowsecurity = false THEN '✅ RLS 已禁用'
        ELSE '❌ RLS 仍然启用'
    END as status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('products', 'categories', 'materials', 'enquiries');

-- ========================================
-- 授予公共访问权限
-- ========================================
GRANT ALL ON products TO PUBLIC;
GRANT ALL ON categories TO PUBLIC;
GRANT ALL ON materials TO PUBLIC;
GRANT ALL ON enquiries TO PUBLIC;

-- ========================================
-- 测试访问
-- ========================================
SELECT '=== 测试数据访问 ===' AS info;

-- 显示前3个产品
SELECT id, name, category, material, price, image
FROM products
LIMIT 3;

-- 显示所有分类
SELECT * FROM categories;

-- 显示所有材料
SELECT * FROM materials;

-- ========================================
-- 结果
-- ========================================
SELECT '========================================' AS separator;
SELECT '⚠️ RLS 已临时禁用！' AS warning;
SELECT '✅ 现在应该可以访问所有数据了' AS result;
SELECT '========================================' AS separator;
SELECT '测试步骤：' AS instruction;
SELECT '1. 清除浏览器缓存 (Ctrl+Shift+R)' AS step;
SELECT '2. 刷新网站页面' AS step;
SELECT '3. 查看是否能显示产品' AS step;
SELECT '========================================' AS separator;
SELECT '⚠️ 如果需要重新启用 RLS，运行 FIX_RLS_COMPLETE.sql' AS note;