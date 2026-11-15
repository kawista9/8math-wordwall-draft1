export function parseRosterCSV(text) {
 if(typeof text!=='string' || text.length>100000)throw new Error('Choose a CSV smaller than 100 KB.');
 const table=[];let row=[],field='',quoted=false,closed=false;
 const endField=()=>{row.push(field);field='';closed=false;};
 const endRow=()=>{endField();if(row.some(v=>v.trim()))table.push(row);row=[];};
 text=text.replace(/^\uFEFF/,'');
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(quoted){if(c==='"'){if(text[i+1]==='"'){field+='"';i++;}else{quoted=false;closed=true;}}else field+=c;continue;}
  if(c===','){endField();continue;}
  if(c==='\r' || c==='\n'){if(c==='\r' && text[i+1]==='\n')i++;endRow();continue;}
  if(closed){if(c===' ' || c==='\t')continue;throw new Error('Invalid CSV: unexpected text after a quoted value.');}
  if(c==='"'){if(field)throw new Error('Invalid CSV quotation. Export the spreadsheet as CSV again.');quoted=true;}else field+=c;
 }
 if(quoted)throw new Error('A quoted field is unfinished. Export the spreadsheet as CSV again.');
 if(field || row.length || closed)endRow();
 if(!table.length)throw new Error('The CSV is empty.');
 const headers=table.shift().map(h=>h.trim().toLowerCase().replace(/[ _-]/g,''));
 const columns=['firstname','lastname','schoolemail'].map(h=>headers.indexOf(h));
 if(columns.some(i=>i<0) || new Set(headers).size!==headers.length)throw new Error('Use the column headings First Name, Last Name, School Email exactly once each.');
 if(!table.length || table.length>150)throw new Error('Upload between 1 and 150 learners.');
 const emails=new Set();
 return table.map((r,i)=>{
  if(r.length!==headers.length)throw new Error(`Row ${i+2}: the number of columns does not match the headings.`);
  const [firstName,lastName,email]=columns.map(n=>r[n].trim());
  if(!firstName || !lastName || firstName.length>80 || lastName.length>80)throw new Error(`Row ${i+2}: enter first and last names (80 characters maximum each).`);
  if(email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error(`Row ${i+2}: enter a valid school email address.`);
  const normalized=email.toLowerCase();if(emails.has(normalized))throw new Error(`Row ${i+2}: this email appears more than once.`);
  emails.add(normalized);return {firstName,lastName,email:normalized};
 });
}
