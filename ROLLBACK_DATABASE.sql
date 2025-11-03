-- ========================================
-- 数据库回退脚本 - 移除多图片功能
-- ========================================
-- 此脚本将数据库还原到单图片模式
-- 请在 Supabase SQL Editor 中执行
-- ========================================

-- ========================================
-- 第一步：备份当前数据（可选）
-- ========================================
-- 如果需要，可以先查看当前的产品数据
SELECT id, name, image, images FROM products LIMIT 5;

-- ========================================
-- 第二步：删除多图片相关的触发器和函数
-- ========================================

-- 删除触发器（如果存在）
DROP TRIGGER IF EXISTS trigger_update_primary_image ON products;

-- 删除函数（如果存在）
DROP FUNCTION IF EXISTS update_primary_image();

-- ========================================
-- 第三步：删除 images 列
-- ========================================

-- 删除 images 列（多图片数组）
ALTER TABLE products DROP COLUMN IF EXISTS images;

-- ========================================
-- 第四步：删除多图片相关约束
-- ========================================

-- 删除最大5张图片的约束（如果存在）
ALTER TABLE products DROP CONSTRAINT IF EXISTS check_max_images;

-- ========================================
-- 第五步：验证还原结果
-- ========================================

-- 检查 products 表结构
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- 确认 images 列已被删除
SELECT
    CASE
        WHEN COUNT(*) = 0 THEN '✅ images 列已成功删除'
        ELSE '❌ images 列仍然存在'
    END as status
FROM information_schema.columns
WHERE table_name = 'products'
AND column_name = 'images';

-- 确认触发器已被删除
SELECT
    CASE
        WHEN COUNT(*) = 0 THEN '✅ 触发器已成功删除'
        ELSE '❌ 触发器仍然存在'
    END as status
FROM information_schema.triggers
WHERE trigger_name = 'trigger_update_primary_image';

-- ========================================
-- 第六步：检查产品数据完整性
-- ========================================

-- 显示产品数量
SELECT COUNT(*) as total_products FROM products;

-- 显示前5个产品，确认单图片字段正常
SELECT
    id,
    name,
    category,
    material,
    price,
    image
FROM products
LIMIT 5;

-- ========================================
-- 完成
-- ========================================
SELECT '========================================' AS separator;
SELECT '✅ 数据库已成功回退到单图片模式！' AS result;
SELECT '✅ 所有多图片相关的功能已移除' AS result;
SELECT '✅ products 表已恢复到原始结构' AS result;
SELECT '========================================' AS separator;