// Launch-readiness checks for the static website. No real form submissions.
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const failures=[];
const warnings=[];
const files=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(entry.name==='.git'||entry.name==='node_modules')continue;const p=path.join(dir,entry.name);if(entry.isDirectory())walk(p);else if(entry.name.endsWith('.html'))files.push(p);}}
walk(root);
const attr=(tag,name)=>tag.match(new RegExp('\\b'+name+'\\s*=\\s*["\\x27]([^"\\x27]*)["\\x27]','i'))?.[1]||'';
for(const file of files){
 const rel=path.relative(root,file).replaceAll('\\','/');
 const html=fs.readFileSync(file,'utf8');
 const head=html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1]||'';
 const tags=[...head.matchAll(/<meta\b[^>]*>/gi)].map(x=>x[0]);
 const desc=tags.find(x=>attr(x,'name').toLowerCase()==='description');
 const robots=tags.find(x=>attr(x,'name').toLowerCase()==='robots');
 const noindex=/noindex/i.test(attr(robots||'','content'));
 if(!/<html\b[^>]*\blang=["']en["']/i.test(html))failures.push(rel+': missing document language');
 if(!/<meta\s+charset=/i.test(head))failures.push(rel+': missing charset');
 if(!tags.some(x=>attr(x,'name').toLowerCase()==='viewport'))failures.push(rel+': missing viewport');
 if(!/<title>[^<]+<\/title>/i.test(head))failures.push(rel+': missing title');
 if(!desc&&!noindex)failures.push(rel+': missing meta description');
 if((html.match(/<h1\b/gi)||[]).length!==1)failures.push(rel+': expected one H1');
 if(!html.includes('site-system.css')||!html.includes('site.js'))failures.push(rel+': missing shared shell CSS or JS');
 if(!html.includes('class="site-header"')||!html.includes('class="site-footer"'))failures.push(rel+': missing shared header/footer');
 if(!noindex&&!/rel=["']canonical["']/i.test(head))failures.push(rel+': missing canonical');
 for(const m of html.matchAll(/<img\b[^>]*>/gi)){if(!/\balt\s*=/i.test(m[0]))failures.push(rel+': image without alt attribute');}
 for(const m of html.matchAll(/(?:href|src)=["'](\/[^"'?#]*)(?:[?#][^"']*)?["']/gi)){
  const url=m[1];if(url.startsWith('//'))continue;
  const decoded=decodeURIComponent(url);
  const disk=path.join(root,decoded.replace(/^\//,''));
  if(!fs.existsSync(disk)&&!fs.existsSync(path.join(disk,'index.html'))&& !fs.existsSync(disk+'.html'))failures.push(rel+': missing local asset/page '+url);
 }
 for(const m of html.matchAll(/(?:href|src)=["']((?:\.\.\/|\.\/)[^"'?#]*)(?:[?#][^"']*)?["']/gi)){
  const url=m[1];const disk=path.resolve(path.dirname(file),decodeURIComponent(url));
  if(!fs.existsSync(disk)&&!fs.existsSync(path.join(disk,'index.html'))&& !fs.existsSync(disk+'.html'))failures.push(rel+': missing relative asset/page '+url);
 }
}
const contact=fs.readFileSync(path.join(root,'contact/index.html'),'utf8');
const form=contact.match(/<form\b[\s\S]*?<\/form>/i)?.[0]||'';
if(!/action=["']https:\/\/formsubmit\.co\//.test(form)||!/method=["']POST["']/i.test(form))failures.push('Contact form POST action missing');
for(const name of ['name','email','message','_next','_honey'])if(!new RegExp('name=["\\x27]'+name+'["\\x27]').test(form))failures.push('Contact form field missing: '+name);
if(!form.includes('required'))failures.push('Contact form required fields missing');
const privacy=fs.readFileSync(path.join(root,'privacy/index.html'),'utf8');
if(!privacy.includes('Google Analytics'))failures.push('Privacy policy does not disclose Google Analytics');
if(/have not (?:added|installed)[^<]*(?:analytics|visitor-analytics)/i.test(privacy))failures.push('Privacy policy contains outdated analytics denial');
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
for(const m of sitemap.matchAll(/<loc>https:\/\/howworkruns\.com(\/[^<]*)<\/loc>/g)){
 const disk=path.join(root,m[1].replace(/^\//,''));
 if(!fs.existsSync(path.join(disk,'index.html')))failures.push('Sitemap URL has no index.html: '+m[1]);
}
const cssBytes=['styles.css','site-system.css','footer.css'].reduce((n,p)=>n+fs.statSync(path.join(root,p)).size,0);
if(cssBytes>220000)warnings.push('Shared CSS exceeds 220 KB; consider consolidation');
console.log(JSON.stringify({pages:files.length,sharedCssBytes:cssBytes,failures,warnings},null,2));
if(failures.length)process.exitCode=1;
