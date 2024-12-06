import { supabase } from './client';

export interface Document {
  id: string;
  content: string;
  created_at: string;
}

export const documentService = {
  async saveDocument(content: string): Promise<Document> {
    const { data, error } = await supabase
      .from('documents')
      .insert([{ content }])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async getDocuments(): Promise<Document[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },

  async getDocument(id: string): Promise<Document> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  }
};