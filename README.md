# CHANGZHOU NEW SOUTH WALES TRADING Co.,Ltd - Industrial Bearing Supplier

A modern e-commerce website for CHANGZHOU NEW SOUTH WALES TRADING Co.,Ltd, showcasing industrial fasteners and bearing products with integrated Supabase backend and Vercel deployment.

## 🌟 Features

- **Product Catalog**: Browse extensive collection of screws, bolts, nuts, washers, anchors, and rivets
- **Smart Search & Filters**: Search by name, category, material, finish, and specifications
- **Enquiry System**: Add products to cart and submit enquiries directly
- **Admin Dashboard**: Manage products with full CRUD operations
- **Real-time Database**: Powered by Supabase for reliable data management
- **Responsive Design**: Mobile-friendly interface with modern UI

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Supabase (PostgreSQL database)
- **Deployment**: Vercel
- **CDN**: Font Awesome, Supabase JS Client

## 📋 Prerequisites

- Supabase account ([sign up here](https://supabase.com))
- GitHub account
- Vercel account (for deployment)

## 🚀 Setup Instructions

### 1. Database Setup

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase_schema.sql`
4. Execute the SQL to create tables and insert default products

### 2. Local Development

```bash
# Clone the repository
git clone https://github.com/stickypoooop-AI/WEB-project.git
cd WEB-project

# Install dependencies (optional, for local dev server)
npm install

# Run local development server
npm run dev
```

### 3. Environment Variables (Optional)

The project works out-of-the-box with default credentials embedded in `config.js`. For custom configurations or different Supabase projects:

**Option 1: Local Development Override**

Create an `env.js` file in the root directory (gitignored):

```javascript
// env.js
window.ENV = {
    SUPABASE_URL: 'https://your-project.supabase.co',
    SUPABASE_ANON_KEY: 'your-supabase-anon-key',
    ADMIN_KEY: 'your-32-character-admin-key'
};
```

A template is provided in `env.js.example`.

**Option 2: Modify config.js Directly**

Edit the default values in `config.js`:

```javascript
const config = {
    supabase: {
        url: 'https://your-project.supabase.co',
        anonKey: 'your-anon-key'
    },
    admin: {
        key: 'your-admin-key'
    }
};
```

**Default Configuration:**
- Supabase URL: `https://zoxjvuafzkymgxmsluif.supabase.co`
- Admin Key: `12345678901234567890123456789012`

## 🌐 Deployment to Vercel

### Method 1: Via Vercel Dashboard

1. Go to [Vercel](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository: `stickypoooop-AI/WEB-project`
4. Configure project:
   - **Framework Preset**: Other (static site)
   - **Root Directory**: `./`
   - **Build Command**: Leave empty
   - **Output Directory**: `./`
5. Add Environment Variables (optional for future):
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
6. Click **"Deploy"**

### Method 2: Via Git Integration

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit with Supabase integration"

# Add remote and push
git remote add origin https://github.com/stickypoooop-AI/WEB-project.git
git branch -M main
git push -u origin main
```

Then connect Vercel to your GitHub repository for automatic deployments.

## 🔑 Admin Access

To access the admin dashboard:
1. Click the **"Admin"** button in the header
2. Enter the admin key: `12345678901234567890123456789012`
3. Manage products (add, edit, delete)

**⚠️ Security Note**: Change the admin key in production for security.

## 📊 Database Schema

### Products Table
- `id` (UUID) - Primary key
- `name` (TEXT) - Product name
- `category` (TEXT) - Product category
- `material` (TEXT) - Material type
- `finish` (TEXT) - Surface finish
- `price` (NUMERIC) - Unit price
- `size` (TEXT) - Product size
- `image` (TEXT) - Image URL
- `description` (TEXT) - Product description
- `created_at`, `updated_at` (TIMESTAMP)

### Enquiries Table
- `id` (UUID) - Primary key
- `customer_name` (TEXT) - Customer name
- `customer_email` (TEXT) - Customer email
- `customer_phone` (TEXT) - Phone number
- `company_name` (TEXT) - Company name (optional)
- `customer_address` (TEXT) - Address (optional)
- `products` (JSONB) - Selected products array
- `notes` (TEXT) - Additional notes
- `created_at` (TIMESTAMP)

## 🎨 Customization

### Updating Branding
- Edit company information in `index.html`
- Modify colors in `styles.css` (CSS variables at top)
- Replace logo icon in header section

### Adding Categories
1. Update database schema to include new category
2. Add category button in `index.html`
3. Update category filter options

### Styling Changes
All styles are in `styles.css` with CSS custom properties for easy theming.

## 📝 Project Structure

```
WEB-project/
├── index.html              # Main HTML file
├── styles.css              # All styles
├── script.js               # Main application logic
├── supabase-client.js      # Supabase configuration
├── supabase_schema.sql     # Database schema
├── package.json            # Dependencies
├── .gitignore             # Git ignore rules
├── .env.local             # Environment variables (not committed)
└── README.md              # This file
```

## 🐛 Troubleshooting

### Products not loading
- Check Supabase connection in browser console
- Verify database tables are created correctly
- Ensure RLS policies allow public read access

### Admin operations failing
- Verify you're logged in as admin
- Check browser console for errors
- Ensure Supabase URL and key are correct

### Deployment issues
- Verify all files are committed to git
- Check Vercel build logs for errors
- Ensure environment variables are set correctly

## 📞 Contact

**Company**: Changzhou New South Wales Trading Co., Ltd. (常州纽修威商贸有限公司)
**Address**: No. 96 Huaide South Road, Zhonglou District, Changzhou, China
**Phone**: 0404693189
**Email**: zhangyanbin_1@hotmail.com

## 📄 License

MIT License - feel free to use this project for your own business needs.

## 🙏 Acknowledgments

- Font Awesome for icons
- Unsplash for product images
- Supabase for backend infrastructure
- Vercel for hosting platform

---

Built with ❤️ for NaxiWell Industrial
