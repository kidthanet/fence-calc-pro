"use client";

import React from 'react';

export default function WireComparison({ totalPerimeter }) {
  // Logic ตามสั่ง: 
  // 1. ถ้ายังไม่กรอก (0) หรือกรอกแล้วแต่ไม่เกิน 50 เมตร -> ให้ถือว่าใช้ 1 ม้วน (ราคายืนพื้น)
  // 2. ถ้าพื้นที่รอบรูปเกิน 50 เมตร (เงื่อนไขเปลี่ยนที่ 51 เมตร หรือ 99 เมตร) -> ให้ปัดขึ้นเป็นจำนวนม้วนจริง
  const currentPerimeter = parseFloat(totalPerimeter) || 0;
  const rollsNeeded = (currentPerimeter <= 50) ? 1 : Math.ceil(currentPerimeter / 50);

  const tensileNetOptions = [
    { 
      h: "1.0 ม.", 
      model: "รุ่น 7 ช่อง", 
      pricePerRoll: 2100, 
      desc: "ความสูงมาตรฐาน สำหรับกั้นสัตว์เล็ก",
      url: "https://sandeeden.co.th/our-products/" // ใส่ลิงก์ของพี่เอ๋ตรงนี้ครับ
    },
    { 
      h: "1.2 ม.", 
      model: "รุ่น 9 ช่อง", 
      pricePerRoll: 2500, 
      desc: "ความสูงยอดนิยม ป้องกันสุนัขและสัตว์ทั่วไป",
      url: "https://sandeeden.co.th/our-products/" 
    },
    { 
      h: "1.5 ม.", 
      model: "รุ่น 10 ช่อง", 
      pricePerRoll: 2800, 
      desc: "ความสูงพิเศษ ป้องกันการกระโดด",
      url: "https://sandeeden.co.th/our-products/" 
    },
    { 
      h: "2.0 ม.", 
      model: "รุ่น 12 ช่อง", 
      pricePerRoll: 3500, 
      desc: "ความสูงสูงสุด เพื่อความปลอดภัยระดับสูงสุด",
      url: "https://sandeeden.co.th/our-products/" 
    }
  ];

  return (
    <div className="mt-8">
      <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest flex items-center">
        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
        ทางเลือกอื่น: ตาข่ายแรงดึงสูง (ม้วนละ 50 ม.)
      </h3>

	  {/* +++ แทรกรูปภาพตรงนี้ครับพี่เอ๋ +++ */}
    <div className="mb-5 rounded-2xl overflow-hidden border border-slate-700 shadow-lg">
      <img 
        src="/images/high-tensile-banner.jpg" // อย่าลืมนำรูปแบนเนอร์ตาข่ายมาวางใน public/images/ นะครับ
        alt="ตาข่ายแรงดึงสูง PK" 
        className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
      />
      <div className="bg-slate-800 p-2 text-center">
        <p className="text-[10px] text-blue-400 font-bold">เปรียบเทียบความคุ้มค่า: อายุการใช้งานนานกว่า 5 เท่า</p>
      </div>
    </div>
      
      <div className="space-y-3">
        {tensileNetOptions.map((item, index) => {
          const totalPrice = rollsNeeded * item.pricePerRoll;
          
          return (
            <a 
              key={index} 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-slate-800/40 border border-white/5 p-4 rounded-2xl hover:bg-slate-700/60 hover:border-blue-500/50 transition-all group cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="text-blue-400 font-black text-lg mr-2 group-hover:text-blue-300">สูง {item.h}</span>
                    <span className="bg-slate-700 text-[10px] px-2 py-0.5 rounded text-slate-300">
                      {item.model}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{item.desc}</p>
                </div>
                <div className="text-right">
                  <span className="block text-green-400 font-bold text-xl group-hover:scale-105 transition-transform">
                    ฿{totalPrice.toLocaleString()}
                  </span>
                  <p className="text-[10px] text-slate-600 italic">
                    {rollsNeeded > 1 ? `คำนวณจาก ${rollsNeeded} ม้วน` : "ราคายืนพื้น/ม้วน"}
                  </p>
                  {/* เพิ่มไกด์ไลน์เล็กๆ ให้รู้ว่ากดได้ */}
                  <span className="text-[9px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    ดูรายละเอียดสินค้า →
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-slate-800/60 rounded-xl border border-white/5">
        <p className="text-[10px] text-slate-500 leading-relaxed text-center">
          * ตาข่ายแรงดึงสูงมีความทนทานกว่าลวดหนามทั่วไป 3-5 เท่า และติดตั้งง่ายกว่า
        </p>
      </div>
    </div>
  );
}