import {createClient} from '@supabase/supabase-js';
const url=import.meta.env.VITE_SUPABASE_URL;
const publicKey=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY||import.meta.env.VITE_SUPABASE_ANON_KEY;
export const configurationError=Boolean(url)!==Boolean(publicKey)?'A configuração da conta está incompleta. Configure a URL e a chave pública do Supabase.':'';
export let cloud=null;
export let cloudError=configurationError;
if(url&&publicKey){try{cloud=createClient(url,publicKey);}catch{cloudError='A configuração do Supabase é inválida. Verifique a URL e a chave pública.';}}
