-- 快速检查数据和权限

-- 1. 检查数据数量
SELECT 'Products' as table_name, COUNT(*) as count FROM products
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Materials', COUNT(*) FROM materials;

-- 2. 查看前5个产品
SELECT * FROM products LIMIT 5;

-- 3. 查看所有分类
SELECT * FROM categories;

-- 4. 查看所有材料
SELECT * FROM materials;

-- 5. 检查RLS是否启用
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('products', 'categories', 'materials');

-- 6. 检查当前的RLS策略
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('products', 'categories', 'materials')
ORDER BY tablename, cmd;