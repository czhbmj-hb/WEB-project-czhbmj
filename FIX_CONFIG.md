# 修复 Supabase 配置

## 步骤 1：获取正确的 API Keys

1. 打开 [Supabase Dashboard](https://supabase.com/dashboard/project/zoxjvuafzkymgxmsluif)
2. 点击左侧菜单 **Settings**
3. 点击 **API**
4. 复制以下两个值：
   - **URL**: `https://zoxjvuafzkymgxmsluif.supabase.co` （这个应该是正确的）
   - **anon public**: 一个很长的字符串，通常以 `eyJ` 开头

## 步骤 2：更新 config.js

打开 `config.js` 文件，更新第 9 行的 anonKey：

```javascript
anonKey: window.ENV?.SUPABASE_ANON_KEY || 'YOUR_ACTUAL_ANON_KEY_HERE'
```

替换 `YOUR_ACTUAL_ANON_KEY_HERE` 为从 Supabase 复制的实际 anon key。

## 步骤 3：验证

1. 保存文件
2. 刷新网站（Ctrl+Shift+R）
3. 打开浏览器控制台（F12）
4. 查看是否有错误信息

## 如果还是没有数据

执行 `INSERT_DEFAULT_DATA.sql` 来插入示例产品：

1. 在 Supabase SQL Editor 中
2. 运行 `INSERT_DEFAULT_DATA.sql`
3. 这会插入 15 个示例产品

## 检查清单

- [ ] Supabase URL 正确（应该是 `https://zoxjvuafzkymgxmsluif.supabase.co`）
- [ ] Anon Key 是完整的（200+ 字符，以 `eyJ` 开头）
- [ ] 数据库中有产品数据（运行 QUICK_CHECK.sql 验证）
- [ ] RLS 策略正确配置（已经修复）
- [ ] 浏览器缓存已清除（Ctrl+Shift+R）