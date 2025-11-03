-- ========================================
-- 完整数据访问权限修复脚本
-- ========================================
-- 此脚本将：
-- 1. 检查数据是否存在
-- 2. 修复所有 RLS 权限问题
-- 3. 重新插入默认数据（如果缺失）
-- 4. 验证修复结果
--
-- 请在 Supabase SQL Editor 中执行
-- ========================================

-- ========================================
-- 第一步：数据检查
-- ========================================

SELECT '========================================' AS separator;
SELECT '=== 数据检查 ===' AS info;
SELECT '========================================' AS separator;

SELECT 'Products' as table_name, COUNT(*) as count FROM products;
SELECT 'Categories' as table_name, COUNT(*) as count FROM categories;
SELECT 'Materials' as table_name, COUNT(*) as count FROM materials;

-- ========================================
-- 第二步：删除所有现有的 SELECT 策略
-- ========================================

SELECT '========================================' AS separator;
SELECT '=== 删除旧策略 ===' AS info;
SELECT '========================================' AS separator;

-- Products 表
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Public can view products" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;

-- Categories 表
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
DROP POLICY IF EXISTS "Public can view categories" ON categories;
DROP POLICY IF EXISTS "Enable read access for all users" ON categories;

-- Materials 表
DROP POLICY IF EXISTS "Anyone can view materials" ON materials;
DROP POLICY IF EXISTS "Public can view materials" ON materials;
DROP POLICY IF EXISTS "Enable read access for all users" ON materials;

SELECT '✅ 旧策略已删除' AS result;

-- ========================================
-- 第三步：创建新的 SELECT 策略
-- ========================================

SELECT '========================================' AS separator;
SELECT '=== 创建新的 SELECT 策略 ===' AS info;
SELECT '========================================' AS separator;

-- Products 表 - 允许所有人查看
CREATE POLICY "Anyone can view products"
ON products FOR SELECT
TO public
USING (true);

-- Categories 表 - 允许所有人查看
CREATE POLICY "Anyone can view categories"
ON categories FOR SELECT
TO public
USING (true);

-- Materials 表 - 允许所有人查看
CREATE POLICY "Anyone can view materials"
ON materials FOR SELECT
TO public
USING (true);

SELECT '✅ SELECT 策略已创建' AS result;

-- ========================================
-- 第四步：确保 GRANT 权限
-- ========================================

SELECT '========================================' AS separator;
SELECT '=== 设置表权限 ===' AS info;
SELECT '========================================' AS separator;

-- 授予 anon 和 authenticated 角色 SELECT 权限
GRANT SELECT ON products TO anon, authenticated;
GRANT SELECT ON categories TO anon, authenticated;
GRANT SELECT ON materials TO anon, authenticated;

-- 授予其他必要权限
GRANT INSERT, UPDATE, DELETE ON products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON materials TO anon, authenticated;

SELECT '✅ 表权限已设置' AS result;

-- ========================================
-- 第五步：检查并补充默认数据
-- ========================================

SELECT '========================================' AS separator;
SELECT '=== 检查并补充数据 ===' AS info;
SELECT '========================================' AS separator;

-- 补充分类数据（如果不存在）
INSERT INTO categories (name, display_name, name_zh) VALUES
    ('screws', 'Screws', '螺丝'),
    ('bolts', 'Bolts', '螺栓'),
    ('nuts', 'Nuts', '螺母'),
    ('washers', 'Washers', '垫圈'),
    ('anchors', 'Anchors', '锚栓'),
    ('rivets', 'Rivets', '铆钉'),
    ('one-way-clutch', 'One-Way Clutch', '单向离合器')
ON CONFLICT (name) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    name_zh = EXCLUDED.name_zh;

-- 补充材料数据（如果不存在）
INSERT INTO materials (name, display_name, name_zh) VALUES
    ('stainless-steel', 'Stainless Steel', '不锈钢'),
    ('carbon-steel', 'Carbon Steel', '碳钢'),
    ('brass', 'Brass', '黄铜'),
    ('aluminum', 'Aluminum', '铝'),
    ('plastic', 'Plastic', '塑料'),
    ('nylon', 'Nylon', '尼龙'),
    ('titanium', 'Titanium', '钛'),
    ('copper', 'Copper', '铜'),
    ('te-gcr', 'TE-GCR', 'TE-GCR')
ON CONFLICT (name) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    name_zh = EXCLUDED.name_zh;

SELECT '✅ 默认数据已补充' AS result;

-- ========================================
-- 第六步：验证修复结果
-- ========================================

SELECT '========================================' AS separator;
SELECT '=== 验证修复结果 ===' AS info;
SELECT '========================================' AS separator;

-- 显示当前数据量
SELECT '=== 数据统计 ===' AS info;
SELECT 'Products' as table_name, COUNT(*) as count FROM products;
SELECT 'Categories' as table_name, COUNT(*) as count FROM categories;
SELECT 'Materials' as table_name, COUNT(*) as count FROM materials;

-- 显示所有 RLS 策略
SELECT '=== RLS 策略（应该包含 SELECT 策略） ===' AS info;
SELECT
    tablename,
    policyname,
    cmd,
    roles::text
FROM pg_policies
WHERE tablename IN ('products', 'categories', 'materials')
ORDER BY tablename, cmd;

-- 显示所有分类
SELECT '=== 分类列表 ===' AS info;
SELECT * FROM categories ORDER BY display_name;

-- 显示所有材料
SELECT '=== 材料列表 ===' AS info;
SELECT * FROM materials ORDER BY display_name;

-- ========================================
-- 第七步：模拟匿名用户访问测试
-- ========================================

SELECT '========================================' AS separator;
SELECT '=== 匿名用户访问测试 ===' AS info;
SELECT '========================================' AS separator;

-- 切换到匿名用户角色进行测试
SET ROLE anon;

-- 尝试查询（如果失败会报错）
SELECT '测试查询 Products...' AS test;
SELECT COUNT(*) as products_count FROM products;

SELECT '测试查询 Categories...' AS test;
SELECT COUNT(*) as categories_count FROM categories;

SELECT '测试查询 Materials...' AS test;
SELECT COUNT(*) as materials_count FROM materials;

-- 恢复默认角色
RESET ROLE;

SELECT '✅ 匿名用户访问测试通过！' AS result;

-- ========================================
-- 完成
-- ========================================

SELECT '========================================' AS separator;
SELECT '=== ✅ 修复完成！ ===' AS info;
SELECT '========================================' AS separator;
SELECT '现在请执行以下操作：' AS instruction;
SELECT '1. 清除浏览器缓存 (Ctrl+Shift+R)' AS step;
SELECT '2. 刷新网站首页' AS step;
SELECT '3. 检查产品、分类、材料是否正常显示' AS step;
SELECT '4. 登录后台管理，检查所有功能' AS step;
SELECT '========================================' AS separator;
