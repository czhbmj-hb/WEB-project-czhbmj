# Vercel 环境变量配置检查 / Vercel Environment Variables Setup

## ⚠️ 重要提醒 / Important Notice

由于 `.env` 文件不会提交到 Git 仓库，您需要在 Vercel Dashboard 中手动配置环境变量。

Since `.env` files are not committed to Git, you need to manually configure environment variables in Vercel Dashboard.

---

## 📋 需要配置的项目 / Projects to Configure

### 1️⃣ email-server-naxiwell（邮件服务器）

**访问路径 / Access Path:**
1. 登录 Vercel Dashboard: https://vercel.com
2. 选择项目: `email-server-naxiwell`
3. 进入: Settings → Environment Variables

**必需的环境变量 / Required Environment Variables:**

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `SMTP_HOST` | `smtp.gmail.com` | SMTP 服务器地址 |
| `SMTP_PORT` | `465` | SMTP 端口 |
| `SMTP_SECURE` | `true` | 使用 SSL/TLS |
| `SMTP_USER` | `czhbmj@gmail.com` | 发件邮箱 |
| `SMTP_PASS` | `vppynckowzzftoup` | Gmail 应用专用密码 |
| **`RECIPIENT_EMAIL`** | **`zhangyanbin_1@hotmail.com`** | **✅ 生产环境收件邮箱** |
| `CC_EMAIL` | _(留空)_ | 抄送邮箱（可选） |

**⚠️ 重点检查 / Key Verification:**
- 确认 `RECIPIENT_EMAIL` 已更新为 **`zhangyanbin_1@hotmail.com`**
- 如果仍然是 `stickypoooop@gmail.com`，请立即更新！

---

### 2️⃣ web-project-czhbmj（主网站）

**访问路径 / Access Path:**
1. 登录 Vercel Dashboard: https://vercel.com
2. 选择项目: `web-project-czhbmj`
3. 进入: Settings → Environment Variables

**可选的环境变量 / Optional Environment Variables:**

| 变量名 | 当前默认值 | 说明 |
|--------|----------|------|
| `SUPABASE_URL` | `https://zoxjvuafzkymgxmsluif.supabase.co` | Supabase 项目 URL（代码中有默认值） |
| `SUPABASE_ANON_KEY` | `sb_publishable_hhkTjQk3DNoPByMWbUUWvg_u-fACZ7_` | Supabase 匿名密钥（代码中有默认值） |
| `ADMIN_KEY` | `12345678901234567890123456789012` | 管理员密钥（代码中有默认值） |

**注意 / Note:**
- 这些变量在 `config.js` 中都有默认值，无需配置也能正常运行
- 如果需要覆盖默认值，可以在 Vercel 中设置

---

## ✅ 验证步骤 / Verification Steps

### 1. 检查环境变量 / Check Environment Variables

1. 登录 Vercel Dashboard
2. 进入 `email-server-naxiwell` 项目
3. 查看 Settings → Environment Variables
4. **确认 `RECIPIENT_EMAIL = zhangyanbin_1@hotmail.com`**

### 2. 触发重新部署 / Trigger Redeployment

**方法 A：自动部署（推荐）**
- 当 Git push 到 GitHub 时，Vercel 会自动部署
- 当前已推送的 commit 会自动部署

**方法 B：手动重新部署**
1. 进入 `email-server-naxiwell` 项目
2. 进入 Deployments 标签
3. 点击最新部署右侧的 "..." 菜单
4. 选择 "Redeploy"

### 3. 验证配置是否生效 / Verify Configuration

**测试方法（不发送真实邮件）：**

1. **检查部署日志**：
   - 进入 Vercel Deployments
   - 查看最新部署的 "Build Logs"
   - 确认没有环境变量相关的错误

2. **检查 Runtime Logs**（可选）：
   - 进入项目 → Deployments → 点击最新部署
   - 查看 "Functions" 标签
   - 查看 `/api/send-email` 的日志（如果有调用）

---

## 🔧 如果需要更新环境变量 / If You Need to Update Variables

1. 进入 Vercel Dashboard
2. 选择项目: `email-server-naxiwell`
3. Settings → Environment Variables
4. 找到 `RECIPIENT_EMAIL`
5. 点击 "Edit" 编辑
6. 将值改为: `zhangyanbin_1@hotmail.com`
7. 保存后，**必须重新部署**才能生效

---

## 📌 当前状态 / Current Status

- ✅ 本地 `emailServer/.env` 已更新为生产邮箱
- ✅ `script.js` 错误消息中的邮箱已更新
- ⚠️ **需要验证** Vercel 环境变量是否已更新
- ⚠️ **需要重新部署** `email-server-naxiwell` 项目

---

## 📧 测试建议 / Testing Recommendations

**为避免打扰客户，建议测试方法：**

1. **先检查配置**：确认 Vercel 环境变量正确
2. **检查日志**：查看部署和运行时日志
3. **可选：使用测试邮箱**：
   - 临时将 `RECIPIENT_EMAIL` 改为 `stickypoooop@gmail.com`
   - 测试邮件发送功能
   - 确认无误后，再改回 `zhangyanbin_1@hotmail.com`
   - **记得重新部署！**

---

**创建时间**: 2025-11-02
**最后更新**: 2025-11-02
