-- ========================================
-- 综合诊断和修复脚本
-- ========================================

-- ========================================
-- 第一部分：诊断
-- ========================================

-- 1. 检查表结构
SELECT '=== Products 表结构 ===' AS info;
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- 2. 检查是否有 description_zh 字段
SELECT
    CASE
        WHEN COUNT(*) > 0 THEN '✅ description_zh 字段存在'
        ELSE '❌ 缺少 description_zh 字段'
    END as status
FROM information_schema.columns
WHERE table_name = 'products'
AND column_name = 'description_zh';

-- 3. 检查是否有 name_zh 字段在 categories 和 materials
SELECT
    'categories' as table_name,
    CASE
        WHEN COUNT(*) > 0 THEN '✅ name_zh 字段存在'
        ELSE '❌ 缺少 name_zh 字段'
    END as status
FROM information_schema.columns
WHERE table_name = 'categories'
AND column_name = 'name_zh'
UNION ALL
SELECT
    'materials' as table_name,
    CASE
        WHEN COUNT(*) > 0 THEN '✅ name_zh 字段存在'
        ELSE '❌ 缺少 name_zh 字段'
    END as status
FROM information_schema.columns
WHERE table_name = 'materials'
AND column_name = 'name_zh';

-- ========================================
-- 第二部分：添加缺失字段
-- ========================================

-- 添加 description_zh 到 products（如果不存在）
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'products'
        AND column_name = 'description_zh'
    ) THEN
        ALTER TABLE products ADD COLUMN description_zh TEXT;
        RAISE NOTICE '✅ 添加了 description_zh 字段';
    ELSE
        RAISE NOTICE '⚠️ description_zh 字段已存在';
    END IF;
END $$;

-- 添加 name_zh 到 categories（如果不存在）
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'categories'
        AND column_name = 'name_zh'
    ) THEN
        ALTER TABLE categories ADD COLUMN name_zh TEXT;
        RAISE NOTICE '✅ 添加了 categories.name_zh 字段';
    ELSE
        RAISE NOTICE '⚠️ categories.name_zh 字段已存在';
    END IF;
END $$;

-- 添加 name_zh 到 materials（如果不存在）
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'materials'
        AND column_name = 'name_zh'
    ) THEN
        ALTER TABLE materials ADD COLUMN name_zh TEXT;
        RAISE NOTICE '✅ 添加了 materials.name_zh 字段';
    ELSE
        RAISE NOTICE '⚠️ materials.name_zh 字段已存在';
    END IF;
END $$;

-- ========================================
-- 第三部分：更新中文数据
-- ========================================

-- 更新分类的中文名称
UPDATE categories SET name_zh = CASE name
    WHEN 'screws' THEN '螺丝'
    WHEN 'bolts' THEN '螺栓'
    WHEN 'nuts' THEN '螺母'
    WHEN 'washers' THEN '垫圈'
    WHEN 'anchors' THEN '锚栓'
    WHEN 'rivets' THEN '铆钉'
    WHEN 'one-way-clutch' THEN '单向离合器'
    ELSE name
END
WHERE name_zh IS NULL;

-- 更新材料的中文名称
UPDATE materials SET name_zh = CASE name
    WHEN 'stainless-steel' THEN '不锈钢'
    WHEN 'carbon-steel' THEN '碳钢'
    WHEN 'brass' THEN '黄铜'
    WHEN 'aluminum' THEN '铝'
    WHEN 'plastic' THEN '塑料'
    WHEN 'rubber' THEN '橡胶'
    WHEN 'nylon' THEN '尼龙'
    WHEN 'titanium' THEN '钛'
    WHEN 'copper' THEN '铜'
    WHEN 'te-gcr' THEN 'TE-GCR'
    ELSE name
END
WHERE name_zh IS NULL;

-- ========================================
-- 第四部分：完全重置 RLS
-- ========================================

-- 删除所有 RLS 策略
DO $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN
        SELECT tablename, policyname
        FROM pg_policies
        WHERE tablename IN ('products', 'categories', 'materials')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', rec.policyname, rec.tablename);
    END LOOP;
END $$;

-- 禁用再启用 RLS
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE materials DISABLE ROW LEVEL SECURITY;

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- 创建简单的 SELECT 策略
CREATE POLICY "public_read" ON products FOR SELECT USING (true);
CREATE POLICY "public_insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update" ON products FOR UPDATE USING (true);
CREATE POLICY "public_delete" ON products FOR DELETE USING (true);

CREATE POLICY "public_read" ON categories FOR SELECT USING (true);
CREATE POLICY "public_insert" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update" ON categories FOR UPDATE USING (true);
CREATE POLICY "public_delete" ON categories FOR DELETE USING (true);

CREATE POLICY "public_read" ON materials FOR SELECT USING (true);
CREATE POLICY "public_insert" ON materials FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update" ON materials FOR UPDATE USING (true);
CREATE POLICY "public_delete" ON materials FOR DELETE USING (true);

-- 授予权限
GRANT ALL ON products TO anon, authenticated;
GRANT ALL ON categories TO anon, authenticated;
GRANT ALL ON materials TO anon, authenticated;

-- ========================================
-- 第五部分：最终测试
-- ========================================

-- 模拟匿名用户
SET ROLE anon;

SELECT '=== 匿名用户测试 ===' AS info;
SELECT COUNT(*) as products_count FROM products;
SELECT COUNT(*) as categories_count FROM categories;
SELECT COUNT(*) as materials_count FROM materials;

-- 测试具体查询
SELECT '=== 测试产品查询 ===' AS info;
SELECT id, name, category, material, price FROM products LIMIT 3;

SELECT '=== 测试分类查询 ===' AS info;
SELECT * FROM categories;

SELECT '=== 测试材料查询 ===' AS info;
SELECT * FROM materials;

RESET ROLE;

-- ========================================
-- 完成
-- ========================================
SELECT '========================================' AS separator;
SELECT '✅ 所有检查和修复完成！' AS result;
SELECT '✅ 字段已补齐' AS result;
SELECT '✅ RLS 策略已重置' AS result;
SELECT '✅ 权限已正确设置' AS result;
SELECT '========================================' AS separator;