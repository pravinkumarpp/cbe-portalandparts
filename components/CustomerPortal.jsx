"use client";
import { useState } from "react";
import Link from "next/link";

/* ── Data ─────────────────────────────────────────────────────────── */
const machines = [
  { model: "CBE-OM-480", name: "Open Mouth Bag Filler 480", serial: "CBE-2023-04872", salesOrder: "SO-2023-1042", purchased: "Mar 15, 2023", partsCount: 24, status: "Active", servicePage: "https://service.choicebagging.com/m/CBE-2023-04872" },
  { model: "CBE-VB-320", name: "Valve Bag Filler 320", serial: "CBE-2022-03156", salesOrder: "SO-2022-0871", purchased: "Aug 8, 2022", partsCount: 18, status: "Active", servicePage: "https://service.choicebagging.com/m/CBE-2022-03156" },
  { model: "CBE-BF-600", name: "Bulk Bag Filler System 600", serial: "CBE-2024-05901", salesOrder: "SO-2024-1203", purchased: "Jan 22, 2024", partsCount: 31, status: "Active", servicePage: "https://service.choicebagging.com/m/CBE-2024-05901" },
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

const quoteRequests = [
  { ref: "QR-2025-0034", date: "Feb 20, 2025", type: "Custom Open Mouth Bagger", status: "Quote Sent", desc: "50lb capacity, stainless steel 316, FDA compliant, explosion-proof motors.", quoteAmount: "$68,500" },
  { ref: "QR-2024-0089", date: "Nov 5, 2024", type: "Bulk Bag Filler Upgrade", status: "Accepted", desc: "Upgrade existing CBE-BF-600 with new Allen-Bradley PLC controls.", quoteAmount: "$12,400" },
  { ref: "QR-2024-0072", date: "Aug 14, 2024", type: "Valve Bag Filler New Line", status: "Completed", desc: "Second valve filler for pet food production. Carbon steel, 6-10 bags/min.", quoteAmount: "$41,200" },
];

const recommendedParts = [
  { name: "Sealing Bar Assembly", partNo: "CBE-SB-480A", price: "$485.00", reason: "Recommended for CBE-OM-480 at 24 months. Purchased Mar 2023.", urgency: "high" },
  { name: "Filter Screen Mesh Kit", partNo: "CBE-FS-320M", price: "$165.00", reason: "Wear part for CBE-VB-320 due at 18 months. Purchased Aug 2022.", urgency: "medium" },
  { name: "Proximity Sensor Set", partNo: "CBE-PS-600S", price: "$210.00", reason: "Frequently ordered for CBE-BF-600 systems. Preventive replacement.", urgency: "low" },
];

const machineInvoices = [
  { id: "INV-2023-4210", date: "Mar 18, 2023", description: "CBE-OM-480 Machine Purchase", amount: "$42,500.00", status: "Paid" },
  { id: "INV-2024-1082", date: "Jun 12, 2024", description: "Annual Service Contract", amount: "$3,200.00", status: "Paid" },
  { id: "INV-2025-0341", date: "Feb 28, 2025", description: "Parts Order - Sealing Bar + Sensor Kit", amount: "$630.00", status: "Paid" },
];

const machineApprovedQuotes = [
  { ref: "QR-2024-0089", date: "Nov 5, 2024", description: "PLC Controls Upgrade Package", amount: "$12,400.00", status: "Approved", validUntil: "May 5, 2025" },
];

/* ── Reusable Bits ────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const c = {
    Shipped: { bg: "#DBEAFE", text: "#1E40AF" },
    Delivered: { bg: "#DCFCE7", text: "#166534" },
    Processing: { bg: "#FEF3C7", text: "#92400E" },
    "Quote Sent": { bg: "#FFF3E0", text: "#B45309" },
    Accepted: { bg: "#DCFCE7", text: "#166534" },
    Completed: { bg: "#F3F4F6", text: "#374151" },
    Active: { bg: "#DCFCE7", text: "#166534" },
    Paid: { bg: "#DCFCE7", text: "#166534" },
    Approved: { bg: "#DBEAFE", text: "#1E40AF" },
  }[status] || { bg: "#F3F4F6", text: "#6B7280" };
  return <span style={{ background: c.bg, color: c.text, padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>{status}</span>;
}

/* ── Icons ── */
const Icons = {
  dashboard: (<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>),
  machines: (<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M2 20h20"/><path d="M5 20V8l7-5 7 5v12"/><rect x="9" y="12" width="6" height="8"/></svg>),
  orders: (<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>),
  quotes: (<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/><line x1="9" y1="11" x2="15" y2="11"/></svg>),
  profile: (<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
  chevronRight: (<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>),
  arrowLeft: (<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>),
  externalLink: (<svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>),
  qrCode: (<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/><line x1="21" y1="14" x2="21" y2="17"/><line x1="14" y1="21" x2="17" y2="21"/></svg>),
};

/* ── Register Machine Modal ── */
function RegisterMachineModal({ onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "#fff", borderRadius: 14, width: "100%", maxWidth: 680, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ padding: "24px 28px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#1B2A4A" }}>Register a Machine</div>
            <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>Add a CBE machine to your account to unlock personalized parts ordering.</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, color: "#9CA3AF", cursor: "pointer", padding: 4 }}>&#10005;</button>
        </div>
        <div style={{ padding: 28 }}>
          <div style={{ display: "flex", gap: 0, marginBottom: 28 }}>
            {[
              { num: "1", label: "Enter Details", sub: "Model and serial", status: "cur" },
              { num: "2", label: "Submit", sub: "Send for verification", status: "pen" },
              { num: "3", label: "Admin Verifies", sub: "Within 1 business day", status: "pen" },
              { num: "4", label: "Machine Added", sub: "Parts unlocked", status: "pen" },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center", position: "relative" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, margin: "0 auto 8px", background: s.status === "cur" ? "#E8941A" : "#F3F4F6", color: s.status === "cur" ? "#fff" : "#9CA3AF" }}>{s.num}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{s.label}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{s.sub}</div>
                {i < 3 && <div style={{ position: "absolute", top: 15, left: "55%", right: "-45%", height: 2, background: "#E5E7EB" }} />}
              </div>
            ))}
          </div>
          <div className="form-grid" style={{ maxWidth: 600 }}>
            <div><label className="form-label">Machine Model *</label><select className="form-input" style={{ cursor: "pointer" }}><option>Select CBE model...</option><option>CBE-OM-480 - Open Mouth Bag Filler 480</option><option>CBE-OM-320 - Open Mouth Bag Filler 320</option><option>CBE-VB-320 - Valve Bag Filler 320</option><option>CBE-BF-600 - Bulk Bag Filler 600</option><option>CBE-BU-400 - Bulk Bag Unloader 400</option><option>CBE-SL-200 - Bag Sealer 200</option><option>Other / Older Model</option></select></div>
            <div><label className="form-label">Serial Number *</label><input className="form-input" placeholder="e.g., CBE-2023-04872" /><div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>Found on the machine nameplate near controls</div></div>
            <div><label className="form-label">Approximate Purchase Date</label><input className="form-input" type="month" /></div>
            <div><label className="form-label">Facility Location</label><select className="form-input" style={{ cursor: "pointer" }}><option>Select address...</option><option>Main Plant - Wichita, KS</option><option>Satellite - Topeka, KS</option><option>+ Add new location</option></select></div>
          </div>
          <div style={{ marginTop: 18 }}><label className="form-label">Additional Notes (Optional)</label><textarea className="form-input" style={{ height: 60, resize: "vertical" }} placeholder="Modifications made, configuration details, etc." /></div>
          <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
            <button className="btn-primary">Submit for Verification</button>
            <button className="btn-outline" onClick={onClose}>Cancel</button>
          </div>
        </div>
        <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "0 0 14px 14px", padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#166534", marginBottom: 6 }}>What happens after registration?</div>
          <div style={{ fontSize: 13, color: "#15803D", lineHeight: 1.7 }}>Our admin team verifies your serial number against CBE sales records. Once confirmed, the machine appears in My Machines and all compatible replacement parts are shown automatically.</div>
        </div>
      </div>
    </div>
  );
}

/* ── Machine Detail View ── */
function MachineDetailView({ machine, onBack }) {
  const [detailTab, setDetailTab] = useState("overview");
  const machineOrders = orders.filter(o => o.machine === machine.model);

  return (
    <div>
      <button onClick={onBack} className="back-btn">{Icons.arrowLeft}<span>Back to My Machines</span></button>

      <div className="detail-header">
        <div className="detail-header-left">
          <div className="detail-machine-icon">&#127981;</div>
          <div>
            <div style={{ fontSize: 12, color: "#E8941A", fontWeight: 600, fontFamily: "monospace" }}>{machine.model}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#1B2A4A", margin: "2px 0 6px" }}>{machine.name}</div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              <div className="detail-meta-chip"><span className="detail-meta-label">Sales Order</span><span className="detail-meta-value">{machine.salesOrder}</span></div>
              <div className="detail-meta-chip"><span className="detail-meta-label">Serial No.</span><span className="detail-meta-value">{machine.serial}</span></div>
              <div className="detail-meta-chip"><span className="detail-meta-label">Purchased</span><span className="detail-meta-value">{machine.purchased}</span></div>
              <div className="detail-meta-chip"><span className="detail-meta-label">Status</span><StatusBadge status={machine.status} /></div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <a href={machine.servicePage} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none", fontSize: 13 }}>Service Page {Icons.externalLink}</a>
          <button className="btn-primary" style={{ fontSize: 13 }}>View Parts ({machine.partsCount})</button>
        </div>
      </div>

      <div className="detail-tabs">
        {[{ id: "overview", label: "Overview" }, { id: "invoices", label: "Invoices" }, { id: "quotes", label: "Approved Quotes" }, { id: "orders", label: "Parts Orders" }].map(t => (
          <button key={t.id} className={`detail-tab ${detailTab === t.id ? "active" : ""}`} onClick={() => setDetailTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {detailTab === "overview" && (
        <div className="detail-grid">
          <div>
            <div className="panel">
              <div className="panel-head"><div className="panel-title">Machine Details</div></div>
              <div style={{ padding: 20 }}>
                <div className="detail-info-grid">
                  <div><div className="di-label">Model</div><div className="di-value">{machine.model}</div></div>
                  <div><div className="di-label">Name</div><div className="di-value">{machine.name}</div></div>
                  <div><div className="di-label">Sales Order No.</div><div className="di-value" style={{ fontFamily: "monospace", color: "#E8941A" }}>{machine.salesOrder}</div></div>
                  <div><div className="di-label">Serial No.</div><div className="di-value" style={{ fontFamily: "monospace" }}>{machine.serial}</div></div>
                  <div><div className="di-label">Purchase Date</div><div className="di-value">{machine.purchased}</div></div>
                  <div><div className="di-label">Available Parts</div><div className="di-value">{machine.partsCount} parts</div></div>
                  <div><div className="di-label">Status</div><div className="di-value"><StatusBadge status={machine.status} /></div></div>
                  <div><div className="di-label">Facility</div><div className="di-value">Main Plant - Wichita, KS</div></div>
                </div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-head"><div className="panel-title">Service Landing Page</div></div>
              <div style={{ padding: 20 }}>
                <div style={{ background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 10, padding: 20 }}>
                  <div style={{ fontSize: 13, color: "#0369A1", marginBottom: 10, lineHeight: 1.6 }}>Access the dedicated service page for this machine. Includes service history, maintenance schedules, documentation, and support resources.</div>
                  <a href={machine.servicePage} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#0284C7", color: "#fff", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", fontFamily: "inherit" }}>Open Service Page {Icons.externalLink}</a>
                  <div style={{ fontSize: 11, color: "#6B7280", marginTop: 8 }}>Opens in a new tab &mdash; powered by CBE Service Platform</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="panel">
              <div className="panel-head"><div className="panel-title">Machine QR Code</div></div>
              <div style={{ padding: 24, textAlign: "center" }}>
                <div style={{ width: 160, height: 160, background: "#F9FAFB", border: "2px dashed #D1D5DB", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", flexDirection: "column", gap: 8 }}>
                  {Icons.qrCode}
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>QR Code</span>
                </div>
                <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6, marginBottom: 12 }}>Scan to access the service landing page for this machine. Share with field technicians for quick access.</div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>Powered by CBE QR System</div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-head"><div className="panel-title">Quick Summary</div></div>
              <div style={{ padding: 16 }}>
                <div className="qs-row"><span className="qs-label">Total Parts Orders</span><span className="qs-value">{machineOrders.length}</span></div>
                <div className="qs-row"><span className="qs-label">Total Spent</span><span className="qs-value">{machineOrders.reduce((sum, o) => sum + parseFloat(o.total.replace(/[$,]/g, "")), 0).toLocaleString("en-US", { style: "currency", currency: "USD" })}</span></div>
                <div className="qs-row"><span className="qs-label">Last Order</span><span className="qs-value">{machineOrders[0]?.date || "\u2014"}</span></div>
                <div className="qs-row" style={{ borderBottom: "none" }}><span className="qs-label">Invoices</span><span className="qs-value">{machineInvoices.length}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {detailTab === "invoices" && (
        <div className="panel">
          <div className="panel-head"><div className="panel-title">Invoices</div><span style={{ fontSize: 12, color: "#6B7280" }}>{machineInvoices.length} invoices</span></div>
          <table><thead><tr><th>Invoice ID</th><th>Date</th><th>Description</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{machineInvoices.map((inv, i) => (
              <tr key={i}><td style={{ fontWeight: 600, color: "#E8941A", fontSize: 12, fontFamily: "monospace" }}>{inv.id}</td><td style={{ fontSize: 12, color: "#6B7280" }}>{inv.date}</td><td style={{ fontSize: 13 }}>{inv.description}</td><td style={{ fontWeight: 700 }}>{inv.amount}</td><td><StatusBadge status={inv.status} /></td><td><button className="action-sm">View</button><button className="action-sm">Download</button></td></tr>
            ))}</tbody></table>
        </div>
      )}

      {detailTab === "quotes" && (
        <div className="panel">
          <div className="panel-head"><div className="panel-title">Approved Quotes</div><span style={{ fontSize: 12, color: "#6B7280" }}>{machineApprovedQuotes.length} approved</span></div>
          {machineApprovedQuotes.length > 0 ? machineApprovedQuotes.map((q, i) => (
            <div key={i} style={{ padding: 20, borderBottom: "1px solid #F3F4F6" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><span style={{ fontSize: 12, fontWeight: 600, color: "#E8941A", fontFamily: "monospace" }}>{q.ref}</span><StatusBadge status={q.status} /></div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#1B2A4A", marginBottom: 4 }}>{q.description}</div>
              <div style={{ display: "flex", gap: 24, marginTop: 10 }}>
                <div><span style={{ fontSize: 11, color: "#8B9DC3" }}>Date</span><div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{q.date}</div></div>
                <div><span style={{ fontSize: 11, color: "#8B9DC3" }}>Amount</span><div style={{ fontSize: 13, fontWeight: 700, color: "#1B2A4A" }}>{q.amount}</div></div>
                <div><span style={{ fontSize: 11, color: "#8B9DC3" }}>Valid Until</span><div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{q.validUntil}</div></div>
              </div>
              <div style={{ marginTop: 14, display: "flex", gap: 8 }}><button className="btn-primary" style={{ padding: "8px 18px", fontSize: 12 }}>View Full Quote</button><button className="action-sm">Download PDF</button></div>
            </div>
          )) : <div style={{ padding: 40, textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>No approved quotes for this machine.</div>}
        </div>
      )}

      {detailTab === "orders" && (
        <div className="panel">
          <div className="panel-head"><div className="panel-title">Parts Orders</div><span style={{ fontSize: 12, color: "#6B7280" }}>{machineOrders.length} orders</span></div>
          <table><thead><tr><th>Order ID</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{machineOrders.map((o, i) => (
              <tr key={i}><td style={{ fontWeight: 600, color: "#E8941A", fontSize: 12 }}>{o.id}</td><td style={{ fontSize: 12, color: "#6B7280" }}>{o.date}</td><td style={{ fontSize: 12, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.items}</td><td style={{ fontWeight: 700 }}>{o.total}</td><td><StatusBadge status={o.status} /></td><td><button className="action-sm">View</button>{o.status === "Delivered" && <button className="action-sm">Reorder</button>}</td></tr>
            ))}</tbody></table>
        </div>
      )}
    </div>
  );
}

/* ── Main Portal ── */
export default function CustomerPortal() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [orderFilter, setOrderFilter] = useState("All");
  const [quoteFilter, setQuoteFilter] = useState("All");
  const [showRegister, setShowRegister] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Icons.dashboard },
    { id: "machines", label: "My Machines", icon: Icons.machines },
    { id: "orders", label: "Order History", icon: Icons.orders },
    { id: "quotes", label: "Quote Requests", icon: Icons.quotes },
    { id: "profile", label: "Profile & Addresses", icon: Icons.profile },
  ];

  const filteredOrders = orders.filter(o => orderFilter === "All" || o.status === orderFilter);
  const filteredQuotes = quoteRequests.filter(i => quoteFilter === "All" || i.status === quoteFilter);

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: "#F5F6F8", minHeight: "100vh", color: "#1A1A1A" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .top-nav{background:#1B2A4A;padding:0 32px;height:56px;display:flex;align-items:center;justify-content:space-between;position:fixed;top:0;left:0;right:0;z-index:100}
        .cb-logo{font-weight:800;font-size:16px;color:#fff;display:flex;align-items:center;gap:10px}
        .cb-logo .check{color:#E8941A;font-size:20px}
        .cb-logo .sub{font-size:11px;font-weight:400;color:#8B9DC3;margin-left:8px}
        .top-right{display:flex;align-items:center;gap:12px}
        .user-pill{background:#243656;padding:6px 14px;border-radius:6px;color:#C9D5E8;font-weight:600;font-size:11px}
        .cross-link{color:#8B9DC3;font-size:12px;font-weight:500;cursor:pointer;text-decoration:none;padding:6px 12px;border-radius:6px;border:1px solid rgba(139,157,195,0.25);transition:all .15s}
        .cross-link:hover{color:#E8941A;border-color:rgba(232,148,26,0.4)}
        .sidebar{position:fixed;top:56px;left:0;bottom:0;width:230px;background:#fff;border-right:1px solid #E5E7EB;padding:20px 0;z-index:90;display:flex;flex-direction:column}
        .sidebar-section-label{padding:0 20px;font-size:10px;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;margin:16px 0 8px}
        .nav-item{display:flex;align-items:center;gap:12px;padding:10px 20px;cursor:pointer;color:#6B7280;font-size:13px;font-weight:500;transition:all .12s;border-left:3px solid transparent;white-space:nowrap}
        .nav-item:hover{color:#1B2A4A;background:#F9FAFB}
        .nav-item.active{color:#E8941A;background:#FFF8EC;border-left-color:#E8941A;font-weight:600}
        .nav-item .nav-icon{flex-shrink:0;display:flex;align-items:center;justify-content:center;width:20px}
        .sidebar-footer{margin-top:auto;padding:16px 20px;border-top:1px solid #F3F4F6}
        .main-content{margin-left:230px;margin-top:56px;padding:28px 36px;min-height:calc(100vh - 56px)}
        .page-title{font-size:22px;font-weight:700;color:#1B2A4A}
        .page-sub{font-size:13px;color:#6B7280;margin-top:4px}
        .section-title{font-size:20px;font-weight:700;color:#1B2A4A}
        .stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:20px 0}
        .stat-card{background:#fff;border-radius:10px;padding:18px;border:1px solid #E5E7EB}
        .stat-label{font-size:11px;color:#8B9DC3;font-weight:600;text-transform:uppercase;letter-spacing:.3px}
        .stat-value{font-size:24px;font-weight:700;color:#1B2A4A;margin-top:4px}
        .stat-sub{font-size:11px;color:#6B7280;margin-top:2px}
        .two-col{display:grid;grid-template-columns:5fr 3fr;gap:20px}
        .panel{background:#fff;border-radius:10px;border:1px solid #E5E7EB;overflow:hidden;margin-bottom:20px}
        .panel-head{padding:14px 20px;border-bottom:1px solid #F3F4F6;display:flex;justify-content:space-between;align-items:center}
        .panel-title{font-weight:700;font-size:14px;color:#1B2A4A}
        .panel-link{font-size:12px;color:#E8941A;font-weight:600;cursor:pointer}
        table{width:100%;border-collapse:collapse}
        th{text-align:left;padding:10px 16px;font-size:11px;font-weight:600;color:#8B9DC3;text-transform:uppercase;letter-spacing:.5px;background:#FAFBFC;border-bottom:1px solid #F3F4F6}
        td{padding:11px 16px;font-size:13px;color:#374151;border-bottom:1px solid #F3F4F6}
        tr:hover td{background:#FAFBFC}
        .ml-row{display:grid;grid-template-columns:44px 1.5fr 1fr 1fr 1fr auto;align-items:center;gap:14px;padding:14px 20px;border-bottom:1px solid #F3F4F6;cursor:pointer;transition:background .1s}
        .ml-row:hover{background:#FFFBF5}
        .ml-row:last-child{border-bottom:none}
        .ml-icon{width:44px;height:44px;background:linear-gradient(135deg,#FFF8EC,#FEEBC8);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;border:1px solid #FFE0A0}
        .ml-model{font-size:11px;color:#E8941A;font-weight:600;font-family:monospace}
        .ml-name{font-weight:600;font-size:13px;color:#1B2A4A;margin-top:1px}
        .ml-meta-value{font-size:13px;color:#374151;font-weight:600;margin-top:2px}
        .ml-link{color:#0284C7;font-size:12px;font-weight:500;text-decoration:none;display:inline-flex;align-items:center;gap:4px}
        .ml-link:hover{text-decoration:underline}
        .ml-header{display:grid;grid-template-columns:44px 1.5fr 1fr 1fr 1fr auto;align-items:center;gap:14px;padding:10px 20px;background:#FAFBFC;border-bottom:1px solid #F3F4F6}
        .ml-header-label{font-size:10px;font-weight:600;color:#8B9DC3;text-transform:uppercase;letter-spacing:.5px}
        .back-btn{display:inline-flex;align-items:center;gap:6px;background:none;border:none;color:#E8941A;font-size:13px;font-weight:600;cursor:pointer;padding:0;margin-bottom:20px;font-family:inherit}
        .back-btn:hover{color:#D4840A}
        .detail-header{display:flex;justify-content:space-between;align-items:flex-start;background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:24px;margin-bottom:20px;gap:20px;flex-wrap:wrap}
        .detail-header-left{display:flex;gap:18px;align-items:flex-start}
        .detail-machine-icon{width:64px;height:64px;background:linear-gradient(135deg,#FFF8EC,#FEEBC8);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:30px;flex-shrink:0;border:1px solid #FFE0A0}
        .detail-meta-chip{display:flex;flex-direction:column;gap:1px}
        .detail-meta-label{font-size:10px;color:#8B9DC3;font-weight:500;text-transform:uppercase;letter-spacing:.3px}
        .detail-meta-value{font-size:13px;color:#374151;font-weight:600}
        .detail-tabs{display:flex;gap:0;background:#fff;border:1px solid #E5E7EB;border-radius:10px;overflow:hidden;margin-bottom:20px}
        .detail-tab{padding:12px 24px;font-size:13px;font-weight:500;color:#6B7280;cursor:pointer;border:none;background:none;border-bottom:2px solid transparent;font-family:inherit;transition:all .12s}
        .detail-tab:hover{color:#1B2A4A;background:#FAFBFC}
        .detail-tab.active{color:#E8941A;border-bottom-color:#E8941A;font-weight:600}
        .detail-grid{display:grid;grid-template-columns:3fr 2fr;gap:20px}
        .detail-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .di-label{font-size:11px;color:#8B9DC3;font-weight:500;margin-bottom:3px}
        .di-value{font-size:13px;color:#374151;font-weight:600}
        .qs-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #F3F4F6;font-size:13px}
        .qs-label{color:#6B7280} .qs-value{color:#1B2A4A;font-weight:600}
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
        .btn-primary{background:#E8941A;color:#fff;border:none;padding:10px 22px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit}
        .btn-primary:hover{background:#D4840A}
        .btn-outline{background:#fff;color:#1B2A4A;border:1px solid #D1D5DB;padding:10px 22px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit}
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

      <nav className="top-nav">
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div className="cb-logo"><span className="check">&#10003;</span>CHOICE BAGGING EQUIPMENT<span className="sub">/ Customer Portal</span></div>
        </div>
        <div className="top-right">
          <Link href="/parts" className="cross-link" style={{ color: "#8B9DC3", fontSize: 12, fontWeight: 500, textDecoration: "none", padding: "6px 12px", borderRadius: 6, border: "1px solid rgba(139,157,195,0.25)" }}>Parts Store &rarr;</Link>
          <span className="user-pill">Midwest Feed Co.</span>
        </div>
      </nav>

      <aside className="sidebar">
        <div className="sidebar-section-label">Navigation</div>
        {navItems.map(item => (
          <div key={item.id} className={`nav-item ${activeSection === item.id ? "active" : ""}`} onClick={() => { setActiveSection(item.id); setSelectedMachine(null); }}>
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
        <div className="sidebar-footer">
          <div style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.5 }}>
            <div style={{ fontWeight: 600, color: "#6B7280", marginBottom: 2 }}>Midwest Feed Co.</div>
            Account: CBE-CUST-00284
          </div>
        </div>
      </aside>

      <main className="main-content">

        {/* DASHBOARD */}
        {activeSection === "dashboard" && (
          <div>
            <div><div className="page-title">Welcome back, Mike</div><div className="page-sub">Midwest Feed Co. &mdash; 3 registered CBE machines &mdash; Last order: Feb 26, 2025</div></div>
            <div className="stat-row">
              <div className="stat-card" style={{ borderTop: "3px solid #E8941A" }}><div className="stat-label">Registered Machines</div><div className="stat-value">3</div><div className="stat-sub">All machines active</div></div>
              <div className="stat-card" style={{ borderTop: "3px solid #3D5A80" }}><div className="stat-label">Total Orders</div><div className="stat-value">17</div><div className="stat-sub">7 orders in last 6 months</div></div>
              <div className="stat-card" style={{ borderTop: "3px solid #2563EB" }}><div className="stat-label">Active Shipments</div><div className="stat-value">1</div><div className="stat-sub">CBE-ORD-4821 in transit</div></div>
              <div className="stat-card" style={{ borderTop: "3px solid #D97706" }}><div className="stat-label">Open Quotes</div><div className="stat-value">1</div><div className="stat-sub">Quote received</div></div>
            </div>
            <div className="two-col">
              <div>
                <div className="panel">
                  <div className="panel-head"><div className="panel-title">My Machines</div><span className="panel-link" onClick={() => setActiveSection("machines")}>View All &rarr;</span></div>
                  {machines.map((m, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: i < machines.length - 1 ? "1px solid #F3F4F6" : "none", cursor: "pointer", transition: "background .1s" }} onClick={() => { setActiveSection("machines"); setSelectedMachine(m); }}>
                      <div className="ml-icon">&#127981;</div>
                      <div style={{ flex: 1 }}>
                        <div className="ml-model">{m.model}</div>
                        <div className="ml-name">{m.name}</div>
                        <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>S/N: {m.serial}</div>
                      </div>
                      <div style={{ color: "#9CA3AF" }}>{Icons.chevronRight}</div>
                    </div>
                  ))}
                </div>
                <div className="panel">
                  <div className="panel-head"><div className="panel-title">Recent Orders</div><span className="panel-link" onClick={() => setActiveSection("orders")}>All Orders &rarr;</span></div>
                  <table><thead><tr><th>Order</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
                    <tbody>{orders.slice(0, 4).map((o, i) => (
                      <tr key={i}><td style={{ fontWeight: 600, color: "#E8941A", fontSize: 12 }}>{o.id}</td><td style={{ fontSize: 12, color: "#6B7280" }}>{o.date}</td><td style={{ fontSize: 12, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.items}</td><td style={{ fontWeight: 700 }}>{o.total}</td><td><StatusBadge status={o.status} /></td></tr>
                    ))}</tbody></table>
                </div>
              </div>
              <div>
                <div className="panel">
                  <div className="panel-head"><div className="panel-title">Recommended Parts</div><span style={{ fontSize: 11, color: "#8B9DC3" }}>Based on your machines</span></div>
                  {recommendedParts.map((p, i) => (
                    <div key={i} className="rec-card">
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: p.urgency === "high" ? "#EF4444" : p.urgency === "medium" ? "#E8941A" : "#6B7280", flexShrink: 0 }} /><div className="rec-name">{p.name}</div></div>
                      <div className="rec-partno">{p.partNo}</div>
                      <div className="rec-reason">{p.reason}</div>
                      <div className="rec-bottom"><div className="rec-price">{p.price}</div><button className="rec-add">Add to Cart</button></div>
                    </div>
                  ))}
                </div>
                <div className="panel">
                  <div className="panel-head"><div className="panel-title">Open Quote Request</div><span className="panel-link" onClick={() => setActiveSection("quotes")}>All &rarr;</span></div>
                  <div className="inq-card">
                    <div className="inq-top"><span className="inq-ref">{quoteRequests[0].ref}</span><StatusBadge status={quoteRequests[0].status} /></div>
                    <div className="inq-type">{quoteRequests[0].type}</div>
                    <div className="inq-desc">{quoteRequests[0].desc}</div>
                    <div className="inq-footer"><div className="inq-date">Submitted: {quoteRequests[0].date}</div><div className="inq-amount">Quote: {quoteRequests[0].quoteAmount}</div></div>
                    <button className="btn-primary" style={{ width: "100%", marginTop: 12, fontSize: 12 }}>Review Quote &rarr;</button>
                  </div>
                </div>
                <div className="panel">
                  <div className="panel-head"><div className="panel-title">Quick Actions</div></div>
                  <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                    <button className="btn-outline" style={{ width: "100%", textAlign: "left", padding: "10px 16px" }}>&#128722; Order Parts for My Machines</button>
                    <button className="btn-outline" style={{ width: "100%", textAlign: "left", padding: "10px 16px" }}>&#128221; Request a Quote</button>
                    <button className="btn-outline" style={{ width: "100%", textAlign: "left", padding: "10px 16px" }} onClick={() => setShowRegister(true)}>&#10133; Register Another Machine</button>
                    <button className="btn-outline" style={{ width: "100%", textAlign: "left", padding: "10px 16px" }}>&#128222; Contact Support</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MY MACHINES */}
        {activeSection === "machines" && (
          <div>
            {selectedMachine ? (
              <MachineDetailView machine={selectedMachine} onBack={() => setSelectedMachine(null)} />
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <div><div className="section-title">My Machines</div><div className="page-sub">CBE equipment registered to your account. Click a machine to view details, invoices, and approved quotes.</div></div>
                  <button className="btn-primary" onClick={() => setShowRegister(true)}>+ Register a Machine</button>
                </div>
                <div className="panel">
                  <div className="ml-header"><div /><div className="ml-header-label">Machine</div><div className="ml-header-label">Sales Order No.</div><div className="ml-header-label">Serial No.</div><div className="ml-header-label">Service Page</div><div /></div>
                  {machines.map((m, i) => (
                    <div key={i} className="ml-row" onClick={() => setSelectedMachine(m)}>
                      <div className="ml-icon">&#127981;</div>
                      <div><div className="ml-model">{m.model}</div><div className="ml-name">{m.name}</div><div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>Purchased: {m.purchased}</div></div>
                      <div><div className="ml-meta-value" style={{ fontFamily: "monospace", color: "#374151" }}>{m.salesOrder}</div></div>
                      <div><div className="ml-meta-value" style={{ fontFamily: "monospace" }}>{m.serial}</div></div>
                      <div><a href={m.servicePage} className="ml-link" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>Service Page {Icons.externalLink}</a></div>
                      <div style={{ color: "#9CA3AF", display: "flex", alignItems: "center" }}>{Icons.chevronRight}</div>
                    </div>
                  ))}
                </div>
                <div className="info-orange" style={{ marginTop: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#B45309", marginBottom: 6 }}>Machine not listed here?</div>
                  <div style={{ fontSize: 13, color: "#92400E", lineHeight: 1.7 }}>If you purchased a CBE machine before this portal existed, click <span style={{ fontWeight: 700, cursor: "pointer", textDecoration: "underline", color: "#E8941A" }} onClick={() => setShowRegister(true)}>Register a Machine</span>. Enter your model and serial number and our team will verify and add it within 1 business day.</div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ORDER HISTORY */}
        {activeSection === "orders" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div><div className="section-title">Order History</div><div className="page-sub">All past parts orders and machine purchases.</div></div>
              <input className="search-input" placeholder="Search by order ID, items..." />
            </div>
            <div className="filter-row">{["All", "Shipped", "Delivered", "Processing"].map(f => (
              <button key={f} className={`fpill ${orderFilter === f ? "active" : ""}`} onClick={() => setOrderFilter(f)}>{f === "All" ? "All Orders" : f} ({f === "All" ? orders.length : orders.filter(o => o.status === f).length})</button>
            ))}</div>
            <div className="panel">
              <table><thead><tr><th>Order ID</th><th>Date</th><th>Items</th><th>Machine</th><th>Total</th><th>Status</th><th>Tracking</th><th>Actions</th></tr></thead>
                <tbody>{filteredOrders.map((o, i) => (
                  <tr key={i}><td style={{ fontWeight: 600, color: "#E8941A", fontSize: 12 }}>{o.id}</td><td style={{ fontSize: 12, color: "#6B7280" }}>{o.date}</td><td style={{ fontSize: 12, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.items} <span style={{ color: "#9CA3AF" }}>({o.itemCount})</span></td><td><span style={{ fontSize: 11, color: "#E8941A", fontFamily: "monospace", fontWeight: 500 }}>{o.machine}</span></td><td style={{ fontWeight: 700 }}>{o.total}</td><td><StatusBadge status={o.status} /></td><td style={{ fontSize: 11 }}>{o.tracking ? <span style={{ color: "#E8941A", cursor: "pointer", textDecoration: "underline" }}>Track</span> : <span style={{ color: "#9CA3AF" }}>-</span>}</td><td><button className="action-sm">View</button><button className="action-sm">Invoice</button>{o.status === "Delivered" && <button className="action-sm">Reorder</button>}</td></tr>
                ))}</tbody></table>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
              <div className="stat-card"><div className="stat-label">Total Spent</div><div className="stat-value" style={{ fontSize: 20 }}>$12,470</div><div className="stat-sub">Across 17 orders</div></div>
              <div className="stat-card"><div className="stat-label">Most Ordered Part</div><div className="stat-value" style={{ fontSize: 15 }}>Sealing Bar Assembly</div><div className="stat-sub">Ordered 4 times</div></div>
              <div className="stat-card"><div className="stat-label">Avg. Order Value</div><div className="stat-value" style={{ fontSize: 20 }}>$733</div><div className="stat-sub">Parts orders only</div></div>
            </div>
          </div>
        )}

        {/* QUOTE REQUESTS */}
        {activeSection === "quotes" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div><div className="section-title">Quote Requests</div><div className="page-sub">Custom machine requests and quotes via CRM integration.</div></div>
              <button className="btn-primary">+ Request a Quote</button>
            </div>
            <div className="filter-row">{["All", "Quote Sent", "Accepted", "Completed"].map(f => (
              <button key={f} className={`fpill ${quoteFilter === f ? "active" : ""}`} onClick={() => setQuoteFilter(f)}>{f === "All" ? "All Requests" : f} ({f === "All" ? quoteRequests.length : quoteRequests.filter(i => i.status === f).length})</button>
            ))}</div>
            <div className="panel">
              {filteredQuotes.map((inq, i) => (
                <div key={i} className="inq-card">
                  <div className="inq-top"><span className="inq-ref">{inq.ref}</span><StatusBadge status={inq.status} /></div>
                  <div className="inq-type">{inq.type}</div>
                  <div className="inq-desc">{inq.desc}</div>
                  <div className="inq-footer"><div className="inq-date">Submitted: {inq.date}</div><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div className="inq-amount">Quote: {inq.quoteAmount}</div>{inq.status === "Quote Sent" && <button className="btn-primary" style={{ padding: "6px 16px", fontSize: 12 }}>Review Quote &rarr;</button>}{inq.status !== "Quote Sent" && <button className="action-sm">View Details</button>}</div></div>
                </div>
              ))}
            </div>
            <div className="info-yellow" style={{ marginTop: 8 }}><div style={{ fontSize: 13, color: "#92400E", lineHeight: 1.6 }}><strong>How it works:</strong> Quote requests auto-create a CRM lead routed to engineering. Quotes are generated via integrated quoting tool and delivered to your portal and email.</div></div>
            <div className="panel" style={{ marginTop: 20 }}>
              <div className="panel-head"><div className="panel-title">Submit New Quote Request</div><span style={{ fontSize: 12, color: "#8B9DC3" }}>Sent to engineering via CRM</span></div>
              <div style={{ padding: 24 }}>
                <div className="form-grid">
                  <div><label className="form-label">Machine Type Needed *</label><select className="form-input" style={{ cursor: "pointer" }}><option>Select machine type...</option><option>Open Mouth Bag Filler</option><option>Valve Bag Filler</option><option>Bulk Bag Filler</option><option>Bulk Bag Unloader</option></select></div>
                  <div><label className="form-label">Product Being Bagged *</label><input className="form-input" placeholder="e.g., Granular fertilizer, powder cement..." /></div>
                  <div><label className="form-label">Bag Type and Size *</label><input className="form-input" placeholder="e.g., 50lb open mouth poly bags" /></div>
                  <div><label className="form-label">Desired Fill Rate</label><input className="form-input" placeholder="e.g., 8-10 bags per minute" /></div>
                </div>
                <div style={{ marginTop: 16 }}><label className="form-label">Custom Requirements</label><textarea className="form-input" style={{ height: 80, resize: "vertical" }} placeholder="Stainless steel, FDA compliance, explosion-proof motors, space constraints..." /></div>
                <div style={{ marginTop: 20, display: "flex", gap: 12 }}><button className="btn-primary">Submit Quote Request &rarr;</button><button className="btn-outline">Save as Draft</button></div>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {activeSection === "profile" && (
          <div>
            <div className="section-title" style={{ marginBottom: 24 }}>Profile &amp; Addresses</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div className="panel">
                <div className="panel-head"><div className="panel-title">Company Information</div><span className="panel-link">Edit</span></div>
                <div style={{ padding: 20 }}>
                  <div className="form-grid">
                    <div><label className="form-label">Company Name</label><input className="form-input" value="Midwest Feed Co." readOnly /></div>
                    <div><label className="form-label">Account Contact</label><input className="form-input" value="Mike Thompson" readOnly /></div>
                    <div><label className="form-label">Email</label><input className="form-input" value="mike@midwestfeed.com" readOnly /></div>
                    <div><label className="form-label">Phone</label><input className="form-input" value="(316) 555-0184" readOnly /></div>
                    <div><label className="form-label">Account ID</label><input className="form-input" value="CBE-CUST-00284" readOnly style={{ fontFamily: "monospace", color: "#E8941A" }} /></div>
                    <div><label className="form-label">Account Since</label><input className="form-input" value="August 2022" readOnly /></div>
                  </div>
                </div>
              </div>
              <div className="panel">
                <div className="panel-head"><div className="panel-title">Shipping Addresses</div><span className="panel-link">+ Add Address</span></div>
                <div style={{ padding: 20 }}>
                  <div className="addr-card"><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div className="addr-label">Primary - Main Plant</div><span style={{ fontSize: 10, background: "#DCFCE7", color: "#166534", padding: "2px 8px", borderRadius: 3, fontWeight: 600 }}>Default</span></div><div className="addr-text">Midwest Feed Co.<br />4521 Industrial Blvd<br />Wichita, KS 67202</div><div style={{ fontSize: 11, color: "#6B7280", marginTop: 6 }}>Dock available - No lift gate needed</div></div>
                  <div className="addr-card"><div className="addr-label">Secondary - Satellite Facility</div><div className="addr-text">Midwest Feed Co. East<br />890 Commerce Dr<br />Topeka, KS 66612</div><div style={{ fontSize: 11, color: "#D97706", marginTop: 6 }}>No dock - Lift gate required</div></div>
                </div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-head"><div className="panel-title">Notification Preferences</div></div>
              <div style={{ padding: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[{ label: "Order confirmation and shipping updates", checked: true, desc: "Email when order is confirmed, shipped, and delivered" }, { label: "Parts recommendations for my machines", checked: true, desc: "Suggested parts based on machine age and usage" }, { label: "Quote request status updates", checked: true, desc: "Email when request status changes or quote is ready" }, { label: "New product announcements", checked: false, desc: "Updates when new CBE machines or parts are available" }].map((pref, i) => (
                    <label key={i} style={{ display: "flex", gap: 12, cursor: "pointer", padding: 12, border: "1px solid #F3F4F6", borderRadius: 8 }}>
                      <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${pref.checked ? "#E8941A" : "#D1D5DB"}`, background: pref.checked ? "#E8941A" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{pref.checked && "\u2713"}</div>
                      <div><div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{pref.label}</div><div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{pref.desc}</div></div>
                    </label>
                  ))}
                </div>
                <div style={{ marginTop: 20, display: "flex", gap: 12 }}><button className="btn-primary">Save Preferences</button><button className="btn-outline">Reset to Defaults</button></div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-head"><div className="panel-title">Security</div></div>
              <div style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Password</div><div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>Last changed: 45 days ago</div></div><button className="btn-outline" style={{ padding: "8px 18px" }}>Change Password</button></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
