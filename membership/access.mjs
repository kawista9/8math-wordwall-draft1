export function hasAccess(rows, now = Math.floor(Date.now()/1000)) {
 return rows.some(row => ['active','trialing'].includes(row.status) && row.access_until > now);
}
export function sessionToken(request) {
 const bearer = request.headers.get('authorization');
 if (bearer?.startsWith('Bearer ')) return bearer.slice(7);
 return (request.headers.get('cookie') || '').split(';').map(x=>x.trim()).find(x=>x.startsWith('__session='))?.slice(10);
}
export function sameOrigin(request, origin) { return request.headers.get('origin') === origin; }
export const escapeHTML = text => String(text ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
