const CONFIG={
 API_URL:"https://safwantigershopbot-production.up.railway.app/api/products",
 API_KEY:"PASTE_YOUR_API_KEY_HERE",
 GOOGLE_SHEET_CSV_URL:"https://docs.google.com/spreadsheets/d/1yyntuIltB3Zg26ZpaihejsrdyPbgWfKD1AbFcI5kMOE/edit?usp=drivesdk",
 DISCORD_URL:"https://discord.gg/YOURSERVER",
 TELEGRAM_URL:"https://t.me/YOURUSERNAME",
 WHATSAPP_NUMBER:"8801XXXXXXXXX"
};

const PRICES={
"Gemini Pro 18M":"195","ChatGPT Plus (No Warranty) 1M":"933","ChatGPT K12 Account (10HW) 2 Year":"975",
"ChatGPT Plus Shared Via Extension (NW) 1M":"291","CapCut Pro (FW) 1M":"400","CapCut Pro (FW) 6M":"1617",
"Grok Super (6DW) 9-10D":"377","Super Duolingo Redeem Link 12M":"215","Grok Super (3DW) 9-10D":"365",
"Leonardo Seedance 2.5 (8500 Crd, FW) 1M":"350","Amazon Prime Video 6M":"333","Coursera Premium (1DW) 12M":"468",
"Cursor Pro (FW) 12M":"16900","Canva Admin (2MW) 3 Year":"722","Figma Edu (1MW) 2 Year":"755","EdX Premium (7DW) 12M":"417",
"NordVPN Coupon 3M":"553","MS365 Admin (FW) 1 Year":"1989","QuillBot Premium (FW) 1M":"393","Surfshark Account (FW) 2M":"519",
"CapCut Pro (FW) 7D":"117","Codex API All Plans":"299+","Claude API All Plans":"299+","LinkedIn All Plans":"299+",
"Resend Pro 1 Year":"975","Wispr Flow Pro 12M":"1651","Surfshark VPN Coupon 2M":"274","Notion Business 3M":"417",
"Notion Business 1 Year":"2074","Warp Build 1 Year":"1144","Gamma Pro 1 Year":"3172","Factory 12M":"5707",
"ElevenLabs Creator 1 Year":"6045","Replit Core 1 Year":"4355","n8n Starter 12M":"1820","Runway Pro 12M":"5200",
"YouTube 3M Link":"417","Supabase Pro 12M":"3341","Railway Hobby 12M":"1482","Outlook Ready Mails":"117",
"Lovable Lite Account 12M":"1482","ChatGPT Business (NW) 1M":"1076","Google Pro AI 1 Year":"1651","Higgsfield Pro 1 Year":"15340",
"Lovable Pro 1 Year":"4186","YouTube Premium Admin (FW) 1M":"443","Cursor Pro Plus + Grok Bot 1M":"5200","Manus Pro 1 Year":"5200"
};

let products=[],images={},selected=null;
const $=s=>document.querySelector(s), norm=s=>String(s??"").trim().toLowerCase().replace(/\s+/g," ");
const fallback="data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="650"><rect width="900" height="650" fill="#0d0f12"/><text x="450" y="330" text-anchor="middle" fill="#f5c400" font-family="Arial" font-size="42" font-weight="700">BEST DEAL</text></svg>`);

function field(o,keys,def=""){for(const k of keys)if(o&&o[k]!=null)return o[k];return def}
function category(n){n=n.toLowerCase();if(/chatgpt|gemini|grok|claude|leonardo|cursor|codex|elevenlabs|replit|lovable|manus|higgsfield|gamma|runway|wispr|quillbot|notion|figma|canva|coursera|edx|resend|supabase|railway|warp|factory|n8n/.test(n))return"AI";if(/vpn|surfshark|nordvpn/.test(n))return"VPN";if(/youtube|prime video/.test(n))return"OTT";return"Other"}
function csv(t){let a=[],r=[],c="",q=false;for(let i=0;i<t.length;i++){let x=t[i],n=t[i+1];if(x=='"'&&q&&n=='"'){c+='"';i++;continue}if(x=='"'){q=!q;continue}if(x==','&&!q){r.push(c);c="";continue}if((x=='\n'||x=='\r')&&!q){if(x=='\r'&&n=='\n')i++;r.push(c);c="";if(r.some(v=>v.trim()))a.push(r);r=[];continue}c+=x}if(c||r.length){r.push(c);a.push(r)}return a}
async function sheet(){if(!CONFIG.GOOGLE_SHEET_CSV_URL||CONFIG.GOOGLE_SHEET_CSV_URL.includes("PASTE_"))return;try{let t=await(await fetch(CONFIG.GOOGLE_SHEET_CSV_URL)).text(),rows=csv(t),h=rows.shift().map(x=>x.trim().toLowerCase()),ni=h.findIndex(x=>["product name","name","product"].includes(x)),ii=h.findIndex(x=>["image","image url","imageurl","url"].includes(x));if(ni<0||ii<0)return;rows.forEach(r=>{if(r[ni]&&r[ii])images[norm(r[ni])]=r[ii].trim()})}catch(e){console.warn(e)}}
function normalize(data){let arr=Array.isArray(data)?data:(data?.products||data?.data||data?.items||[]);return(Array.isArray(arr)?arr:[]).map((p,i)=>{let name=String(field(p,["name","title","product_name","productName","display_name"],`Product ${i+1}`));return{id:field(p,["id","_id"],i),name,description:String(field(p,["description","details","short_description","shortDescription","product_description"],"Premium digital product. Contact us for ordering details.")),stock:Number(field(p,["stock","quantity","inventory","available_stock","availableStock","stock_quantity","stockQuantity","currentStock","remaining","available"],0))||0,image:field(p,["image","image_url","imageUrl","thumbnail","thumbnail_url","photo"],"")||images[norm(name)]||fallback,category:field(p,["category","type"],category(name))}})}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function price(n){let k=Object.keys(PRICES).find(x=>norm(x)==norm(n));return k?PRICES[k]:"0"}
function render(){let q=norm($("#search").value),cat=$(".filters .active")?.dataset.cat||"All",list=products.filter(p=>(!q||norm(p.name).includes(q))&&(cat=="All"||p.category==cat));$("#grid").innerHTML=list.length?list.map(p=>`<article class="product" data-id="${esc(p.id)}"><div class="pimg"><img src="${p.image||fallback}" onerror="this.src=fallback" alt="${esc(p.name)}"></div><div class="pinfo"><span class="tag">${esc(p.category)}</span><h3>${esc(p.name)}</h3><div class="meta"><span class="price">৳${price(p.name)}</span><span class="stock ${p.stock<=0?"out":""}">${p.stock>0?"Stock: "+p.stock:"Out of Stock"}</span></div></div></article>`).join(""):`<div class="empty">No products found.</div>`;document.querySelectorAll(".product").forEach((el,i)=>{el.onclick=()=>openDetails(products.find(p=>String(p.id)==el.dataset.id));setTimeout(()=>el.classList.add("show"),i*30)})}
function openDetails(p){if(!p)return;selected=p;$("#dimg").src=p.image||fallback;$("#dimg").onerror=()=>$("#dimg").src=fallback;$("#dcat").textContent=p.category;$("#dname").textContent=p.name;$("#dprice").textContent="৳"+price(p.name);$("#dstock").textContent=p.stock>0?"Stock: "+p.stock:"Out of Stock";$("#ddesc").textContent=p.description;$("#details").classList.add("show");document.body.style.overflow="hidden"}
function close(id){$(id).classList.remove("show");if(!document.querySelector(".modal.show"))document.body.style.overflow=""}
$("#orderBtn").onclick=()=>{if(!selected)return;$("#orderName").textContent=selected.name;$("#discord").href=CONFIG.DISCORD_URL;$("#telegram").href=CONFIG.TELEGRAM_URL;$("#whatsapp").href="https://wa.me/"+CONFIG.WHATSAPP_NUMBER;close("#details");$("#order").classList.add("show")};
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>close("#"+b.dataset.close));
document.querySelectorAll(".modal").forEach(m=>m.onclick=e=>{if(e.target===m)close("#"+m.id)});
$("#search").oninput=render;$("#filters").onclick=e=>{let b=e.target.closest("button");if(!b)return;document.querySelectorAll(".filters button").forEach(x=>x.classList.remove("active"));b.classList.add("active");render()};
$("#menuBtn").onclick=()=>$("#nav").classList.toggle("open");document.querySelectorAll("nav a").forEach(a=>a.onclick=()=>$("#nav").classList.remove("open"));
window.onscroll=()=>document.querySelector(".header").classList.toggle("scrolled",scrollY>20);
new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("show")}),{threshold:.12}).observe(document.querySelector(".hero-inner"));
async function load(){try{await sheet();let h={"Accept":"application/json"};if(CONFIG.API_KEY&&!CONFIG.API_KEY.includes("PASTE_")){h.Authorization="Bearer "+CONFIG.API_KEY;h["X-API-Key"]=CONFIG.API_KEY}let r=await fetch(CONFIG.API_URL,{headers:h});if(!r.ok)throw Error("API "+r.status);products=normalize(await r.json());products.forEach(p=>{if(images[norm(p.name)])p.image=images[norm(p.name)]});$("#productCount").textContent=products.length;render()}catch(e){console.error(e);$("#grid").innerHTML='<div class="empty"><i class="fa-solid fa-triangle-exclamation"></i><br><br>Could not load products.<br><small>Check API URL/key and response format.</small></div>'}}
load();
