"use client";
import { useState } from "react";
import Link from "next/link";

const machineCategories = [
  { name: "Open Mouth Bag Fillers", count: 6, icon: "\u2B21" },
  { name: "Valve Bag Fillers", count: 4, icon: "\u25C8" },
  { name: "Bulk Bag Fillers", count: 5, icon: "\u25BD" },
  { name: "Bulk Bag Unloaders", count: 3, icon: "\u25B3" },
  { name: "Bag Sealers and Sewers", count: 7, icon: "\u25FB" },
  { name: "Conveyors and Accessories", count: 8, icon: "\u2550" },
];
const allMachines = [
  { model: "CBE-OM-480", name: "Open Mouth Bag Filler 480", desc: "Heavy-duty open mouth filler for 25-100 lb bags. 6-12 bags/min.", partsCount: 24, category: "Open Mouth Bag Fillers" },
  { model: "CBE-OM-320", name: "Open Mouth Bag Filler 320", desc: "Mid-range open mouth filler for 10-50 lb bags. 8-15 bags/min.", partsCount: 18, category: "Open Mouth Bag Fillers" },
  { model: "CBE-VB-320", name: "Valve Bag Filler 320", desc: "Precision valve bag filler for powders and granules. 4-8 bags/min.", partsCount: 21, category: "Valve Bag Fillers" },
  { model: "CBE-BF-600", name: "Bulk Bag Filler 600", desc: "High-capacity bulk bag filling system with integrated scale.", partsCount: 31, category: "Bulk Bag Fillers" },
  { model: "CBE-BU-400", name: "Bulk Bag Unloader 400", desc: "Controlled discharge bulk bag unloading station.", partsCount: 16, category: "Bulk Bag Unloaders" },
  { model: "CBE-SL-200", name: "Bag Sealer 200", desc: "Heat sealer for poly and multi-wall bags up to 24in wide.", partsCount: 12, category: "Bag Sealers and Sewers" },
];
const partsForMachine = [
  { name: "Sealing Bar Assembly", partNo: "CBE-SB-480A", price: "$485.00", category: "Wear Parts", stock: true, img: "\uD83D\uDD27" },
  { name: "Conveyor Belt 24in", partNo: "CBE-CB-480B", price: "$320.00", category: "Mechanical", stock: true, img: "\u2699\uFE0F" },
  { name: "HMI Touchscreen Panel 7in", partNo: "CBE-HMI-7A", price: "$1,250.00", category: "Electrical", stock: true, img: "\uD83D\uDDA5\uFE0F" },
  { name: "Bag Clamp Set (Pair)", partNo: "CBE-BC-480C", price: "$195.00", category: "Mechanical", stock: false, img: "\uD83D\uDD29" },
  { name: "Drive Motor 2HP 3-Phase", partNo: "CBE-DM-2HP", price: "$890.00", category: "Electrical", stock: true, img: "\u26A1" },
  { name: "Proximity Sensor Kit", partNo: "CBE-PS-480D", price: "$145.00", category: "Electrical", stock: true, img: "\uD83D\uDCE1" },
  { name: "Hopper Liner Insert", partNo: "CBE-HL-480E", price: "$275.00", category: "Wear Parts", stock: true, img: "\uD83D\uDEE1\uFE0F" },
  { name: "PLC Control Board", partNo: "CBE-PLC-AB1", price: "$1,680.00", category: "Electrical", stock: true, img: "\uD83D\uDD0C" },
  { name: "Air Cylinder Assembly", partNo: "CBE-AC-480F", price: "$340.00", category: "Mechanical", stock: true, img: "\uD83D\uDCA8" },
];
const partCategories = ["All Parts", "Wear Parts", "Mechanical", "Electrical"];
const specs = [
  { label: "Model", value: "CBE-OM-480" },{ label: "Type", value: "Open Mouth Bag Filler" },{ label: "Capacity", value: "6-12 bags/minute" },
  { label: "Bag Sizes", value: "16in to 24in wide, up to 36in long" },{ label: "Weight Range", value: "25 to 100 lbs per bag" },{ label: "Power", value: "480V, 3-Phase, 60Hz" },
];
const cartItems = [
  { name: "Sealing Bar Assembly", partNo: "CBE-SB-480A", compat: "CBE-OM-480", price: "$485.00", qty: 1, icon: "\uD83D\uDD27" },
  { name: "Proximity Sensor Kit", partNo: "CBE-PS-480D", compat: "CBE-OM-480", price: "$290.00", qty: 2, icon: "\uD83D\uDCE1" },
];

export default function ChoiceBaggingStore() {
  const [view, setView] = useState("store");
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [partFilter, setPartFilter] = useState("All Parts");
  const [searchQuery, setSearchQuery] = useState("");
  const filteredParts = partsForMachine.filter(p => {
    if (partFilter !== "All Parts" && p.category !== partFilter) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.partNo.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });
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
        .cart-btn{background:#243656;color:#E8941A;border:none;padding:7px 14px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit}
        .cart-btn:hover{background:#2d4268}
        .cross-link{color:#8B9DC3;font-size:12px;font-weight:500;cursor:pointer;text-decoration:none;padding:6px 12px;border-radius:6px;border:1px solid rgba(139,157,195,0.25);transition:all .15s}
        .cross-link:hover{color:#E8941A;border-color:rgba(232,148,26,0.4)}
        .content{padding:32px 48px;max-width:1200px}
        .store-hero{background:linear-gradient(135deg,#1B2A4A 0%,#243656 50%,#1B2A4A 100%);padding:48px;color:#fff;position:relative;overflow:hidden}
        .store-hero::after{content:'';position:absolute;inset:0;background:url('data:image/svg+xml,%3Csvg width="40" height="40" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M20 0v40M0 20h40" stroke="rgba(255,255,255,0.03)" stroke-width="1"/%3E%3C/svg%3E')}
        .hero-content{position:relative;z-index:2;max-width:600px}
        .hero-tag{font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#E8941A;margin-bottom:12px}
        .hero-title{font-size:32px;font-weight:800;line-height:1.2;margin-bottom:10px}
        .hero-sub{font-size:15px;color:#8B9DC3;line-height:1.6;margin-bottom:24px}
        .search-wrap{display:flex;background:#fff;border-radius:10px;overflow:hidden;max-width:520px}
        .search-wrap input{flex:1;padding:14px 18px;border:none;font-size:14px;font-family:inherit;outline:none;color:#333}
        .search-wrap button{background:#E8941A;color:#fff;border:none;padding:0 22px;font-weight:600;font-size:13px;cursor:pointer;font-family:inherit}
        .cat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
        .cat-card{background:#fff;border:1px solid #E5E7EB;border-radius:10px;padding:22px 20px;cursor:pointer;transition:all .2s}
        .cat-card:hover{border-color:#E8941A;box-shadow:0 4px 16px rgba(232,146,12,.08);transform:translateY(-2px)}
        .cat-icon{font-size:24px;margin-bottom:8px} .cat-name{font-weight:600;font-size:14px;color:#1B2A4A} .cat-count{font-size:12px;color:#9CA3AF;margin-top:2px}
        .machine-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .m-card{background:#fff;border:1px solid #E5E7EB;border-radius:10px;overflow:hidden;cursor:pointer;transition:all .2s}
        .m-card:hover{box-shadow:0 6px 20px rgba(0,0,0,.06);transform:translateY(-2px)}
        .m-img{height:140px;background:linear-gradient(135deg,#FFF8EC,#FEEBC8);display:flex;align-items:center;justify-content:center;font-size:44px}
        .m-body{padding:16px 18px}
        .m-model{font-size:11px;color:#E8941A;font-weight:600;font-family:monospace}
        .m-name{font-weight:700;font-size:15px;color:#1B2A4A;margin:3px 0 6px}
        .m-desc{font-size:12px;color:#6B7280;line-height:1.5}
        .m-footer{display:flex;justify-content:space-between;align-items:center;margin-top:12px;padding-top:12px;border-top:1px solid #F3F4F6}
        .m-parts-count{font-size:12px;color:#6B7280}
        .m-parts-btn{background:#FFF8EC;color:#E8941A;border:1px solid #FBBF24;padding:6px 14px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit}
        .back-link{font-size:13px;color:#E8941A;font-weight:600;cursor:pointer;margin-bottom:20px;display:inline-flex;align-items:center;gap:4px}
        .machine-hero{display:grid;grid-template-columns:1fr 1fr;gap:36px;background:#fff;border-radius:12px;border:1px solid #E5E7EB;padding:28px;margin-bottom:24px}
        .mh-img{height:280px;background:linear-gradient(135deg,#FFF8EC,#FEEBC8);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:72px}
        .mh-model{font-size:12px;color:#E8941A;font-weight:600;font-family:monospace}
        .mh-name{font-size:24px;font-weight:800;color:#1B2A4A;margin:4px 0 12px}
        .mh-desc{font-size:14px;color:#4B5563;line-height:1.7;margin-bottom:20px}
        .spec-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #F3F4F6;font-size:13px}
        .spec-label{color:#6B7280;font-weight:500} .spec-value{color:#1B2A4A;font-weight:600;text-align:right}
        .inquiry-cta{background:#E8941A;color:#fff;border:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;width:100%;margin-top:16px}
        .inquiry-cta:hover{background:#D4840A}
        .parts-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:12px}
        .parts-title{font-size:18px;font-weight:700;color:#1B2A4A}
        .parts-subtitle{font-size:13px;color:#6B7280}
        .parts-filters{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
        .filter-pill{padding:6px 14px;border-radius:20px;border:1px solid #D1D5DB;font-size:12px;font-weight:500;color:#6B7280;cursor:pointer;background:#fff;font-family:inherit}
        .filter-pill.active{background:#E8941A;color:#fff;border-color:#E8941A}
        .filter-pill:hover{border-color:#E8941A}
        .parts-search{padding:8px 14px;border:1px solid #D1D5DB;border-radius:8px;font-size:13px;font-family:inherit;outline:none;width:220px}
        .parts-search:focus{border-color:#E8941A}
        .parts-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
        .part-card{background:#fff;border:1px solid #E5E7EB;border-radius:10px;padding:18px;transition:all .2s}
        .part-card:hover{border-color:#E8941A;box-shadow:0 4px 14px rgba(232,146,12,.08)}
        .part-icon{width:48px;height:48px;background:linear-gradient(135deg,#FFF8EC,#FEEBC8);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:12px}
        .part-cat{font-size:10px;color:#8B9DC3;font-weight:600;text-transform:uppercase;letter-spacing:.5px}
        .part-no{font-size:11px;color:#E8941A;font-weight:600;font-family:monospace;margin-top:2px}
        .part-name{font-weight:600;font-size:14px;color:#1B2A4A;margin:6px 0}
        .part-bottom{display:flex;justify-content:space-between;align-items:center;margin-top:12px;padding-top:12px;border-top:1px solid #F3F4F6}
        .part-price{font-weight:700;font-size:16px;color:#1B2A4A}
        .part-stock{font-size:11px;font-weight:600}
        .part-stock.in{color:#059669} .part-stock.out{color:#DC2626}
        .part-add{background:#1B2A4A;color:#fff;border:none;padding:7px 16px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit}
        .part-add:hover{background:#243656}
        .compat-note{font-size:11px;color:#6B7280;margin-top:4px}
        .cta-banner{background:linear-gradient(135deg,#1B2A4A,#243656);border-radius:12px;padding:36px;display:flex;align-items:center;justify-content:space-between;color:#fff;margin-top:32px}
        .cta-title{font-size:20px;font-weight:700;margin-bottom:6px}
        .cta-sub{font-size:13px;color:#8B9DC3;max-width:440px;line-height:1.5}
        .cta-btn{background:#E8941A;color:#fff;border:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap}
        .cta-btn:hover{background:#D4840A}
        .pnl{background:#fff;border-radius:10px;border:1px solid #E5E7EB;overflow:hidden;margin-bottom:20px}
        .ph{padding:18px 24px;border-bottom:1px solid #F3F4F6}
        .bp{background:#E8941A;color:#fff;border:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit}
        .bp:hover{background:#C67A0E}
        .bo{background:#fff;color:#374151;border:1px solid #D1D5DB;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit}
      `}</style>

      <nav className="top-nav">
        <div style={{display:"flex",alignItems:"center",gap:32}}>
          <div className="cb-logo"><span className="check">{"\u2713"}</span>CHOICE BAGGING EQUIPMENT<span className="sub">/ Parts Store</span></div>
        </div>
        <div className="top-right">
          <Link href="/" className="cross-link" style={{color:"#8B9DC3",fontSize:12,fontWeight:500,textDecoration:"none",padding:"6px 12px",borderRadius:6,border:"1px solid rgba(139,157,195,0.25)"}}>Customer Portal →</Link>
          <button className="cart-btn" onClick={()=>{setView("cart");setSelectedMachine(null)}}>{"\uD83D\uDED2"} Cart (2)</button>
          <span style={{background:"#243656",padding:"6px 12px",borderRadius:6,color:"#C9D5E8",fontWeight:600,fontSize:12}}>Midwest Feed Co.</span>
        </div>
      </nav>

      {view==="store"&&!selectedMachine&&<><div className="store-hero"><div className="hero-content"><div className="hero-tag">CBE Parts Store</div><div className="hero-title">Replacement Parts for Your CBE Equipment</div><div className="hero-sub">Find parts by machine model or part number. Logged-in customers see parts matched to their registered machines.</div><div className="search-wrap"><input placeholder="Search by part number or machine model..."/><button>Search</button></div></div></div>
      <div className="content">
        <div style={{background:"#FFF8EC",border:"1px solid #FBBF24",borderRadius:10,padding:20,marginBottom:28}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div><div style={{fontWeight:700,fontSize:15,color:"#B45309"}}>Your Registered Machines</div><div style={{fontSize:12,color:"#D97706",marginTop:2}}>Quick access to parts for your equipment</div></div><span style={{fontSize:12,color:"#E8941A",fontWeight:600,cursor:"pointer"}}>Manage Machines {"\u2192"}</span></div>
          <div style={{display:"flex",gap:12}}>{allMachines.slice(0,3).map((m,i)=><div key={i} onClick={()=>{setSelectedMachine(m);setView("machine-detail")}} style={{flex:1,background:"#fff",border:"1px solid #FBBF24",borderRadius:8,padding:14,cursor:"pointer",transition:"all .15s"}}><div style={{fontSize:11,color:"#E8941A",fontWeight:600,fontFamily:"monospace"}}>{m.model}</div><div style={{fontWeight:600,fontSize:13,color:"#1B2A4A",margin:"2px 0"}}>{m.name}</div><div style={{fontSize:11,color:"#6B7280"}}>{m.partsCount} parts available</div></div>)}</div>
        </div>
        <div style={{marginBottom:32}}><div style={{fontSize:18,fontWeight:700,color:"#1B2A4A",marginBottom:6}}>Browse by Machine Type</div><div style={{fontSize:13,color:"#6B7280",marginBottom:18}}>Select your machine category to find compatible parts</div><div className="cat-grid">{machineCategories.map((cat,i)=><div key={i} className="cat-card"><div className="cat-icon">{cat.icon}</div><div className="cat-name">{cat.name}</div><div className="cat-count">{cat.count} models</div></div>)}</div></div>
        <div><div style={{fontSize:18,fontWeight:700,color:"#1B2A4A",marginBottom:6}}>All CBE Machines</div><div style={{fontSize:13,color:"#6B7280",marginBottom:18}}>Click any machine to view and order its replacement parts</div><div className="machine-grid">{allMachines.map((m,i)=><div key={i} className="m-card" onClick={()=>{setSelectedMachine(m);setView("machine-detail")}}><div className="m-img">{"\uD83C\uDFED"}</div><div className="m-body"><div className="m-model">{m.model}</div><div className="m-name">{m.name}</div><div className="m-desc">{m.desc}</div><div className="m-footer"><span className="m-parts-count">{m.partsCount} replacement parts</span><button className="m-parts-btn">View Parts {"\u2192"}</button></div></div></div>)}</div></div>
        <div className="cta-banner"><div><div className="cta-title">Need a Custom CBE Machine?</div><div className="cta-sub">Submit a machine inquiry with your specific requirements. Our engineering team will prepare a custom quote through our CRM system.</div></div><button className="cta-btn">Request a Quote {"\u2192"}</button></div>
      </div></>}

      {view==="machine-detail"&&selectedMachine&&<div className="content">
        <div className="back-link" onClick={()=>{setView("store");setSelectedMachine(null)}}>{"<"} Back to All Machines</div>
        <div className="machine-hero"><div className="mh-img">{"\uD83C\uDFED"}</div><div><div className="mh-model">{selectedMachine.model}</div><div className="mh-name">{selectedMachine.name}</div><div className="mh-desc">{selectedMachine.desc} Engineered by Choice Bagging Equipment with Allen-Bradley PLC controls, heavy-gauge steel construction.</div><div style={{fontSize:13,fontWeight:700,color:"#1B2A4A",marginBottom:8}}>Technical Specifications</div><div>{specs.map((s,i)=><div key={i} className="spec-row"><span className="spec-label">{s.label}</span><span className="spec-value">{s.value}</span></div>)}</div><button className="inquiry-cta">Request Custom Configuration / Quote {"\u2192"}</button><div style={{fontSize:11,color:"#6B7280",marginTop:8,textAlign:"center"}}>This sends an inquiry to our CRM workflow</div></div></div>
        <div><div className="parts-header"><div><div className="parts-title">Replacement Parts for {selectedMachine.name}</div><div className="parts-subtitle">{filteredParts.length} parts available - {selectedMachine.model}</div></div><div className="parts-filters"><input className="parts-search" placeholder="Search parts..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/>{partCategories.map(f=><button key={f} className={`filter-pill ${partFilter===f?"active":""}`} onClick={()=>setPartFilter(f)}>{f}</button>)}</div></div>
        <div className="parts-grid">{filteredParts.map((p,i)=><div key={i} className="part-card"><div className="part-icon">{p.img}</div><div className="part-cat">{p.category}</div><div className="part-no">{p.partNo}</div><div className="part-name">{p.name}</div><div className="compat-note">Compatible with: {selectedMachine.model}</div><div className="part-bottom"><div><div className="part-price">{p.price}</div><div className={`part-stock ${p.stock?"in":"out"}`}>{p.stock?"\u2713 In Stock":"\u2717 Out of Stock"}</div></div>{p.stock?<button className="part-add">Add to Cart</button>:<button className="part-add" style={{background:"#9CA3AF"}}>Notify Me</button>}</div></div>)}</div></div>
      </div>}

      {view==="cart"&&<div className="content">
        <div className="back-link" onClick={()=>{setView("store");setSelectedMachine(null)}}>{"<"} Back to Parts Store</div>
        <div style={{fontSize:22,fontWeight:700,color:"#1B2A4A",marginBottom:24}}>Shopping Cart</div>
        <div style={{display:"grid",gridTemplateColumns:"5fr 3fr",gap:24}}>
          <div className="pnl">
            <div className="ph"><div style={{fontWeight:700,fontSize:15,color:"#1B2A4A"}}>Cart Items ({cartItems.length})</div></div>
            <div style={{padding:"8px 24px"}}>
              {cartItems.map((item,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:16,padding:"16px 0",borderBottom:i<cartItems.length-1?"1px solid #F3F4F6":"none"}}>
                  <div style={{width:56,height:56,background:"linear-gradient(135deg, #F1F5F9, #E2E8F0)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{item.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:14,color:"#1B2A4A"}}>{item.name}</div>
                    <div style={{fontSize:11,color:"#E8941A",fontFamily:"monospace",fontWeight:500}}>{item.partNo}</div>
                    <div style={{fontSize:11,color:"#6B7280",marginTop:2}}>Compatible: {item.compat}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",border:"1px solid #D1D5DB",borderRadius:6,overflow:"hidden"}}>
                    <button style={{width:28,height:28,border:"none",background:"#F9FAFB",cursor:"pointer",fontSize:14,color:"#4B5563",fontWeight:600}}>-</button>
                    <input style={{width:32,textAlign:"center",border:"none",borderLeft:"1px solid #D1D5DB",borderRight:"1px solid #D1D5DB",fontSize:13,fontWeight:600,height:28,fontFamily:"inherit"}} value={item.qty} readOnly />
                    <button style={{width:28,height:28,border:"none",background:"#F9FAFB",cursor:"pointer",fontSize:14,color:"#4B5563",fontWeight:600}}>+</button>
                  </div>
                  <div style={{fontWeight:700,fontSize:15,color:"#1B2A4A",minWidth:80,textAlign:"right"}}>{item.price}</div>
                  <div style={{fontSize:11,color:"#EF4444",cursor:"pointer",fontWeight:500,minWidth:60,textAlign:"right"}}>Remove</div>
                </div>
              ))}
            </div>
            <div style={{padding:"12px 24px 16px",borderTop:"1px solid #F3F4F6"}}>
              <div style={{background:"#FFF8EC",border:"1px solid #FBBF24",borderRadius:8,padding:12,fontSize:12,color:"#92400E",display:"flex",alignItems:"center",gap:8}}>
                {"⚠️"} Part compatibility verified against your registered machine <strong>CBE-OM-480</strong>
              </div>
            </div>
          </div>
          <div>
            <div className="pnl">
              <div className="ph"><div style={{fontWeight:700,fontSize:15,color:"#1B2A4A"}}>Order Summary</div></div>
              <div style={{padding:20}}>
                <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",fontSize:14}}><span style={{color:"#6B7280"}}>Subtotal</span><span style={{fontWeight:600}}>$775.00</span></div>
                <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",fontSize:14}}><span style={{color:"#6B7280"}}>Shipping</span><span style={{fontWeight:600}}>$45.00</span></div>
                <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",fontSize:14}}><span style={{color:"#6B7280"}}>Tax</span><span style={{fontWeight:600}}>$62.00</span></div>
                <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0 0",fontSize:18,fontWeight:700,color:"#1B2A4A",borderTop:"2px solid #E5E7EB",marginTop:8}}><span>Total</span><span>$882.00</span></div>
                <button className="bp" style={{width:"100%",marginTop:16}}>Proceed to Checkout</button>
                <button className="bo" style={{width:"100%",marginTop:8,fontSize:13}} onClick={()=>{setView("store");setSelectedMachine(null)}}>Continue Shopping</button>
              </div>
            </div>
            <div style={{background:"#FFF8EC",border:"1px solid #FBBF24",borderRadius:10,padding:16,fontSize:12,color:"#C26A00",lineHeight:1.6}}>
              <strong>Shipping to:</strong><br/>Midwest Feed Co. - Main Plant<br/>4521 Industrial Blvd, Wichita, KS 67202<br/><span style={{color:"#E8941A",cursor:"pointer",fontWeight:600}}>Change address</span>
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
}
