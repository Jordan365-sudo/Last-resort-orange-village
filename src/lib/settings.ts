import { supabase } from '@/integrations/supabase/client';

export interface SiteSettings {
  id: string;
  aboutContent: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  contactX: string | null;
  contactWhatsapp: string | null;
  updatedAt: Date;
}

const mapSupabaseSettings = (data: any): SiteSettings => ({
  id: data.id,
  aboutContent: data.about_content,
  contactEmail: data.contact_email,
  contactPhone: data.contact_phone,
  contactX: data.contact_x,
  contactWhatsapp: data.contact_whatsapp,
  updatedAt: new Date(data.updated_at),
});

export const getSettings = async (): Promise<SiteSettings | undefined> => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 'site_settings')
    .single();

  if (error) {
    console.error("Error fetching settings:", error);
    return undefined;
  }
  return data ? mapSupabaseSettings(data) : undefined;
};

export const updateSettings = async (updates: Partial<Omit<SiteSettings, 'id' | 'updatedAt'>>): Promise<SiteSettings | undefined> => {
  const { data, error } = await supabase
    .from('settings')
    .update({
      about_content: updates.aboutContent,
      contact_email: updates.contactEmail,
      contact_phone: updates.contactPhone,
      contact_x: updates.contactX,
      contact_whatsapp: updates.contactWhatsapp,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 'site_settings')
    .select()
    .single();

  if (error) {
    console.error("Error updating settings:", error);
    return undefined;
  }
  return data ? mapSupabaseSettings(data) : undefined;
};