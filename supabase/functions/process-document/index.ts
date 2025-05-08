
// This edge function processes uploaded documents to extract text content
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Initialize Supabase client with service role key for admin access
const adminClient = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
);

// Initialize Supabase client with anon key for user operations
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Set CORS headers for the actual request
  const headers = new Headers(corsHeaders);
  headers.set('Content-Type', 'application/json');

  try {
    // Get the request body
    const requestData = await req.json();
    const { documentId } = requestData;

    if (!documentId) {
      return new Response(
        JSON.stringify({ error: 'Document ID is required' }),
        { status: 400, headers }
      );
    }

    // Get the document metadata from the database
    const { data: documentData, error: docError } = await supabase
      .from('strategy_documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !documentData) {
      return new Response(
        JSON.stringify({ error: 'Document not found' }),
        { status: 404, headers }
      );
    }

    // Download the document from storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from('strategy_documents')
      .download(documentData.file_path);

    if (fileError) {
      throw new Error(`Error downloading file: ${fileError.message}`);
    }

    // Simple text extraction based on file type
    let extractedText = '';
    
    if (documentData.file_type.includes('text/plain')) {
      // For text files, just read the text content
      extractedText = await fileData.text();
    } else if (
      documentData.file_type.includes('pdf') || 
      documentData.file_type.includes('doc') || 
      documentData.file_type.includes('sheet')
    ) {
      // For other file types, we would need specific parsers
      // For now, let's just acknowledge we received them
      extractedText = `File content for ${documentData.file_name} (${documentData.file_type}) would be processed here.`;
      
      // In a real implementation, you would use libraries specific to each file type
      // For example, pdf-parse for PDFs, mammoth for Word documents, etc.
    }

    // Update the document in the database with the extracted text
    const { error: updateError } = await supabase
      .from('strategy_documents')
      .update({
        extracted_text: extractedText,
        processed: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId);

    if (updateError) {
      throw new Error(`Error updating document: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        documentId,
        message: 'Document processed successfully' 
      }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('Error processing document:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      }),
      { status: 500, headers }
    );
  }
});
