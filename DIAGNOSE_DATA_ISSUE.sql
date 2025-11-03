-- 数据库诊断脚本
-- 请在 Supabase SQL Editor 中运行此脚本来诊断问题

-- ========================================
-- 1. 检查产品数据
-- ========================================
SELECT
    'Products Count' as check_type,
    COUNT(*) as count
FROM products;

-- 查看前5个产品
SELECT
    id,
    name,
    category,
    material,
    image,
    images
FROM products
LIMIT 5;

-- ========================================
-- 2. 检查分类数据
-- ========================================
SELECT
    'Categories Count' as check_type,
    COUNT(*) as count
FROM categories;

-- 查看所有分类
SELECT * FROM categories;

-- ========================================
-- 3. 检查材料数据
-- ========================================
SELECT
    'Materials Count' as check_type,
    COUNT(*) as count
FROM materials;

-- 查看所有材料
SELECT * FROM materials;

-- ========================================
-- 4. 检查 RLS (Row Level Security) 策略
-- ========================================

-- 检查 products 表的 RLS 策略
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'products';

-- 检查 categories 表的 RLS 策略
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'categories';

-- 检查 materials 表的 RLS 策略
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'materials';

-- ========================================
-- 5. 检查表是否启用了 RLS
-- ========================================
SELECT
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN ('products', 'categories', 'materials');
