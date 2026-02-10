

import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://qgrmahhlxqantljfsvix.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFncm1haGhseHFhbnRsamZzdml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NDA2MTksImV4cCI6MjA4NjIxNjYxOX0.FWHU_GED_vwqzA5gWb5obP36zHDUtuQZ5yRfDGlykIU'
)
