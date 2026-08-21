const DEMO_COURSE={
 id:"course-ai-automation",
 title:"Learn to Sell Digital Products Using AI on Automation",
 category:"AI & Automation",
 access:"premium",
 price:"Premium",
 description:"A practical learning path for creating, packaging and selling digital products with AI-powered automation.",
 thumbnail:"assets/images/logo.png",
 modules:[
  {id:"m1",title:"Getting Started",lessons:[
    {id:"l1",title:"Course Orientation",video:"",pdf:""},
    {id:"l2",title:"Digital Product Opportunities",video:"",pdf:""}
  ]},
  {id:"m2",title:"AI Product Creation",lessons:[
    {id:"l3",title:"Research with AI",video:"",pdf:""},
    {id:"l4",title:"Build Your Product Workflow",video:"",pdf:""}
  ]},
  {id:"m3",title:"Automation",lessons:[
    {id:"l5",title:"Automation Fundamentals",video:"",pdf:""},
    {id:"l6",title:"Connect Your Workflow",video:"",pdf:""}
  ]},
  {id:"m4",title:"Selling & Scaling",lessons:[
    {id:"l7",title:"Offer and Pricing",video:"",pdf:""},
    {id:"l8",title:"Launch Workflow",video:"",pdf:""}
  ]}
 ]
};

const STORE="sayeed_academy_v2";
const saved=JSON.parse(localStorage.getItem(STORE)||"null");
const state=saved||{
 theme:"dark",
 courses:[DEMO_COURSE],
 progress:{},
 bookmarks:[],
 lastLesson:null
};
if(!state.courses?.length) state.courses=[DEMO_COURSE];

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

function persist(){localStorage.setItem(STORE,JSON.stringify(state));}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(window._toast);window._toast=setTimeout(()=>t.classList.remove("show"),2600)}
function theme(){document.documentElement.dataset.theme=state.theme;$("#themeText").textContent=state.theme==="dark"?"Light theme":"Dark theme";$("#themeIcon").textContent=state.theme==="dark"?"☀":"☾";localStorage.setItem(STORE,JSON.stringify(state))}
function toggleTheme(){state.theme=state.theme==="dark"?"light":"dark";theme();}

function navigate(page){
  $$(".page").forEach(p=>p.classList.remove("active"));
  $(`#page-${page}`).classList.add("active");
  $$(".nav-link").forEach(n=>n.classList.toggle("active",n.dataset.page===page));
  $("#sidebar").classList.remove("open");
  window.scrollTo({top:0,behavior:"smooth"});
  if(page==="courses") renderCourses();
  if(page==="library") renderLibrary();
  if(page==="bookmarks") renderBookmarks();
}

function card(c){
  const done=courseProgress(c);
  return `<article class="course-card">
    <div class="course-thumb"><span class="course-badge">${c.access.toUpperCase()}</span><img src="${c.thumbnail}" alt="">
      <div class="thumb-copy"><small>${esc(c.category)}</small><strong>${esc(c.title)}</strong></div>
    </div>
    <div class="course-body"><h3>${esc(c.title)}</h3><p>${esc(c.description)}</p>
      <div class="meta"><span>◉ ${c.modules.length} Modules</span><span>▶ ${countLessons(c)} Lessons</span></div>
      <div class="course-footer"><span class="price">${esc(c.price)}</span><button class="open-btn" data-open="${c.id}">Open Course →</button></div>
      <div class="progress-track"><span style="width:${done}%"></span></div>
    </div>
  </article>`;
}
function countLessons(c){return c.modules.reduce((n,m)=>n+m.lessons.length,0)}
function courseProgress(c){const total=countLessons(c);if(!total)return 0;let done=0;c.modules.forEach(m=>m.lessons.forEach(l=>{if(state.progress[l.id])done++}));return Math.round(done/total*100)}
function renderHome(){const c=state.courses[0];$("#homeCourses").innerHTML=state.courses.slice(0,3).map(card).join("");$("#courseCount").textContent=state.courses.length;$("#heroCourseCount").textContent=String(state.courses.length).padStart(2,"0");bindOpen()}
function renderCourses(){
 const q=$("#searchInput").value.toLowerCase().trim();
 const active=$(".filter.active")?.dataset.filter||"all";
 let list=state.courses.filter(c=>(!q||(c.title+" "+c.category+" "+c.description).toLowerCase().includes(q)));
 if(active==="free")list=list.filter(c=>c.access==="free");
 if(active==="premium")list=list.filter(c=>c.access==="premium");
 if(active==="ai")list=list.filter(c=>c.category.toLowerCase().includes("ai"));
 $("#allCourses").innerHTML=list.map(card).join("");
 $("#resultCount").textContent=`${list.length} course${list.length!==1?"s":""}`;
 $("#noResults").classList.toggle("hidden",list.length>0);
 bindOpen();
}
function bindOpen(){$$("[data-open]").forEach(b=>b.onclick=()=>openCourse(b.dataset.open))}
function openCourse(id){
 const c=state.courses.find(x=>x.id===id);if(!c)return;
 $("#courseDetail").innerHTML=`<div class="detail-top"><div><span class="kicker">${esc(c.category)} • ${esc(c.access.toUpperCase())}</span><h2>${esc(c.title)}</h2><p>${esc(c.description)}</p></div></div>
 <div class="detail-body"><div class="course-stats"><span>◉ ${c.modules.length} Modules</span><span>▶ ${countLessons(c)} Lessons</span><span>✓ ${courseProgress(c)}% Complete</span></div>
 ${c.modules.map((m,i)=>moduleHTML(c,m,i)).join("")}
 <div class="telegram-note"><b>Content setup:</b> Videos can be played inside this app when a YouTube URL is added from Admin. PDFs/resources can point to your Telegram channel. The app does not bypass private Telegram access controls.</div></div>`;
 $("#courseModal").classList.add("show");
 $$(".module-head button").forEach(b=>b.onclick=()=>{const x=b.closest(".module").querySelector(".lessons");x.hidden=!x.hidden});
 $$("[data-play]").forEach(b=>b.onclick=()=>playVideo(c,b.dataset.play));
 $$("[data-pdf]").forEach(b=>b.onclick=()=>openPdf(c,b.dataset.pdf));
 $$("[data-book]").forEach(b=>b.onclick=()=>toggleBookmark(c,b.dataset.book));
}
function moduleHTML(c,m,i){
 return `<div class="module"><div class="module-head"><div><b>Module ${String(i+1).padStart(2,"0")} — ${esc(m.title)}</b></div><button>⌄</button></div><div class="lessons">${m.lessons.map((l,j)=>{
 const marked=!!state.progress[l.id],book=state.bookmarks.includes(l.id);
 return `<div class="lesson"><div class="lesson-main"><span class="lesson-icon">${marked?"✓":"▶"}</span><div><b>${esc(l.title)}</b><small>${l.video?"Video ready":"Video not configured"} ${l.pdf?"• PDF ready":""}</small></div></div><div class="lesson-actions">${l.video?`<button class="small-btn play" data-play="${l.id}">▶ Play</button>`:""}${l.pdf?`<button class="small-btn" data-pdf="${l.id}">PDF</button>`:""}<button class="small-btn" data-book="${l.id}">${book?"★":"☆"}</button></div></div>`;
 }).join("")}</div></div>`;
}
function findLesson(id){for(const c of state.courses)for(const m of c.modules)for(const l of m.lessons)if(l.id===id)return {c,m,l};return null}
function playVideo(c,lid){
 const x=findLesson(lid);if(!x||!x.l.video){toast("Add a YouTube URL for this lesson in Admin.");return}
 const embed=toYouTube(x.l.video);if(!embed){toast("Please use a valid YouTube video URL.");return}
 $("#videoTitle").textContent=x.l.title;$("#videoFrame").innerHTML=`<iframe src="${embed}" title="${esc(x.l.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
 $("#videoModal").classList.add("show");
 state.progress[lid]=true;state.lastLesson=lid;persist();
}
function toYouTube(url){
 try{
  const u=new URL(url);
  if(u.hostname.includes("youtu.be"))return "https://www.youtube.com/embed/"+u.pathname.slice(1).split("?")[0]+"?rel=0";
  if(u.hostname.includes("youtube.com")){
   const id=u.searchParams.get("v")||u.pathname.match(/\/embed\/([^/]+)/)?.[1]||u.pathname.match(/\/shorts\/([^/]+)/)?.[1];
   return id?"https://www.youtube.com/embed/"+id+"?rel=0":null;
  }
 }catch(e){}
 return null;
}
function openPdf(c,lid){const x=findLesson(lid);if(x?.l.pdf)window.open(x.l.pdf,"_blank","noopener");else toast("Add a Telegram PDF/resource link in Admin.")}
function toggleBookmark(c,lid){const i=state.bookmarks.indexOf(lid);if(i>=0){state.bookmarks.splice(i,1);toast("Removed from bookmarks")}else{state.bookmarks.push(lid);toast("Lesson bookmarked")}persist();openCourse(c.id);renderBookmarks()}
function renderLibrary(){
 const c=state.courses.find(x=>x.id===state.lastLesson)||state.courses[0];
 if(!c){$("#libraryContent").innerHTML=emptyHTML("Your library is empty","Open a course to begin.");return}
 const p=courseProgress(c);
 $("#libraryContent").innerHTML=`<div class="library-card"><img class="library-cover" src="${c.thumbnail}" alt=""><div class="library-info"><span class="kicker">${esc(c.category)}</span><h3>${esc(c.title)}</h3><p>${p}% complete • ${countLessons(c)} lessons</p><div class="progress-track"><span style="width:${p}%"></span></div></div><button class="btn primary" data-open-library="${c.id}">${p?"Continue":"Start"} →</button></div>`;
 $$("[data-open-library]").forEach(b=>b.onclick=()=>openCourse(b.dataset.openLibrary));
}
function renderBookmarks(){
 const arr=state.bookmarks.map(findLesson).filter(Boolean);
 if(!arr.length){$("#bookmarkContent").innerHTML=emptyHTML("No bookmarks yet","Open a course and tap ☆ on a lesson to save it.");return}
 $("#bookmarkContent").innerHTML=`<div class="bookmark-list">${arr.map(x=>`<div class="bookmark-item"><div><b>${esc(x.l.title)}</b><small>${esc(x.c.title)} • ${esc(x.m.title)}</small></div><button class="small-btn play" data-book-open="${x.l.id}">Open</button></div>`).join("")}</div>`;
 $$("[data-book-open]").forEach(b=>b.onclick=()=>openCourse(findLesson(b.dataset.bookOpen).c.id));
}
function emptyHTML(h,p){return `<div class="empty"><div class="empty-icon">☆</div><h3>${h}</h3><p>${p}</p></div>`}
function renderAdmin(){
 const c=state.courses[0];
 $("#aTitle").value=c.title;$("#aCategory").value=c.category;$("#aAccess").value=c.access;$("#aDesc").value=c.description;
 $("#adminModules").innerHTML=c.modules.map((m,i)=>`<div class="module-admin"><div class="module-admin-head"><b>Module ${i+1} — ${esc(m.title)}</b><button data-del-module="${m.id}">Delete</button></div>${m.lessons.map(l=>`<div class="lesson-admin">• ${esc(l.title)} ${l.video?" — video ready":""} ${l.pdf?" — PDF ready":""}</div>`).join("")}</div>`).join("");
 $$("[data-del-module]").forEach(b=>b.onclick=()=>{if(c.modules.length===1){toast("Keep at least one module.");return}c.modules=c.modules.filter(m=>m.id!==b.dataset.delModule);persist();renderAdmin();renderHome();renderCourses()});
}
function saveCourse(){
 const c=state.courses[0];c.title=$("#aTitle").value.trim()||DEMO_COURSE.title;c.category=$("#aCategory").value.trim()||"General";c.access=$("#aAccess").value;c.price=c.access==="premium"?"Premium":"Free";c.description=$("#aDesc").value.trim();persist();renderHome();renderCourses();renderAdmin();toast("Course saved locally.");
}
function saveMedia(){
 const c=state.courses[0],v=$("#aVideo").value.trim(),p=$("#aPdf").value.trim();
 const first=c.modules[0]?.lessons[0];if(!first){toast("No lesson available.");return}
 first.video=v;first.pdf=p;persist();renderAdmin();renderHome();renderCourses();toast("Media saved to the first demo lesson. Add lesson-specific fields in the next builder phase.");
}
function addModule(){
 const name=$("#moduleName").value.trim();if(!name){toast("Enter a module name.");return}
 const c=state.courses[0];c.modules.push({id:"m"+Date.now(),title:name,lessons:[{id:"l"+Date.now(),title:"New Lesson",video:"",pdf:""}]});$("#moduleName").value="";persist();renderAdmin();renderCourses();toast("Module added.");
}
function exportData(){
 const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="sayeed-academy-backup.json";a.click();URL.revokeObjectURL(a.href);toast("Backup exported.");
}
function importData(file){const r=new FileReader();r.onload=()=>{try{const x=JSON.parse(r.result);if(!x.courses)throw Error();localStorage.setItem(STORE,JSON.stringify(x));location.reload()}catch(e){toast("Invalid Sayeed Academy backup.")}};r.readAsText(file)}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}

function init(){
 theme();renderHome();renderCourses();renderLibrary();renderBookmarks();renderAdmin();
 $$("[data-page]").forEach(b=>b.onclick=()=>navigate(b.dataset.page));
 $("#themeBtn").onclick=toggleTheme;$("#themeTop").onclick=toggleTheme;
 $("#menuBtn").onclick=()=>$("#sidebar").classList.toggle("open");
 $("#closeModal").onclick=()=>$("#courseModal").classList.remove("show");
 $("#closeVideo").onclick=()=>{ $("#videoModal").classList.remove("show");$("#videoFrame").innerHTML="" };
 $("#courseModal").onclick=e=>{if(e.target.id==="courseModal")e.currentTarget.classList.remove("show")};
 $("#videoModal").onclick=e=>{if(e.target.id==="videoModal"){e.currentTarget.classList.remove("show");$("#videoFrame").innerHTML=""}};
 $("#searchInput").oninput=()=>{navigate("courses");renderCourses()};
 $$(".filter").forEach(b=>b.onclick=()=>{$$(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderCourses()});
 $("#saveCourseBtn").onclick=saveCourse;$("#saveMediaBtn").onclick=saveMedia;$("#addModuleBtn").onclick=addModule;$("#exportBtn").onclick=exportData;
 $("#importFile").onchange=e=>e.target.files[0]&&importData(e.target.files[0]);
 $("#resetBtn").onclick=()=>{if(confirm("Reset Sayeed Academy demo data?")){localStorage.removeItem(STORE);location.reload()}};
}
init();
