// Supabase Client Configuration
// Reads configuration from config.js which supports environment variables

// Get configuration from global config
const SUPABASE_URL = window.APP_CONFIG.supabase.url;
const SUPABASE_ANON_KEY = window.APP_CONFIG.supabase.anonKey;

// Initialize Supabase client
async function databaseFetch(input, options = {}) {
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (options.signal?.aborted) abort();
    options.signal?.addEventListener('abort', abort, { once: true });
    const timeout = setTimeout(abort, (options.method || 'GET').toUpperCase() === 'GET' ? 12000 : 45000);
    try {
        return await fetch(input, { ...options, signal: controller.signal });
    } finally {
        clearTimeout(timeout);
        options.signal?.removeEventListener('abort', abort);
    }
}

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { fetch: databaseFetch }
});

// Only reads are retried automatically. Repeating a write can duplicate products.
async function readRows(query) {
    for (let attempt = 0; attempt < 3; attempt++) {
        let result;
        try { result = await query(); }
        catch (error) { result = { error }; }
        const { data, error, status } = result;
        if (!error) {
            if (!Array.isArray(data)) throw new Error('Invalid database response');
            return data;
        }
        if (attempt === 2 || (status >= 400 && status < 500 && status !== 408 && status !== 429)) throw error;
        await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
    }
}

// Storage configuration
const STORAGE_BUCKET = 'product-images';

// Database API wrapper functions
const db = {
    // Storage operations
    storage: {
        async uploadImage(file) {
            // Generate unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `products/${fileName}`;

            // Upload file to Supabase Storage
            const { data, error } = await supabaseClient.storage
                .from(STORAGE_BUCKET)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // Get public URL
            const { data: urlData } = supabaseClient.storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(filePath);

            return urlData.publicUrl;
        },

        async deleteImage(imageUrl) {
            // Extract file path from URL
            const url = new URL(imageUrl);
            const pathParts = url.pathname.split('/');
            const bucketIndex = pathParts.indexOf(STORAGE_BUCKET);
            if (bucketIndex === -1) return false;

            const filePath = pathParts.slice(bucketIndex + 1).join('/');

            // Delete file from storage
            const { error } = await supabaseClient.storage
                .from(STORAGE_BUCKET)
                .remove([filePath]);

            if (error) throw error;
            return true;
        }
    },

    // Products operations
    products: {
        async getAll() {
            return readRows(() => supabaseClient
                .from('products')
                .select('*')
                .order('created_at', { ascending: false }));
        },

        async getById(id) {
            const { data, error } = await supabaseClient
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        },

        async create(productData) {
            const { data, error } = await supabaseClient
                .from('products')
                .insert([productData])
                .select()
                .single();

            // A manual retry after a lost response uses the same draft UUID.
            if (error?.code === '23505' && productData.id) {
                return db.products.update(productData.id, productData);
            }
            if (error) throw error;
            return data;
        },

        async update(id, productData) {
            const { data, error } = await supabaseClient
                .from('products')
                .update(productData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        async delete(id) {
            const { error } = await supabaseClient
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        }
    },

    // Enquiries operations
    enquiries: {
        async create(enquiryData) {
            const { data, error } = await supabaseClient
                .from('enquiries')
                .insert([enquiryData])
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        async getAll() {
            const { data, error } = await supabaseClient
                .from('enquiries')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        }
    },

    // Categories operations
    categories: {
        async getAll() {
            return readRows(() => supabaseClient
                .from('categories')
                .select('*')
                .order('display_name', { ascending: true }));
        },

        async create(categoryData) {
            const { data, error } = await supabaseClient
                .from('categories')
                .insert([categoryData])
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        async delete(id) {
            // First check if any products use this category
            const { data: products, error: checkError } = await supabaseClient
                .from('products')
                .select('id')
                .eq('category', id)
                .limit(1);

            if (checkError) throw checkError;

            if (products && products.length > 0) {
                throw new Error('该选项正在被使用中');
            }

            const { error } = await supabaseClient
                .from('categories')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        }
    },

    // Materials operations
    materials: {
        async getAll() {
            return readRows(() => supabaseClient
                .from('materials')
                .select('*')
                .order('display_name', { ascending: true }));
        },

        async create(materialData) {
            const { data, error } = await supabaseClient
                .from('materials')
                .insert([materialData])
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        async delete(id) {
            // First check if any products use this material
            const { data: products, error: checkError } = await supabaseClient
                .from('products')
                .select('id')
                .eq('material', id)
                .limit(1);

            if (checkError) throw checkError;

            if (products && products.length > 0) {
                throw new Error('该选项正在被使用中');
            }

            const { error } = await supabaseClient
                .from('materials')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        }
    }
};
