"use client";
import { useState } from "react";
import Link from "next/link";

const machines = [
  { model: "CBE-OM-480", name: "Open Mouth Bag Filler 480", serial: "CBE-2023-04872", purchased: "Mar 15, 2023", partsCount: 24, status: "Active" },
  { model: "CBE-VB-320", name: "Valve Bag Filler 320", serial: "CBE-2022-03156", purchased: "Aug 8, 2022", partsCount: 18, status: "Active" },
  { model: "CBE-BF-600", name: "Bulk Bag Filler System 600", serial: "CBE-2024-05901", purchased: "Jan 22, 2024", partsCount: 31, status: "Active" },
];
const orders = [
  { id: "CBE-ORD-4821", date: "Feb 26, 2025", items: "Sealing Bar Assembly, Sensor Kit", itemCount: 2, total: "$630.00", status: "Shipped", tracking: "1Z999AA10123456784", machine: "CBE-OM-480" },
  { id: "CBE-ORD-4790", date: "Feb 12, 2025", items: "Drive Motor 2HP", itemCount: 1, total: "$890.00", status: "Delivered", tracking: "1Z999AA10123456785", machine: "CBE-OM-480" },
  { id: "CBE-ORD-4756", date: "Jan 28, 2025", items: "Conveyor Belt 24in, Bag Clamp Set (x2)", itemCount: 3, total: "$710.00", status: "Delivered", tracking: "1Z999AA10123456786", machine: "CBE-VB-320" },
  { id: "CBE-ORD-4701", date: "Jan 5, 2025", items: "HMI Touchscreen Panel", itemCount: 1, total: "$1,250.00", status: "Delivered", tracking: "1Z999AA10123456787", machine: "CBE-OM-480" },
  { id: "CBE-ORD-4655", date: "Dec 10, 2024", items: "Complete Wear Parts Kit", itemCount: 1, total: "$2,340.00", status: "Delivered", tracking: "1Z999AA10123456788", machine: "CBE-BF-600" },
  { id: "CBE-ORD-4598", date: "Nov 3, 2024", items: "Proximity Sensor Kit, Air Cylinder Assembly", itemCount: 2, total: "$485.00", status: "Delivered", tracking: null, machine: "CBE-OM-480" },
  { id: "CBE-ORD-4541", date: "Sep 18, 2024", items: "PLC Control Board", itemCount: 1, total: "$1,680.00", status: "Delivered", tracking: null, machine: "CBE-VB-320" },
];
const inquiries = [
  { ref: "INQ-2025-0034", date: "Feb 20, 2025", type: "Custom Open Mouth Bagger", status: "Quote Sent", desc: "50lb capacity, stainless steel 316, FDA compliant, explosion-proof motors.", quoteAmount: "$68,500" },
  { ref: "INQ-2024-0089", date: "Nov 5, 2024", type: "Bulk Bag Filler Upgrade", status: "Accepted", desc: "Upgrade existing CBE-BF-600 with new Allen-Bradley PLC controls.", quoteAmount: "$12,400" },
  { ref: "INQ-2024-0072", date: "Aug 14, 2024", type: "Valve Bag Filler New Line", status: "Completed", desc: "Second valve filler for pet food production. Carbon steel, 6-10 bags/min.", quoteAmount: "$41,200" },
];
const recommendedParts = [
  { name: "Sealing Bar Assembly", partNo: "CBE-SB-480A", price: "$485.00", reason: "Recommended for CBE-OM-480 at 24 months. Purchased Mar 2023.", urgency: "high" },
  { name: "Filter Screen Mesh Kit", partNo: "CBE-FS-320M", price: "$165.00", reason: "Wear part for CBE-VB-320 due at 18 months. Purchased Aug 2022.", urgency: "medium" },
  { name: "Proximity Sensor Set", partNo: "CBE-PS-600S", price: "$210.00", reason: "Frequently ordered for CBE-BF-600 systems. Preventive replacement.", urgency: "low" },
];

function StatusBadge({ status }) {
  const c = { Shipped:{bg:"#DBEAFE",text:"#1E40AF"}, Delivered:{bg:"#DCFCE7",text:"#166534"}, Processing:{bg:"#FEF3C7",text:"#92400E"}, "Quote Sent":{bg:"#FFF3E0",text:"#B45309"}, Accepted:{bg:"#DCFCE7",text:"#166534"}, Completed:{bg:"#F3F4F6",text:"#374151"}, Active:{bg:"#DCFCE7",text:"#166534"} }[status] || {bg:"#F3F4F6",text:"#6B7280"};
  return <span style={{background:c.bg,color:c.text,padding:"3px 10px",borderRadius:4,fontSize:11,fontWeight:600}}>{status}</span>;
}

function RegisterMachineModal({ onClose }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}}>
      <div style={{background:"#fff",borderRadius:14,width:"100%",maxWidth:680,maxHeight:"90vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
        <div style={{padding:"24px 28px",borderBottom:"1px solid #F3F4F6",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:20,fontWeight:700,color:"#1B2A4A"}}>Register a Machine</div>
            <div style={{fontSize:13,color:"#6B7280",marginTop:4}}>Add a CBE machine to your account to unlock personalized parts ordering. Verified within 1 business day.</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:22,color:"#9CA3AF",cursor:"pointer",padding:4}}>✕</button>
        </div>
        <div style={{padding:28}}>
          <div style={{display:"flex",gap:0,marginBottom:28}}>
            {[
              { num:"1", label:"Enter Details", sub:"Model and serial", status:"cur" },
              { num:"2", label:"Submit", sub:"Send for verification", status:"pen" },
              { num:"3", label:"Admin Verifies", sub:"Within 1 business day", status:"pen" },
              { num:"4", label:"Machine Added", sub:"Parts unlocked", status:"pen" },
            ].map((s,i)=>(
              <div key={i} style={{flex:1,textAlign:"center",position:"relative"}}>
                <div style={{width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,margin:"0 auto 8px",background:s.status==="cur"?"#E8941A":"#F3F4F6",color:s.status==="cur"?"#fff":"#9CA3AF"}}>{s.num}</div>
                <div style={{fontSize:12,fontWeight:600,color:"#374151"}}>{s.label}</div>
                <div style={{fontSize:11,color:"#9CA3AF",marginTop:2}}>{s.sub}</div>
                {i<3&&<div style={{position:"absolute",top:15,left:"55%",right:"-45%",height:2,background:"#E5E7EB"}}/>}
              </div>
            ))}
          </div>
          <div className="form-grid" style={{maxWidth:600}}>
            <div><label className="form-label">Machine Model *</label><select className="form-input" style={{cursor:"pointer"}}><option>Select CBE model...</option><option>CBE-OM-480 - Open Mouth Bag Filler 480</option><option>CBE-OM-320 - Open Mouth Bag Filler 320</option><option>CBE-VB-320 - Valve Bag Filler 320</option><option>CBE-BF-600 - Bulk Bag Filler 600</option><option>CBE-BU-400 - Bulk Bag Unloader 400</option><option>CBE-SL-200 - Bag Sealer 200</option><option>Other / Older Model</option></select></div>
            <div><label className="form-label">Serial Number *</label><input className="form-input" placeholder="e.g., CBE-2023-04872"/><div style={{fontSize:11,color:"#9CA3AF",marginTop:4}}>Found on the machine nameplate near controls</div></div>
            <div><label className="form-label">Approximate Purchase Date</label><input className="form-input" type="month"/></div>
            <div><label className="form-label">Facility Location</label><select className="form-input" style={{cursor:"pointer"}}><option>Select address...</option><option>Main Plant - Wichita, KS</option><option>Satellite - Topeka, KS</option><option>+ Add new location</option></select></div>
          </div>
          <div style={{marginTop:18}}><label className="form-label">Additional Notes (Optional)</label><textarea className="form-input" style={{height:60,resize:"vertical"}} placeholder="Modifications made, configuration details, etc."/></div>
          <div style={{marginTop:24,display:"flex",gap:12}}>
            <button className="btn-primary">Submit for Verification</button>
            <button className="btn-outline" onClick={onClose}>Cancel</button>
          </div>
        </div>
        <div style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:"0 0 14px 14px",padding:20}}>
          <div style={{fontWeight:700,fontSize:14,color:"#166534",marginBottom:6}}>What happens after registration?</div>
          <div style={{fontSize:13,color:"#15803D",lineHeight:1.7}}>Our admin team verifies your serial number against CBE sales records. Once confirmed, the machine appears in My Machines and all compatible replacement parts are shown automatically. You will receive an email confirmation when verified.</div>
        </div>
      </div>
    </div>
  );
}

export default function CustomerPortal() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orderFilter, setOrderFilter] = useState("All");
  const [inquiryFilter, setInquiryFilter] = useState("All");
  const [showRegister, setShowRegister] = useState(false);
  const tabs = [{id:"dashboard",label:"Dashboard",icon:"📊"},{id:"machines",label:"My Machines",icon:"🏭"},{id:"orders",label:"Order History",icon:"📦"},{id:"inquiries",label:"Machine Inquiries",icon:"💬"},{id:"profile",label:"Profile & Addresses",icon:"👤"}];
  const filteredOrders = orders.filter(o => orderFilter === "All" || o.status === orderFilter);
  const filteredInquiries = inquiries.filter(i => inquiryFilter === "All" || i.status === inquiryFilter);
  return (
    <div style={{fontFamily:"'Inter',system-ui,sans-serif",background:"#F5F6F8",minHeight:"100vh",color:"#1A1A1A"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .top-nav{background:#1B2A4A;padding:0 48px;height:60px;display:flex;align-items:center;justify-content:space-between}
        .cb-logo{font-weight:800;font-size:17px;color:#fff;display:flex;align-items:center;gap:10px}
        .cb-logo .check{color:#E8941A;font-size:22px}
        .cb-logo .sub{font-size:12px;font-weight:400;color:#8B9DC3;margin-left:8px}
        .top-right{display:flex;align-items:center;gap:14px}
        .user-pill{background:#243656;padding:6px 14px;border-radius:6px;color:#C9D5E8;font-weight:600;font-size:12px}
        .cross-link{color:#8B9DC3;font-size:12px;font-weight:500;cursor:pointer;text-decoration:none;padding:6px 12px;border-radius:6px;border:1px solid rgba(139,157,195,0.25);transition:all .15s}
        .cross-link:hover{color:#E8941A;border-color:rgba(232,148,26,0.4)}
        .portal-nav{background:#fff;border-bottom:2px solid #F0F1F3;padding:0 48px;display:flex}
        .ptab{padding:14px 24px;font-size:13px;font-weight:500;color:#9CA3AF;cursor:pointer;border-bottom:2px solid transparent;display:flex;align-items:center;gap:8px;transition:all .15s;margin-bottom:-2px}
        .ptab:hover{color:#1B2A4A} .ptab.active{color:#E8941A;border-color:#E8941A;font-weight:600}
        .content{padding:32px 48px;max-width:1200px}
        .page-title{font-size:24px;font-weight:700;color:#1B2A4A}
        .page-sub{font-size:14px;color:#6B7280;margin-top:4px}
        .section-title{font-size:22px;font-weight:700;color:#1B2A4A}
        .two-col{display:grid;grid-template-columns:5fr 3fr;gap:20px}
        .stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:24px 0}
        .stat-card{background:#fff;border-radius:10px;padding:18px;border:1px solid #E5E7EB}
        .stat-label{font-size:11px;color:#8B9DC3;font-weight:600;text-transform:uppercase;letter-spacing:.3px}
        .stat-value{font-size:26px;font-weight:700;color:#1B2A4A;margin-top:4px}
        .stat-sub{font-size:11px;color:#6B7280;margin-top:2px}
        .panel{background:#fff;border-radius:10px;border:1px solid #E5E7EB;overflow:hidden;margin-bottom:20px}
        .panel-head{padding:16px 20px;border-bottom:1px solid #F3F4F6;display:flex;justify-content:space-between;align-items:center}
        .panel-title{font-weight:700;font-size:15px;color:#1B2A4A}
        .panel-link{font-size:12px;color:#E8941A;font-weight:600;cursor:pointer}
        table{width:100%;border-collapse:collapse}
        th{text-align:left;padding:10px 16px;font-size:11px;font-weight:600;color:#8B9DC3;text-transform:uppercase;letter-spacing:.5px;background:#FAFBFC;border-bottom:1px solid #F3F4F6}
        td{padding:12px 16px;font-size:13px;color:#374151;border-bottom:1px solid #F3F4F6}
        tr:hover td{background:#FAFBFC}
        .mc-row{padding:18px 20px;border-bottom:1px solid #F3F4F6;display:flex;align-items:center;gap:16px;cursor:pointer;transition:background .1s}
        .mc-row:hover{background:#FFFBF5} .mc-row:last-child{border-bottom:none}
        .mc-icon{width:52px;height:52px;background:linear-gradient(135deg,#FFF8EC,#FEEBC8);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;border:1px solid #FFE0A0}
        .mc-model{font-size:12px;color:#E8941A;font-weight:600;font-family:monospace}
        .mc-name{font-weight:600;font-size:14px;color:#1B2A4A;margin:2px 0}
        .mc-meta{font-size:12px;color:#9CA3AF}
        .mc-right{margin-left:auto}
        .parts-btn{background:#FFF8EC;color:#E8941A;border:1px solid #FBBF24;padding:6px 14px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit}
        .parts-btn:hover{background:#FFF0D6;border-color:#E8941A}
        .fm-card{padding:24px;border-bottom:1px solid #F3F4F6;display:flex;gap:20px;align-items:flex-start}
        .fm-card:last-child{border-bottom:none}
        .fm-icon-lg{width:72px;height:72px;background:linear-gradient(135deg,#FFF8EC,#FEEBC8);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:32px;flex-shrink:0;border:1px solid #FFE0A0}
        .fm-info{flex:1} .fm-name{font-weight:700;font-size:17px;color:#1B2A4A;margin:2px 0 8px}
        .fm-meta-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:10px}
        .fm-meta-label{font-size:11px;color:#8B9DC3;font-weight:500}
        .fm-meta-val{font-size:13px;color:#374151;font-weight:600;margin-top:2px}
        .fm-actions{display:flex;gap:8px;align-items:flex-start;flex-shrink:0}
        .rec-card{padding:16px 20px;border-bottom:1px solid #F3F4F6} .rec-card:last-child{border-bottom:none}
        .rec-name{font-weight:600;font-size:13px;color:#1B2A4A}
        .rec-partno{font-size:11px;color:#E8941A;font-family:monospace;font-weight:500;margin-top:2px}
        .rec-reason{font-size:12px;color:#6B7280;margin:6px 0 10px;line-height:1.5}
        .rec-bottom{display:flex;justify-content:space-between;align-items:center}
        .rec-price{font-weight:700;font-size:15px;color:#1B2A4A}
        .rec-add{background:#1B2A4A;color:#fff;border:none;padding:6px 14px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit}
        .inq-card{padding:20px;border-bottom:1px solid #F3F4F6} .inq-card:last-child{border-bottom:none}
        .inq-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
        .inq-ref{font-size:12px;font-weight:600;color:#E8941A;font-family:monospace}
        .inq-type{font-weight:700;font-size:15px;color:#1B2A4A;margin-bottom:4px}
        .inq-desc{font-size:13px;color:#6B7280;line-height:1.6}
        .inq-footer{display:flex;justify-content:space-between;align-items:center;margin-top:10px}
        .inq-date{font-size:11px;color:#9CA3AF}
        .inq-amount{font-weight:700;font-size:14px;color:#1B2A4A}
        .btn-primary{background:#E8941A;color:#fff;border:none;padding:10px 24px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit}
        .btn-primary:hover{background:#D4840A}
        .btn-outline{background:#fff;color:#1B2A4A;border:1px solid #D1D5DB;padding:10px 24px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit}
        .btn-outline:hover{border-color:#E8941A;color:#E8941A}
        .action-sm{background:none;border:1px solid #D1D5DB;padding:4px 10px;border-radius:4px;font-size:11px;color:#6B7280;cursor:pointer;font-family:inherit;margin-right:4px}
        .action-sm:hover{border-color:#E8941A;color:#E8941A}
        .filter-row{display:flex;gap:8px;margin-bottom:18px;flex-wrap:wrap}
        .fpill{padding:6px 14px;border-radius:20px;border:1px solid #D1D5DB;font-size:12px;font-weight:500;color:#6B7280;cursor:pointer;background:#fff;font-family:inherit}
        .fpill.active{background:#E8941A;color:#fff;border-color:#E8941A}
        .fpill:hover{border-color:#E8941A}
        .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .form-label{font-size:12px;font-weight:600;color:#374151;margin-bottom:6px;display:block}
        .form-input{width:100%;padding:10px 14px;border:1px solid #D1D5DB;border-radius:8px;font-size:13px;font-family:inherit;outline:none;color:#374151;background:#FAFBFC}
        .form-input:focus{border-color:#E8941A;background:#fff;box-shadow:0 0 0 3px rgba(232,146,12,.1)}
        .search-input{padding:8px 14px;border:1px solid #D1D5DB;border-radius:6px;font-size:13px;font-family:inherit;outline:none;width:240px}
        .search-input:focus{border-color:#E8941A}
        .addr-card{border:1px solid #E5E7EB;border-radius:8px;padding:16px;margin-bottom:12px}
        .addr-label{font-size:11px;font-weight:600;color:#E8941A;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px}
        .addr-text{font-size:13px;color:#4B5563;line-height:1.6}
        .info-orange{background:#FFF8EC;border:1px solid #FBBF24;border-radius:10px;padding:20px}
        .info-yellow{background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;padding:12px 16px}
      `}</style>

      {showRegister && <RegisterMachineModal onClose={() => setShowRegister(false)} />}

      {/* TOP NAV — clean: logo + company name + cross-link to Parts Store */}
      <nav className="top-nav">
        <div style={{display:"flex",alignItems:"center",gap:32}}>
          <div className="cb-logo"><span className="check">&#10003;</span>CHOICE BAGGING EQUIPMENT<span className="sub">/ Customer Portal</span></div>
        </div>
        <div className="top-right">
          <Link href="/parts" className="cross-link" style={{color:"#8B9DC3",fontSize:12,fontWeight:500,textDecoration:"none",padding:"6px 12px",borderRadius:6,border:"1px solid rgba(139,157,195,0.25)"}}>Parts Store →</Link>
          <span className="user-pill">Midwest Feed Co.</span>
        </div>
      </nav>

      {/* PORTAL TABS */}
      <div className="portal-nav">{tabs.map(t=><div key={t.id} className={`ptab ${activeTab===t.id?"active":""}`} onClick={()=>setActiveTab(t.id)}><span>{t.icon}</span> {t.label}</div>)}</div>

      {/* DASHBOARD */}
      {activeTab==="dashboard"&&<div className="content"><div><div className="page-title">Welcome back, Mike</div><div className="page-sub">Midwest Feed Co. - 3 registered CBE machines - Last order: Feb 26, 2025</div></div><div className="stat-row"><div className="stat-card" style={{borderTop:"3px solid #E8941A"}}><div className="stat-label">Registered Machines</div><div className="stat-value">3</div><div className="stat-sub">All machines active</div></div><div className="stat-card" style={{borderTop:"3px solid #3D5A80"}}><div className="stat-label">Total Orders</div><div className="stat-value">17</div><div className="stat-sub">7 orders in last 6 months</div></div><div className="stat-card" style={{borderTop:"3px solid #2563EB"}}><div className="stat-label">Active Shipments</div><div className="stat-value">1</div><div className="stat-sub">CBE-ORD-4821 in transit</div></div><div className="stat-card" style={{borderTop:"3px solid #D97706"}}><div className="stat-label">Open Inquiries</div><div className="stat-value">1</div><div className="stat-sub">Quote received</div></div></div>
      <div className="two-col"><div><div className="panel"><div className="panel-head"><div className="panel-title">My Machines</div><span className="panel-link" onClick={()=>setActiveTab("machines")}>View All &rarr;</span></div>{machines.map((m,i)=><div key={i} className="mc-row"><div className="mc-icon">&#127981;</div><div><div className="mc-model">{m.model}</div><div className="mc-name">{m.name}</div><div className="mc-meta">S/N: {m.serial} - Purchased: {m.purchased}</div></div><div className="mc-right"><button className="parts-btn">View Parts ({m.partsCount})</button></div></div>)}</div>
      <div className="panel"><div className="panel-head"><div className="panel-title">Recent Orders</div><span className="panel-link" onClick={()=>setActiveTab("orders")}>All Orders &rarr;</span></div><table><thead><tr><th>Order</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th></th></tr></thead><tbody>{orders.slice(0,4).map((o,i)=><tr key={i}><td style={{fontWeight:600,color:"#E8941A",fontSize:12}}>{o.id}</td><td style={{fontSize:12,color:"#6B7280"}}>{o.date}</td><td style={{fontSize:12,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.items}</td><td style={{fontWeight:700}}>{o.total}</td><td><StatusBadge status={o.status}/></td><td><button className="action-sm">View</button>{o.status==="Delivered"&&<button className="action-sm">Reorder</button>}</td></tr>)}</tbody></table></div></div>
      <div><div className="panel"><div className="panel-head"><div className="panel-title">Recommended Parts</div><span style={{fontSize:11,color:"#8B9DC3"}}>Based on your machines</span></div>{recommendedParts.map((p,i)=><div key={i} className="rec-card"><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}><div style={{width:8,height:8,borderRadius:"50%",background:p.urgency==="high"?"#EF4444":p.urgency==="medium"?"#E8941A":"#6B7280",flexShrink:0}}/><div className="rec-name">{p.name}</div></div><div className="rec-partno">{p.partNo}</div><div className="rec-reason">{p.reason}</div><div className="rec-bottom"><div className="rec-price">{p.price}</div><button className="rec-add">Add to Cart</button></div></div>)}</div>
      <div className="panel"><div className="panel-head"><div className="panel-title">Open Inquiry</div><span className="panel-link" onClick={()=>setActiveTab("inquiries")}>All &rarr;</span></div><div className="inq-card"><div className="inq-top"><span className="inq-ref">{inquiries[0].ref}</span><StatusBadge status={inquiries[0].status}/></div><div className="inq-type">{inquiries[0].type}</div><div className="inq-desc">{inquiries[0].desc}</div><div className="inq-footer"><div className="inq-date">Submitted: {inquiries[0].date}</div><div className="inq-amount">Quote: {inquiries[0].quoteAmount}</div></div><button className="btn-primary" style={{width:"100%",marginTop:12,fontSize:12}}>Review Quote &rarr;</button></div></div>
      <div className="panel"><div className="panel-head"><div className="panel-title">Quick Actions</div></div><div style={{padding:16,display:"flex",flexDirection:"column",gap:8}}><button className="btn-outline" style={{width:"100%",textAlign:"left",padding:"10px 16px"}}>&#128722; Order Parts for My Machines</button><button className="btn-outline" style={{width:"100%",textAlign:"left",padding:"10px 16px"}}>&#128221; Submit New Machine Inquiry</button><button className="btn-outline" style={{width:"100%",textAlign:"left",padding:"10px 16px"}} onClick={()=>setShowRegister(true)}>&#10133; Register Another Machine</button><button className="btn-outline" style={{width:"100%",textAlign:"left",padding:"10px 16px"}}>&#128222; Contact Support</button></div></div></div></div></div>}

      {/* MY MACHINES */}
      {activeTab==="machines"&&<div className="content"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}><div><div className="section-title">My Machines</div><div className="page-sub">CBE equipment registered to your account. Click View Parts to browse and order replacement parts.</div></div><button className="btn-primary" onClick={()=>setShowRegister(true)}>+ Register a Machine</button></div><div className="panel">{machines.map((m,i)=><div key={i} className="fm-card"><div className="fm-icon-lg">&#127981;</div><div className="fm-info"><div className="mc-model">{m.model}</div><div className="fm-name">{m.name}</div><div className="fm-meta-grid"><div><div className="fm-meta-label">Serial Number</div><div className="fm-meta-val">{m.serial}</div></div><div><div className="fm-meta-label">Purchase Date</div><div className="fm-meta-val">{m.purchased}</div></div><div><div className="fm-meta-label">Available Parts</div><div className="fm-meta-val">{m.partsCount} parts</div></div><div><div className="fm-meta-label">Status</div><div className="fm-meta-val"><StatusBadge status={m.status}/></div></div></div></div><div className="fm-actions"><button className="parts-btn">View Parts ({m.partsCount}) &rarr;</button><button className="action-sm" style={{marginTop:4}}>Order History</button></div></div>)}</div><div className="info-orange" style={{marginTop:8}}><div style={{fontWeight:700,fontSize:14,color:"#B45309",marginBottom:6}}>Machine not listed here?</div><div style={{fontSize:13,color:"#92400E",lineHeight:1.7}}>If you purchased a CBE machine before this portal existed, click <span style={{fontWeight:700,cursor:"pointer",textDecoration:"underline",color:"#E8941A"}} onClick={()=>setShowRegister(true)}>Register a Machine</span>. Enter your model and serial number and our team will verify and add it within 1 business day.</div></div></div>}

      {/* ORDER HISTORY */}
      {activeTab==="orders"&&<div className="content"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div><div className="section-title">Order History</div><div className="page-sub">All past parts orders and machine purchases.</div></div><input className="search-input" placeholder="Search by order ID, items..."/></div><div className="filter-row">{["All","Shipped","Delivered","Processing"].map(f=><button key={f} className={`fpill ${orderFilter===f?"active":""}`} onClick={()=>setOrderFilter(f)}>{f==="All"?"All Orders":f} ({f==="All"?orders.length:orders.filter(o=>o.status===f).length})</button>)}</div><div className="panel"><table><thead><tr><th>Order ID</th><th>Date</th><th>Items</th><th>Machine</th><th>Total</th><th>Status</th><th>Tracking</th><th>Actions</th></tr></thead><tbody>{filteredOrders.map((o,i)=><tr key={i}><td style={{fontWeight:600,color:"#E8941A",fontSize:12}}>{o.id}</td><td style={{fontSize:12,color:"#6B7280"}}>{o.date}</td><td style={{fontSize:12,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.items} <span style={{color:"#9CA3AF"}}>({o.itemCount})</span></td><td><span style={{fontSize:11,color:"#E8941A",fontFamily:"monospace",fontWeight:500}}>{o.machine}</span></td><td style={{fontWeight:700}}>{o.total}</td><td><StatusBadge status={o.status}/></td><td style={{fontSize:11}}>{o.tracking?<span style={{color:"#E8941A",cursor:"pointer",textDecoration:"underline"}}>Track</span>:<span style={{color:"#9CA3AF"}}>-</span>}</td><td><button className="action-sm">View</button><button className="action-sm">Invoice</button>{o.status==="Delivered"&&<button className="action-sm">Reorder</button>}</td></tr>)}</tbody></table></div><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}><div className="stat-card"><div className="stat-label">Total Spent</div><div className="stat-value" style={{fontSize:22}}>$12,470</div><div className="stat-sub">Across 17 orders</div></div><div className="stat-card"><div className="stat-label">Most Ordered Part</div><div className="stat-value" style={{fontSize:16}}>Sealing Bar Assembly</div><div className="stat-sub">Ordered 4 times</div></div><div className="stat-card"><div className="stat-label">Avg. Order Value</div><div className="stat-value" style={{fontSize:22}}>$733</div><div className="stat-sub">Parts orders only</div></div></div></div>}

      {/* INQUIRIES */}
      {activeTab==="inquiries"&&<div className="content"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div><div className="section-title">Machine Inquiries</div><div className="page-sub">Custom machine requests and quotes via CRM integration.</div></div><button className="btn-primary">+ New Machine Inquiry</button></div><div className="filter-row">{["All","Quote Sent","Accepted","Completed"].map(f=><button key={f} className={`fpill ${inquiryFilter===f?"active":""}`} onClick={()=>setInquiryFilter(f)}>{f==="All"?"All Inquiries":f} ({f==="All"?inquiries.length:inquiries.filter(i=>i.status===f).length})</button>)}</div><div className="panel">{filteredInquiries.map((inq,i)=><div key={i} className="inq-card"><div className="inq-top"><span className="inq-ref">{inq.ref}</span><StatusBadge status={inq.status}/></div><div className="inq-type">{inq.type}</div><div className="inq-desc">{inq.desc}</div><div className="inq-footer"><div className="inq-date">Submitted: {inq.date}</div><div style={{display:"flex",alignItems:"center",gap:12}}><div className="inq-amount">Quote: {inq.quoteAmount}</div>{inq.status==="Quote Sent"&&<button className="btn-primary" style={{padding:"6px 16px",fontSize:12}}>Review Quote &rarr;</button>}{inq.status!=="Quote Sent"&&<button className="action-sm">View Details</button>}</div></div></div>)}</div><div className="info-yellow" style={{marginTop:8}}><div style={{fontSize:13,color:"#92400E",lineHeight:1.6}}><strong>How it works:</strong> Inquiries auto-create a CRM lead routed to engineering. Quotes are generated via integrated quoting tool and delivered to your portal and email.</div></div><div className="panel" style={{marginTop:20}}><div className="panel-head"><div className="panel-title">Submit New Machine Inquiry</div><span style={{fontSize:12,color:"#8B9DC3"}}>Sent to engineering via CRM</span></div><div style={{padding:24}}><div className="form-grid"><div><label className="form-label">Machine Type Needed *</label><select className="form-input" style={{cursor:"pointer"}}><option>Select machine type...</option><option>Open Mouth Bag Filler</option><option>Valve Bag Filler</option><option>Bulk Bag Filler</option><option>Bulk Bag Unloader</option></select></div><div><label className="form-label">Product Being Bagged *</label><input className="form-input" placeholder="e.g., Granular fertilizer, powder cement..."/></div><div><label className="form-label">Bag Type and Size *</label><input className="form-input" placeholder="e.g., 50lb open mouth poly bags"/></div><div><label className="form-label">Desired Fill Rate</label><input className="form-input" placeholder="e.g., 8-10 bags per minute"/></div></div><div style={{marginTop:16}}><label className="form-label">Custom Requirements</label><textarea className="form-input" style={{height:80,resize:"vertical"}} placeholder="Stainless steel, FDA compliance, explosion-proof motors, space constraints..."/></div><div style={{marginTop:20,display:"flex",gap:12}}><button className="btn-primary">Submit Inquiry &rarr;</button><button className="btn-outline">Save as Draft</button></div></div></div></div>}

      {/* PROFILE */}
      {activeTab==="profile"&&<div className="content"><div className="section-title" style={{marginBottom:24}}>Profile & Addresses</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}><div className="panel"><div className="panel-head"><div className="panel-title">Company Information</div><span className="panel-link">Edit</span></div><div style={{padding:20}}><div className="form-grid"><div><label className="form-label">Company Name</label><input className="form-input" value="Midwest Feed Co." readOnly/></div><div><label className="form-label">Account Contact</label><input className="form-input" value="Mike Thompson" readOnly/></div><div><label className="form-label">Email</label><input className="form-input" value="mike@midwestfeed.com" readOnly/></div><div><label className="form-label">Phone</label><input className="form-input" value="(316) 555-0184" readOnly/></div><div><label className="form-label">Account ID</label><input className="form-input" value="CBE-CUST-00284" readOnly style={{fontFamily:"monospace",color:"#E8941A"}}/></div><div><label className="form-label">Account Since</label><input className="form-input" value="August 2022" readOnly/></div></div></div></div><div className="panel"><div className="panel-head"><div className="panel-title">Shipping Addresses</div><span className="panel-link">+ Add Address</span></div><div style={{padding:20}}><div className="addr-card"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div className="addr-label">Primary - Main Plant</div><span style={{fontSize:10,background:"#DCFCE7",color:"#166534",padding:"2px 8px",borderRadius:3,fontWeight:600}}>Default</span></div><div className="addr-text">Midwest Feed Co.<br/>4521 Industrial Blvd<br/>Wichita, KS 67202</div><div style={{fontSize:11,color:"#6B7280",marginTop:6}}>Dock available - No lift gate needed</div></div><div className="addr-card"><div className="addr-label">Secondary - Satellite Facility</div><div className="addr-text">Midwest Feed Co. East<br/>890 Commerce Dr<br/>Topeka, KS 66612</div><div style={{fontSize:11,color:"#D97706",marginTop:6}}>No dock - Lift gate required</div></div></div></div></div><div className="panel"><div className="panel-head"><div className="panel-title">Notification Preferences</div></div><div style={{padding:20}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>{[{label:"Order confirmation and shipping updates",checked:true,desc:"Email when order is confirmed, shipped, and delivered"},{label:"Parts recommendations for my machines",checked:true,desc:"Suggested parts based on machine age and usage"},{label:"Inquiry and quote status updates",checked:true,desc:"Email when inquiry status changes or quote is ready"},{label:"New product announcements",checked:false,desc:"Updates when new CBE machines or parts are available"}].map((pref,i)=><label key={i} style={{display:"flex",gap:12,cursor:"pointer",padding:12,border:"1px solid #F3F4F6",borderRadius:8}}><div style={{width:20,height:20,borderRadius:4,border:`2px solid ${pref.checked?"#E8941A":"#D1D5DB"}`,background:pref.checked?"#E8941A":"#fff",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontWeight:700,flexShrink:0,marginTop:1}}>{pref.checked&&"\u2713"}</div><div><div style={{fontSize:13,fontWeight:600,color:"#374151"}}>{pref.label}</div><div style={{fontSize:11,color:"#9CA3AF",marginTop:2}}>{pref.desc}</div></div></label>)}</div><div style={{marginTop:20,display:"flex",gap:12}}><button className="btn-primary">Save Preferences</button><button className="btn-outline">Reset to Defaults</button></div></div></div><div className="panel"><div className="panel-head"><div className="panel-title">Security</div></div><div style={{padding:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:14,fontWeight:600,color:"#374151"}}>Password</div><div style={{fontSize:12,color:"#9CA3AF",marginTop:2}}>Last changed: 45 days ago</div></div><button className="btn-outline" style={{padding:"8px 18px"}}>Change Password</button></div></div></div>}
    </div>
  );
}
