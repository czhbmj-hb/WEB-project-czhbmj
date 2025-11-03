-- ========================================
-- 插入默认数据脚本
-- ========================================

-- 1. 首先确保分类存在
INSERT INTO categories (name, display_name, name_zh) VALUES
    ('screws', 'Screws', '螺丝'),
    ('bolts', 'Bolts', '螺栓'),
    ('nuts', 'Nuts', '螺母'),
    ('washers', 'Washers', '垫圈'),
    ('anchors', 'Anchors', '锚栓'),
    ('rivets', 'Rivets', '铆钉'),
    ('one-way-clutch', 'One-Way Clutch', '单向离合器')
ON CONFLICT (name) DO NOTHING;

-- 2. 确保材料存在
INSERT INTO materials (name, display_name, name_zh) VALUES
    ('stainless-steel', 'Stainless Steel', '不锈钢'),
    ('carbon-steel', 'Carbon Steel', '碳钢'),
    ('brass', 'Brass', '黄铜'),
    ('aluminum', 'Aluminum', '铝'),
    ('plastic', 'Plastic', '塑料'),
    ('nylon', 'Nylon', '尼龙'),
    ('titanium', 'Titanium', '钛'),
    ('copper', 'Copper', '铜')
ON CONFLICT (name) DO NOTHING;

-- 3. 插入示例产品数据（如果没有产品的话）
DO $$
BEGIN
    -- 只有在没有产品的情况下才插入
    IF NOT EXISTS (SELECT 1 FROM products LIMIT 1) THEN
        INSERT INTO products (name, category, material, price, size, image, description, description_zh) VALUES
        -- Screws
        ('Stainless Steel Phillips Head Screw', 'screws', 'stainless-steel', 0.15, 'M6 x 40mm',
         'https://images.unsplash.com/photo-1615733487868-c5d05d1c5d39?w=400&h=400&fit=crop',
         'High-quality stainless steel Phillips head screws, corrosion-resistant and suitable for both indoor and outdoor applications.',
         '高品质不锈钢十字槽头螺钉，耐腐蚀，适用于室内外应用。'),

        ('Zinc Plated Wood Screw', 'screws', 'carbon-steel', 0.08, '#8 x 1.5"',
         'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=400&h=400&fit=crop',
         'Durable wood screws with zinc plating for enhanced corrosion resistance. Perfect for carpentry and woodworking projects.',
         '耐用的镀锌木螺钉，增强耐腐蚀性。非常适合木工项目。'),

        ('Black Oxide Machine Screw', 'screws', 'carbon-steel', 0.12, 'M5 x 30mm',
         'https://images.unsplash.com/photo-1598659003036-f29a25efb6b5?w=400&h=400&fit=crop',
         'Precision machine screws with black oxide finish. Ideal for mechanical assemblies and equipment manufacturing.',
         '黑氧化处理的精密机械螺钉。适用于机械装配和设备制造。'),

        -- Bolts
        ('Hex Head Bolt Grade 8.8', 'bolts', 'carbon-steel', 0.35, 'M10 x 60mm',
         'https://images.unsplash.com/photo-1504326046-fa3bcc4c3461?w=400&h=400&fit=crop',
         'High-strength hex head bolts rated Grade 8.8. Suitable for structural applications requiring reliable fastening.',
         '8.8级高强度六角头螺栓。适用于需要可靠紧固的结构应用。'),

        ('Stainless Steel Carriage Bolt', 'bolts', 'stainless-steel', 0.42, 'M8 x 50mm',
         'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop',
         'Smooth dome head carriage bolts in stainless steel. Perfect for wood-to-wood or wood-to-metal connections.',
         '不锈钢光滑圆头马车螺栓。非常适合木对木或木对金属连接。'),

        -- Nuts
        ('Hex Nut Grade A', 'nuts', 'carbon-steel', 0.05, 'M10',
         'https://images.unsplash.com/photo-1599932193825-8c13cc8e5b3b?w=400&h=400&fit=crop',
         'Standard hex nuts with zinc plating. Compatible with metric bolts for general fastening applications.',
         '标准镀锌六角螺母。与公制螺栓兼容，用于一般紧固应用。'),

        ('Stainless Steel Lock Nut', 'nuts', 'stainless-steel', 0.18, 'M8',
         'https://images.unsplash.com/photo-1593115057582-0bc2316d050e?w=400&h=400&fit=crop',
         'Self-locking nuts with nylon insert to prevent loosening from vibration. Marine-grade stainless steel.',
         '带尼龙嵌件的自锁螺母，防止振动松动。海洋级不锈钢。'),

        -- Washers
        ('Flat Washer Stainless', 'washers', 'stainless-steel', 0.03, 'M10',
         'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop&contrast=20',
         'Standard flat washers to distribute load and protect surfaces. Corrosion-resistant stainless steel.',
         '标准平垫圈，用于分散负载和保护表面。耐腐蚀不锈钢。'),

        ('Spring Lock Washer', 'washers', 'carbon-steel', 0.04, 'M8',
         'https://images.unsplash.com/photo-1587653915936-5623ea0b949a?w=400&h=400&fit=crop&contrast=30',
         'Split ring spring washers to prevent loosening under vibration. Zinc-plated for corrosion resistance.',
         '开口弹簧垫圈，防止振动下松动。镀锌防腐蚀。'),

        -- Anchors
        ('Concrete Wedge Anchor', 'anchors', 'carbon-steel', 0.65, 'M12 x 100mm',
         'https://images.unsplash.com/photo-1504326046-fa3bcc4c3461?w=400&h=400&fit=crop&brightness=-10',
         'Heavy-duty wedge anchors for concrete and masonry. Provides high pull-out and shear strength.',
         '用于混凝土和砌体的重型楔形锚栓。提供高拉拔和剪切强度。'),

        ('Plastic Wall Anchor', 'anchors', 'nylon', 0.08, '#10 x 1"',
         'https://images.unsplash.com/photo-1615733487868-c5d05d1c5d39?w=400&h=400&fit=crop&hue=210',
         'Ribbed plastic anchors for drywall and hollow walls. Easy installation for light to medium loads.',
         '用于石膏板和空心墙的带肋塑料锚栓。易于安装，适用于轻中型负载。'),

        -- Rivets
        ('Aluminum Pop Rivet', 'rivets', 'aluminum', 0.12, '1/8" x 1/4"',
         'https://images.unsplash.com/photo-1599932193825-8c13cc8e5b3b?w=400&h=400&fit=crop&brightness=10',
         'Standard blind rivets in aluminum. Quick installation for joining thin sheet materials.',
         '标准铝制盲铆钉。快速安装，用于连接薄板材料。'),

        ('Stainless Steel Rivet', 'rivets', 'stainless-steel', 0.18, '3/16" x 1/2"',
         'https://images.unsplash.com/photo-1593115057582-0bc2316d050e?w=400&h=400&fit=crop&brightness=-5',
         'Corrosion-resistant stainless steel rivets. Perfect for marine, food service, and outdoor applications.',
         '耐腐蚀不锈钢铆钉。非常适合海洋、食品服务和户外应用。'),

        -- One-Way Clutch
        ('One-Way Clutch Bearing', 'one-way-clutch', 'carbon-steel', 25.50, '30mm ID x 62mm OD',
         'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop',
         'High-precision one-way clutch bearing for industrial applications. Allows rotation in one direction only.',
         '工业应用的高精度单向离合器轴承。仅允许单向旋转。'),

        ('Mini One-Way Clutch', 'one-way-clutch', 'stainless-steel', 12.75, '10mm ID x 26mm OD',
         'https://images.unsplash.com/photo-1587653915936-5623ea0b949a?w=400&h=400&fit=crop',
         'Compact one-way clutch for small machinery and precision equipment.',
         '用于小型机械和精密设备的紧凑型单向离合器。');

        RAISE NOTICE '✅ 插入了 15 个示例产品';
    ELSE
        RAISE NOTICE '⚠️ 产品表中已有数据，跳过插入';
    END IF;
END $$;

-- 4. 为产品添加多图片数据（如果需要）
UPDATE products
SET images = jsonb_build_array(
    jsonb_build_object(
        'url', image,
        'order', 0,
        'is_primary', true
    )
)
WHERE images IS NULL OR images = '[]'::jsonb;

-- 5. 验证数据
SELECT '========================================' AS separator;
SELECT 'Products' as table_name, COUNT(*) as count FROM products
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Materials', COUNT(*) FROM materials;

SELECT '✅ 数据插入完成！' AS result;