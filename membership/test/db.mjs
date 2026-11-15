import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
export function database(){
 const db=new DatabaseSync(':memory:');db.exec(readFileSync(new URL('../schema.sql',import.meta.url),'utf8'));
 const wrapper={raw:db,prepare(sql){let values=[];return {bind(...args){values=args;return this;},async first(){return db.prepare(sql).get(...values) || null;},async all(){return {results:db.prepare(sql).all(...values)};},async run(){return db.prepare(sql).run(...values);}};},async batch(statements){db.exec('BEGIN');try{for(const statement of statements)await statement.run();db.exec('COMMIT');}catch(error){db.exec('ROLLBACK');throw error;}}};
 return wrapper;
}
