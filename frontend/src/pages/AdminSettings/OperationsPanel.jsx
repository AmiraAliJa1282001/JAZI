import {useEffect, useState} from "react";
import {getOperations,saveOperations,getHours,saveHours,changePassword,logoutOtherSessions} from "../../services/operationsApi";
import "./OperationsPanel.css";
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const BLOCKS = [
  {key:"business", title:"Business Information", fields:[{name:"business_name",label:"Business name"},{name:"email",label:"Email",type:"email"},{name:"whatsapp",label:"WhatsApp number"},{name:"currency",label:"Currency (AED)",readonly:true},{name:"logo",label:"Business logo",type:"file"}]},
  {key:"ordering",title:"Ordering Settings",fields:[{name:"accepting_orders",label:"Accept online orders",type:"checkbox"},{name:"minimum_order",label:"Minimum order (AED)",type:"number"},{name:"preparation_minutes",label:"Preparation time (minutes)",type:"number"},{name:"temporarily_closed",label:"Temporarily closed",type:"checkbox"}]},
  {key:"hours",title:"Business Hours",fields:[{name:"enforce_business_hours",label:"Block orders outside working hours",type:"checkbox"}]},
  {key:"notifications",title:"Notifications",fields:[{name:"order_sound_enabled",label:"Enable new-order sound for employees",type:"checkbox"}]},
  {key:"security",title:"Security & Account",fields:[]},
];
export default function OperationsPanel(){
  const [data,setData]=useState(null),[hours,setHours]=useState([]),[active,setActive]=useState(null),[form,setForm]=useState({}),[logo,setLogo]=useState(null),[password,setPassword]=useState({current_password:"",new_password:""}),[busy,setBusy]=useState(false),[error,setError]=useState(""),[message,setMessage]=useState("");
  useEffect(()=>{Promise.all([getOperations(),getHours()]).then(([a,b])=>{setData(a);setHours(b)}).catch(e=>setError(e.message))},[]);
  function open(block){setActive(block);setForm({...data});setLogo(null);setPassword({current_password:"",new_password:""});setError("");setMessage("");}
  function close(){setActive(null);setError("");}
  async function save(e){e.preventDefault();setBusy(true);setError("");try{
    if(active.key==="security"){await changePassword(password);setMessage("Password changed successfully.");}
    else {const payload=new FormData();for(const field of active.fields){if(field.type==="file"){if(logo)payload.append("logo",logo)}else payload.append(field.name,String(form[field.name]??""));}
      if(active.key==="hours")setHours(await saveHours(hours));
      const result=await saveOperations(payload);setData(result);
      setMessage(`${active.title} saved successfully.`);
    }
    close();
  }catch(err){setError(err.message)}finally{setBusy(false)}}
  async function invalidate(){setBusy(true);setError("");try{await logoutOtherSessions({current_password:password.current_password});setMessage("Other sessions signed out.");close()}catch(err){setError(err.message)}finally{setBusy(false)}}
  return <section className="op-root"><div className="op-heading"><h2>Operations & Security</h2><p>Manage ordering, business hours, notifications and account security.</p></div>
  {error&&!active&&<p className="op-error" role="alert">{error}</p>}{message&&<p className="op-success" role="status">{message}</p>}
  <div className="op-grid">{BLOCKS.map(block=><article className="op-card" key={block.key}><h3>{block.title}</h3><p>{block.key==="ordering"?(data?.accepting_orders?"Online orders enabled":"Online orders paused"):block.key==="business"?(data?.business_name||"Business profile"):block.key==="hours"?"Weekly opening schedule":block.key==="notifications"?"Employee order alerts":"Password and active sessions"}</p><button type="button" disabled={!data} onClick={()=>open(block)}>Edit settings</button></article>)}</div>
  {active&&<div className="op-overlay" onMouseDown={e=>{if(e.target===e.currentTarget&&!busy)close()}}><aside className="op-drawer" role="dialog" aria-modal="true" aria-label={active.title}><header><h2>{active.title}</h2><button type="button" disabled={busy} onClick={close} aria-label="Close">×</button></header><form onSubmit={save}>
  {active.fields.map(field=><label className="op-field" key={field.name}>{field.type==="checkbox"?<><input type="checkbox" checked={Boolean(form[field.name])} onChange={e=>setForm({...form,[field.name]:e.target.checked})}/>{field.label}</>:<>{field.label}<input type={field.type||"text"} readOnly={field.readonly} min={field.name==="preparation_minutes"?1:field.type==="number"?0:undefined} max={field.name==="preparation_minutes"?240:undefined} step={field.type==="number"?"any":undefined} value={field.type==="file"?undefined:(form[field.name]??"")} onChange={e=>field.type==="file"?setLogo(e.target.files?.[0]||null):setForm({...form,[field.name]:e.target.value})}/></>}</label>)}
  {active.key==="hours"&&<div className="op-hours">{hours.map((day,i)=><div className="op-day" key={day.weekday}><strong>{DAYS[day.weekday]}</strong><label><input type="checkbox" checked={day.is_open} onChange={e=>setHours(old=>old.map((x,j)=>j===i?{...x,is_open:e.target.checked}:x))}/> Open</label><input aria-label={`${DAYS[day.weekday]} opens`} type="time" disabled={!day.is_open} value={day.opens_at?.slice(0,5)||"09:00"} onChange={e=>setHours(old=>old.map((x,j)=>j===i?{...x,opens_at:e.target.value}:x))}/><input aria-label={`${DAYS[day.weekday]} closes`} type="time" disabled={!day.is_open} value={day.closes_at?.slice(0,5)||"23:00"} onChange={e=>setHours(old=>old.map((x,j)=>j===i?{...x,closes_at:e.target.value}:x))}/></div>)}</div>}
  {active.key==="security"&&<><label className="op-field">Current password<input required type="password" autoComplete="current-password" value={password.current_password} onChange={e=>setPassword({...password,current_password:e.target.value})}/></label><label className="op-field">New password<input type="password" autoComplete="new-password" value={password.new_password} onChange={e=>setPassword({...password,new_password:e.target.value})}/></label><button type="button" disabled={busy||!password.current_password} className="op-secondary" onClick={invalidate}>Sign out other devices (requires current password)</button></>}
  {error&&<p className="op-error" role="alert">{error}</p>}<footer><button type="button" className="op-secondary" onClick={close} disabled={busy}>Cancel</button><button type="submit" disabled={busy||active.key==="security"&&!password.new_password}>{busy?"Saving...":"Save Changes"}</button></footer></form></aside></div>}
  </section>
}
