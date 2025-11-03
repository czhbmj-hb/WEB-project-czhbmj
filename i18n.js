// ============================================================
// Internationalization (i18n) Configuration
// Language System for English and Chinese
// ============================================================

const i18n = {
    // Current language (default: English)
    currentLang: localStorage.getItem('site_language') || 'en',

    // All translations
    translations: {
        en: {
            // Header & Navigation
            nav_products: 'Products',
            nav_about: 'About Us',
            nav_contact: 'Contact',
            nav_admin: 'Admin',
            nav_cart: 'Cart',

            // Hero Section
            hero_title: 'CHANGZHOU NEW SOUTH WALES TRADING Co.,Ltd Quality Fasteners & Bearing',
            hero_subtitle: 'Your trusted partner for industrial-grade fastening solutions. Quality guaranteed, delivered on time.',
            hero_browse: 'Browse Products',
            hero_contact: 'Contact Sales',

            // About Section
            about_title: 'CHANGZHOU NEW SOUTH WALES TRADING Co.,Ltd',
            company_name: 'CHANGZHOU NEW SOUTH WALES TRADING Co.,Ltd',
            about_subtitle: 'Industry-leading fastening solutions since 2015',
            about_description: 'Changzhou New South Wales Trading Co., Ltd. is a limited liability company established on 20 Oct 2015 and based at No. 96 Huaide South Road, Zhonglou District, Changzhou, China. Guided by legal representative Ms. Tang Wenting, the company engages in the wholesale and retail of industrial hardware and related materials, including (non-hazardous) packaging and decorative materials, hardware & fasteners, building materials, electrical and lighting supplies, solar-related products, electronic products, machinery & equipment, and auto parts. Where permitted by law, the company may conduct goods and technology import & export (items subject to approval are carried out after obtaining the required licenses).',
            feature_quality_title: 'Quality Assurance',
            feature_quality_desc: 'Products aligned with relevant DIN/ISO/GB standards where applicable. Incoming inspection & pre-shipment checks to ensure consistency',
            feature_delivery_title: 'Fast Delivery',
            feature_delivery_desc: 'Efficient supply and logistics network in the Yangtze River Delta. On-time dispatch commitment for common specifications',
            feature_support_title: 'Expert Support',
            feature_support_desc: 'Application-oriented guidance on fastener selection and substitutions. Responsive service for quotations, samples, and technical questions',

            // Products Section
            products_title: 'Our Products',
            products_subtitle: 'Browse our extensive collection of fasteners and hardware',
            products_all: 'All Products',
            filter_categories: 'Categories',
            filter_material: 'Material',
            filter_all_materials: 'All Materials',
            filter_clear: 'Clear Filters',
            search_placeholder: 'Search products...',
            sort_label: 'Sort by:',
            sort_name: 'Name',
            sort_price_low: 'Price: Low to High',
            sort_price_high: 'Price: High to Low',
            no_products: 'No products found matching your criteria.',

            // Product Details
            product_per_unit: 'per unit',
            product_category: 'Category:',
            product_size: 'Size:',
            product_material: 'Material:',
            product_specifications: 'Specifications',
            product_quantity: 'Quantity:',
            product_add_cart: 'Add to Enquiry Cart',
            product_unit_price: 'Unit Price',
            product_subtotal: 'Subtotal',

            // Contact Section
            contact_title: 'Contact Us',
            contact_subtitle: 'Get in touch for quotes, inquiries, or support',
            contact_address: 'Address',
            contact_address_detail: 'No. 96 Huaide South Road, Zhonglou District<br>Changzhou, China',
            contact_phone: 'Phone',
            contact_email: 'Email',
            contact_hours: 'Business Hours',
            contact_hours_detail: 'Monday - Friday: 8:00 AM - 6:00 PM<br>Saturday: 9:00 AM - 2:00 PM',

            // Footer
            footer_tagline: 'Your trusted partner for quality hardware solutions since 2015.',
            footer_quick_links: 'Quick Links',
            footer_categories: 'Categories',
            footer_follow: 'Follow Us',
            footer_copyright: '© 2025 CHANGZHOU NEW SOUTH WALES TRADING Co.,Ltd. All rights reserved.',

            // Cart Modal
            cart_title: 'Your Enquiry Cart',
            cart_total_items: 'Total Items:',
            cart_continue: 'Continue Shopping',
            cart_proceed: 'Send Enquiry',
            cart_empty: 'Your enquiry cart is empty',
            cart_quantity: 'Quantity:',
            cart_item_remove: 'Remove',
            cart_view: 'View Cart',

            // Enquiry Modal
            enquiry_title: 'Send Enquiry',
            enquiry_name: 'Full Name',
            enquiry_company: 'Company Name',
            enquiry_email: 'Email',
            enquiry_phone: 'Phone',
            enquiry_address: 'Address',
            enquiry_notes: 'Additional Notes',
            enquiry_products: 'Selected Products',
            enquiry_cancel: 'Cancel',
            enquiry_submit: 'Submit Enquiry',
            enquiry_required: '*',

            // Admin Panel
            admin_login_title: 'Admin Access',
            admin_login_desc: 'Enter your 32-character admin key to access the management dashboard',
            admin_login_key: 'Admin Key',
            admin_login_placeholder: 'Enter 32-character key',
            admin_login_error: 'Invalid admin key. Access denied.',
            admin_login_error_length: 'Admin key must be exactly 32 characters',
            admin_login_btn: 'Login',
            admin_logout: 'Logout',

            admin_dashboard_title: 'Admin Dashboard',
            admin_category_title: 'Category & Material Management',
            admin_categories: 'Categories',
            admin_materials: 'Materials',
            admin_add: 'Add',
            admin_delete: 'Delete',
            admin_category_name: 'Category name (e.g., screws)',
            admin_category_display: 'Display name (e.g., Screws)',
            admin_category_name_zh: 'Chinese name (optional)',
            admin_material_name: 'Material name (e.g., stainless-steel)',
            admin_material_display: 'Display name (e.g., Stainless Steel)',
            admin_material_name_zh: 'Chinese name (optional)',

            admin_products_title: 'Product Management',
            admin_add_product: 'Add New Product',
            admin_add_product_batch: 'Batch Add Products',
            admin_search_placeholder: 'Search products by name, category, material, size, price...',
            admin_table_image: 'Image',
            admin_table_name: 'Name',
            admin_table_category: 'Category',
            admin_table_price: 'Price',
            admin_table_material: 'Material',
            admin_table_size: 'Size',
            admin_table_actions: 'Actions',
            admin_edit: 'Edit',
            admin_no_products: 'No products found.',

            // Product Form
            product_form_add: 'Add New Product',
            product_form_edit: 'Edit Product',
            product_name: 'Product Name',
            product_category_select: 'Category',
            product_material_select: 'Material',
            product_price: 'Price ($)',
            product_size_label: 'Size',
            product_size_placeholder: 'e.g., M6 x 40mm',
            product_image: 'Product Image',
            product_image_choose: 'Choose Image',
            product_image_remove: 'Remove Image',
            product_image_current: 'Current image (click Choose Image to change)',
            product_image_format: 'Supported formats: PNG, JPG, JPEG, WebP (Max 20MB)',
            product_description: 'Description',
            product_description_zh: 'Chinese Description (optional)',
            product_select_category: 'Select Category',
            product_select_material: 'Select Material',
            product_cancel: 'Cancel',
            product_save: 'Save Product',
            product_uploading: 'Uploading image...',

            // Messages
            msg_added_to_cart: 'Added {quantity} x {name} to enquiry cart',
            msg_delete_confirm: 'Are you sure you want to delete this product? This action cannot be undone.',
            msg_delete_category_confirm: 'Are you sure you want to delete the category "{name}"?',
            msg_delete_material_confirm: 'Are you sure you want to delete the material "{name}"?',
            msg_fill_required: 'Please fill in all required fields (Name, Email, Phone)',
            msg_invalid_email: 'Please enter a valid email address',
            msg_invalid_phone: 'Please enter a valid phone number (minimum 8 digits)',
            msg_select_image: 'Please select a product image',
            msg_invalid_file_type: 'Invalid file type. Please select a PNG, JPG, JPEG, or WebP image.',
            msg_file_too_large: 'File size exceeds 20MB. Please select a smaller image.',
            msg_category_added: '✅ Category added successfully!',
            msg_material_added: '✅ Material added successfully!',
            msg_category_deleted: '✅ Category deleted successfully!',
            msg_material_deleted: '✅ Material deleted successfully!',
            msg_category_in_use: '❌ Cannot delete this category: It is currently being used by products.',
            msg_material_in_use: '❌ Cannot delete this material: It is currently being used by products.',
            msg_error_saving: 'Failed to save product. Please try again.',
            msg_error_deleting: 'Failed to delete product. Please try again.',
            msg_fill_both_names: 'Please enter both name and display name'
        },

        zh: {
            // Header & Navigation
            nav_products: '产品',
            nav_about: '关于我们',
            nav_contact: '联系方式',
            nav_admin: '管理',
            nav_cart: '购物车',

            // Hero Section
            hero_title: '常州纽修威商贸有限公司 优质紧固件和轴承',
            hero_subtitle: '您值得信赖的工业级紧固解决方案合作伙伴。质量保证，准时交付。',
            hero_browse: '浏览产品',
            hero_contact: '联系销售',

            // About Section
            about_title: '常州纽修威商贸有限公司',
            company_name: '常州纽修威商贸有限公司',
            about_subtitle: '自2015年以来的行业领先紧固解决方案',
            about_description: '常州纽修威商贸有限公司是一家于2015年10月20日成立的有限责任公司，位于中国常州市钟楼区怀德南路96号。公司由法定代表人唐文婷女士领导，从事工业五金及相关材料的批发和零售，包括（非危险）包装和装饰材料、五金紧固件、建筑材料、电气和照明用品、太阳能相关产品、电子产品、机械设备和汽车零部件。在法律允许的范围内，公司可以进行货物和技术的进出口（需要审批的项目在获得所需许可证后方可进行）。',
            feature_quality_title: '质量保证',
            feature_quality_desc: '产品符合相关的DIN/ISO/GB标准。入库检验和发货前检查以确保一致性',
            feature_delivery_title: '快速交付',
            feature_delivery_desc: '长三角地区高效的供应和物流网络。常规规格按时发货承诺',
            feature_support_title: '专业支持',
            feature_support_desc: '针对紧固件选择和替代的应用导向指导。报价、样品和技术问题的响应式服务',

            // Products Section
            products_title: '我们的产品',
            products_subtitle: '浏览我们广泛的紧固件和五金产品系列',
            products_all: '所有产品',
            filter_categories: '分类',
            filter_material: '材料',
            filter_all_materials: '所有材料',
            filter_clear: '清除筛选',
            search_placeholder: '搜索产品...',
            sort_label: '排序方式：',
            sort_name: '名称',
            sort_price_low: '价格：从低到高',
            sort_price_high: '价格：从高到低',
            no_products: '未找到符合条件的产品。',

            // Product Details
            product_per_unit: '每单位',
            product_category: '分类：',
            product_size: '尺寸：',
            product_material: '材料：',
            product_specifications: '规格',
            product_quantity: '数量：',
            product_add_cart: '添加至询价购物车',
            product_unit_price: '单价',
            product_subtotal: '小计',

            // Contact Section
            contact_title: '联系我们',
            contact_subtitle: '获取报价、咨询或支持',
            contact_address: '地址',
            contact_address_detail: '中国常州市钟楼区<br>怀德南路96号',
            contact_phone: '电话',
            contact_email: '邮箱',
            contact_hours: '营业时间',
            contact_hours_detail: '周一至周五：上午8:00 - 下午6:00<br>周六：上午9:00 - 下午2:00',

            // Footer
            footer_tagline: '自2015年以来，您值得信赖的优质五金解决方案合作伙伴。',
            footer_quick_links: '快速链接',
            footer_categories: '分类',
            footer_follow: '关注我们',
            footer_copyright: '© 2025 常州纽修威商贸有限公司。保留所有权利。',

            // Cart Modal
            cart_title: '您的询价购物车',
            cart_total_items: '总计商品：',
            cart_continue: '继续购物',
            cart_proceed: '发送询价',
            cart_empty: '您的询价购物车是空的',
            cart_quantity: '数量：',
            cart_item_remove: '移除',
            cart_view: '查看购物车',

            // Enquiry Modal
            enquiry_title: '发送询价',
            enquiry_name: '姓名',
            enquiry_company: '公司名称',
            enquiry_email: '邮箱',
            enquiry_phone: '电话',
            enquiry_address: '地址',
            enquiry_notes: '备注',
            enquiry_products: '选择的产品',
            enquiry_cancel: '取消',
            enquiry_submit: '提交询价',
            enquiry_required: '*',

            // Admin Panel
            admin_login_title: '管理员访问',
            admin_login_desc: '输入您的32位管理员密钥以访问管理仪表板',
            admin_login_key: '管理员密钥',
            admin_login_placeholder: '输入32位密钥',
            admin_login_error: '管理员密钥无效。访问被拒绝。',
            admin_login_error_length: '管理员密钥必须恰好为32个字符',
            admin_login_btn: '登录',
            admin_logout: '退出',

            admin_dashboard_title: '管理仪表板',
            admin_category_title: '分类与材料管理',
            admin_categories: '分类',
            admin_materials: '材料',
            admin_add: '添加',
            admin_delete: '删除',
            admin_category_name: '分类名称（例如：screws）',
            admin_category_display: '显示名称（例如：Screws）',
            admin_category_name_zh: '中文名称（可选）',
            admin_material_name: '材料名称（例如：stainless-steel）',
            admin_material_display: '显示名称（例如：Stainless Steel）',
            admin_material_name_zh: '中文名称（可选）',

            admin_products_title: '产品管理',
            admin_add_product: '添加新产品',
            admin_add_product_batch: '批量添加产品',
            admin_search_placeholder: '按名称、分类、材料、尺寸、价格搜索产品...',
            admin_table_image: '图片',
            admin_table_name: '名称',
            admin_table_category: '分类',
            admin_table_price: '价格',
            admin_table_material: '材料',
            admin_table_size: '尺寸',
            admin_table_actions: '操作',
            admin_edit: '编辑',
            admin_no_products: '未找到产品。',

            // Product Form
            product_form_add: '添加新产品',
            product_form_edit: '编辑产品',
            product_name: '产品名称',
            product_category_select: '分类',
            product_material_select: '材料',
            product_price: '价格（$）',
            product_size_label: '尺寸',
            product_size_placeholder: '例如：M6 x 40mm',
            product_image: '产品图片',
            product_image_choose: '选择图片',
            product_image_remove: '移除图片',
            product_image_current: '当前图片（点击选择图片以更改）',
            product_image_format: '支持格式：PNG、JPG、JPEG、WebP（最大20MB）',
            product_description: '描述',
            product_description_zh: '中文描述（可选）',
            product_select_category: '选择分类',
            product_select_material: '选择材料',
            product_cancel: '取消',
            product_save: '保存产品',
            product_uploading: '上传图片中...',

            // Messages
            msg_added_to_cart: '已添加 {quantity} x {name} 至询价购物车',
            msg_delete_confirm: '您确定要删除此产品吗？此操作无法撤销。',
            msg_delete_category_confirm: '您确定要删除分类"{name}"吗？',
            msg_delete_material_confirm: '您确定要删除材料"{name}"吗？',
            msg_fill_required: '请填写所有必填字段（姓名、邮箱、电话）',
            msg_invalid_email: '请输入有效的邮箱地址',
            msg_invalid_phone: '请输入有效的电话号码（至少8位数字）',
            msg_select_image: '请选择产品图片',
            msg_invalid_file_type: '文件类型无效。请选择PNG、JPG、JPEG或WebP图片。',
            msg_file_too_large: '文件大小超过20MB。请选择较小的图片。',
            msg_category_added: '✅ 分类添加成功！',
            msg_material_added: '✅ 材料添加成功！',
            msg_category_deleted: '✅ 分类删除成功！',
            msg_material_deleted: '✅ 材料删除成功！',
            msg_category_in_use: '❌ 无法删除此分类：该分类正在被产品使用。',
            msg_material_in_use: '❌ 无法删除此材料：该材料正在被产品使用。',
            msg_error_saving: '保存产品失败。请重试。',
            msg_error_deleting: '删除产品失败。请重试。',
            msg_fill_both_names: '请输入名称和显示名称'
        }
    },

    // Get translation for current language
    t(key, params = {}) {
        let text = this.translations[this.currentLang][key] || this.translations['en'][key] || key;

        // Replace placeholders like {quantity}, {name}
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });

        return text;
    },

    // Switch language
    setLanguage(lang) {
        if (lang !== 'en' && lang !== 'zh') {
            console.error('Invalid language:', lang);
            return;
        }

        this.currentLang = lang;
        localStorage.setItem('site_language', lang);
        this.updatePageLanguage();
    },

    // Update all text on page
    updatePageLanguage() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);

            // Update text content or placeholder
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Update all elements with data-i18n-html attribute (for HTML content)
        document.querySelectorAll('[data-i18n-html]').forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            element.innerHTML = this.t(key);
        });

        // Update language button text
        const langBtn = document.getElementById('langBtn');
        if (langBtn) {
            langBtn.textContent = this.currentLang === 'en' ? '中文' : 'English';
        }

        // Trigger custom event for components that need to update
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: this.currentLang } }));
    },

    // Initialize language system
    init() {
        // Set initial language
        this.currentLang = localStorage.getItem('site_language') || 'en';

        // Update page when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.updatePageLanguage());
        } else {
            this.updatePageLanguage();
        }
    }
};

// Auto-initialize
i18n.init();
