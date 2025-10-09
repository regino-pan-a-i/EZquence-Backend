/***********************************
 * Require and Import Statements
************************************/
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();


const supabaseUrl = process.env.SUPABASE_URL; 
const supabaseAnonKey = process.env.SUPABASE_ANNON_KEY; 

const supabase = createClient(supabaseUrl, supabaseAnonKey);


module.exports = supabase