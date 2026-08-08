// MIDLERTIDIG TESTFIL — ikke merge denne branchen.
//
// Finnes bare for å gi "what it does"-sjekken en reell atferdsendring å
// rapportere: et endepunkt som sletter data uten å kontrollere hvem som spør.
// Slett branchen når sjekken er verifisert.
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await supabase.from('notater').delete().eq('id', id);
  return new Response(null, { status: 204 });
}
