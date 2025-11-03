-- RLS 权限修复脚本
-- 此脚本将确保匿名用户可以正确访问所有必要的数据

-- ========================================
-- 1. Products 表 RLS 策略
-- ========================================

-- 删除现有的 SELECT 策略（如果存在）
DROP POLICY IF EXISTS "Anyone can view products" ON products;

-- 创建新的 SELECT 策略
CREATE POLICY "Anyone can view products"
ON products FOR SELECT
TO public
USING (true);

-- 确保 anon 角色可以 SELECT
GRANT SELECT ON products TO anon;
GRANT SELECT ON products TO authenticated;

-- ========================================
-- 2. Categories 表 RLS 策略
-- ========================================

-- 删除现有的 SELECT 策略（如果存在）
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;

-- 创建新的 SELECT 策略
CREATE POLICY "Anyone can view categories"
ON categories FOR SELECT
TO public
USING (true);

-- 确保 anon 角色可以 SELECT
GRANT SELECT ON categories TO anon;
GRANT SELECT ON categories TO authenticated;

-- ========================================
-- 3. Materials 表 RLS 策略
-- ========================================

-- 删除现有的 SELECT 策略（如果存在）
DROP POLICY IF EXISTS "Anyone can view materials" ON materials;

-- 创建新的 SELECT 策略
CREATE POLICY "Anyone can view materials"
ON materials FOR SELECT
TO public
USING (true);

-- 确保 anon 角色可以 SELECT
GRANT SELECT ON materials TO anon;
GRANT SELECT ON materials TO authenticated;

-- ========================================
-- 4. Enquiries 表 RLS 策略（如果需要）
-- ========================================

-- 删除现有的 INSERT 策略（如果存在）
DROP POLICY IF EXISTS "Anyone can insert enquiries" ON enquiries;

-- 创建新的 INSERT 策略
CREATE POLICY "Anyone can insert enquiries"
ON enquiries FOR INSERT
TO public
WITH CHECK (true);

-- 确保 anon 角色可以 INSERT
GRANT INSERT ON enquiries TO anon;
GRANT INSERT ON enquiries TO authenticated;

-- ========================================
-- 验证策略已创建
-- ========================================

SELECT
    tablename,
    policyname,
    cmd,
    roles
FROM pg_policies
WHERE tablename IN ('products', 'categories', 'materials', 'enquiries')
ORDER BY tablename, cmd;
