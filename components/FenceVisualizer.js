"use client";

export default function FenceVisualizer({ width, length }) {
  const wVal = parseFloat(width) || 0;
  const lVal = parseFloat(length) || 0;

  if (wVal <= 0 || lVal <= 0) return null;

  // กำหนดขอบเขตการวาดสูงสุด (เว้นที่ว่างรอบข้างสำหรับตัวเลขและลูกศร)
  const maxWidth = 160; 
  const maxHeight = 100;
  const ratio = wVal / lVal;
  
  let rectW, rectL;
  if (ratio > (maxWidth / maxHeight)) {
    rectW = maxWidth;
    rectL = maxWidth / ratio;
  } else {
    rectL = maxHeight;
    rectW = maxHeight * ratio;
  }

  // จัดตำแหน่งกึ่งกลาง SVG (Canvas 240x160)
  // ปรับ Offset ให้มีพื้นที่ด้านบนมากขึ้นเพื่อโชว์ตัวเลขกว้าง
  const offsetX = (240 - rectW) / 2;
  const offsetY = (160 - rectL) / 2 + 10; 

  return (
    <div className="mt-6 bg-slate-950 p-6 rounded-[2rem] border border-slate-800 shadow-inner relative overflow-hidden">
      <p className="text-[10px] text-blue-400 mb-6 text-center uppercase tracking-[0.2em] font-black">
        ภาพจำลองพื้นที่ดิน (TOP VIEW)
      </p>
      
      <svg viewBox="0 0 240 160" className="w-full h-auto drop-shadow-2xl">
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#60a5fa" />
          </marker>
          <marker id="arrowhead-rev" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="8 0, 0 3, 8 6" fill="#60a5fa" />
          </marker>
        </defs>

        {/* เส้นบอกระยะด้านกว้าง (ด้านบน) - ดันตำแหน่ง Y ขึ้นให้พ้นขอบรูป */}
        <line x1={offsetX} y1={offsetY - 20} x2={offsetX + rectW} y2={offsetY - 20} stroke="#60a5fa" strokeWidth="1" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead-rev)" />
        <text x={offsetX + (rectW/2)} y={offsetY - 28} textAnchor="middle" fill="#93c5fd" fontSize="10" fontWeight="bold" className="font-mono">
          {wVal.toLocaleString()} M.
        </text>

        {/* พื้นที่รั้ว */}
        <rect 
          x={offsetX} y={offsetY} width={rectW} height={rectL} 
          fill="rgba(59, 130, 246, 0.05)" 
          stroke="#3b82f6" 
          strokeWidth="2" 
          strokeDasharray="4 2"
        />

        {/* เส้นบอกระยะด้านยาว (ด้านขวา) */}
        <line x1={offsetX + rectW + 20} y1={offsetY} x2={offsetX + rectW + 20} y2={offsetY + rectL} stroke="#60a5fa" strokeWidth="1" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead-rev)" />
        <text 
          x={offsetX + rectW + 30} y={offsetY + (rectL/2)} 
          textAnchor="middle" fill="#93c5fd" fontSize="10" fontWeight="bold" 
          transform={`rotate(90, ${offsetX + rectW + 30}, ${offsetY + (rectL/2)})`}
          className="font-mono"
        >
          {lVal.toLocaleString()} M.
        </text>

        {/* จุดเสามุม */}
        <circle cx={offsetX} cy={offsetY} r="3" fill="#10b981" />
        <circle cx={offsetX + rectW} cy={offsetY} r="3" fill="#10b981" />
        <circle cx={offsetX} cy={offsetY + rectL} r="3" fill="#10b981" />
        <circle cx={offsetX + rectW} cy={offsetY + rectL} r="3" fill="#10b981" />

        <text x="120" y={offsetY + (rectL/2) + 4} textAnchor="middle" fill="#334155" fontSize="7" fontWeight="bold" className="uppercase tracking-widest">
          พื้นที่รั้ว
        </text>
      </svg>

      <div className="mt-4 flex justify-between items-center text-[9px] font-bold">
        <div className="flex items-center text-emerald-400">
          <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
          เสาเข้ามุม
        </div>
        <div className="flex items-center text-blue-400">
          <span className="w-4 h-0.5 bg-blue-400 border border-dashed border-blue-400 mr-2"></span>
          แนวรั้ว
        </div>
      </div>
    </div>
  );
}