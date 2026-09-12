import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') &&
  supabaseUrl.startsWith('http')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Supabase Storage'a görsel yükler ve genel erişilebilir URL'sini döner.
 */
export async function uploadImageToSupabaseStorage(
  bucket: 'avatars' | 'gallery',
  filePath: string,
  fileOrBlob: Blob | File
): Promise<{ url: string | null; error: string | null }> {
  if (!supabase) {
    return { url: null, error: 'Supabase yapılandırılmamış.' };
  }

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileOrBlob, {
        cacheControl: '3600',
        upsert: true,
        contentType: fileOrBlob.type || 'image/jpeg'
      });

    if (error) {
      console.error(`Supabase Storage upload error (${bucket}):`, error);
      return { url: null, error: error.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err: any) {
    console.error(`Storage upload exception (${bucket}):`, err);
    return { url: null, error: err?.message || 'Görsel yüklenirken beklenmeyen bir hata oluştu.' };
  }
}

/**
 * Supabase bağlantısının canlı olup olmadığını test eder.
 */
export async function checkSupabaseConnection(): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('commissions').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
}
