
// lib/errorHelper.ts

const INVALID_API_KEY_MESSAGE = `The Supabase API key is invalid. This is expected if you are running the project for the first time.

To fix this, you need to update the placeholder key with your own project's key.

1. Go to your Supabase project dashboard.
2. Navigate to 'Project Settings' > 'API'.
3. Find your 'Project API Keys' and copy the public 'anon' key.
4. Open the file 'lib/supabaseClient.ts' in the editor.
5. Replace the placeholder value of 'supabaseAnonKey' with the key you copied.

The app will work correctly after you update the key.`;

/**
 * Checks for a specific "Invalid API key" error from Supabase and returns a detailed, user-friendly message.
 * For other errors, it returns a generic message.
 * @param error - The error object, typically from a Supabase response.
 * @param context - A string describing the action that failed (e.g., "fetching replays").
 * @returns A user-friendly error string.
 */
export function getSupabaseErrorMessage(error: any, context: string): string {
  const errorMessage = error?.message || 'An unknown error occurred';
  
  if (typeof errorMessage === 'string' && (errorMessage.includes('Invalid API key') || errorMessage.includes('failed to fetch'))) {
    return INVALID_API_KEY_MESSAGE;
  }
  
  return `Error ${context}: ${errorMessage}`;
}
