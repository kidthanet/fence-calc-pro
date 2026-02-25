"use client";

import { useState, useEffect, useMemo } from 'react';
import { areaToSqMeters, getPerimeterFromArea, calculateFenceProject } from '@/lib/calculations';
import { shippingDatabase } from '@/lib/shippingData'; 
import FenceVisualizer from '@/components/FenceVisualizer';
import WireComparison from '@/components/WireComparison';

export default function FenceCalculatorPage() {
  const [calcMode, setCalcMode] = useState('dimension');
  
  const [inputs, setInputs] = useState({
    width: 0, 
    length: 0, 
    rai: 0, 
    ngan: 0, 
    wa: 0,
    layers: 4, 
    postSpacing: 2.5, 
    rollLength: 50,
    wireLabel: "เบอร์ 12",
    pricePerRoll: 510, 
    pricePerPost: 375, // ฟิกราคาไว้ที่ 375 ตามเงื่อนไข
    includePosts: true,
    shippingType: null 
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [results, setResults] = useState(null);

  // ค้นหาข้อมูลขนส่ง
  const filteredShipping = useMemo(() => {
    if (searchTerm.length <= 2) return [];
    return shippingDatabase.filter(item => 
      item.รหัส?.toString().includes(searchTerm) || 
      item.ตำบล?.includes(searchTerm) ||
      item.อำเภอ?.includes(searchTerm)
    ).slice(0, 8);
  }, [searchTerm]);

  // Logic การคำนวณหลัก
  useEffect(() => {
    const w = Math.max(0, parseFloat(inputs.width) || 0);
    const l = Math.max(0, parseFloat(inputs.length) || 0);
    const spacing = Math.max(0.1, parseFloat(inputs.postSpacing) || 2.5); 
    
    let currentPerimeter = 0;
    if (calcMode === 'dimension') {
      currentPerimeter = (w + l) * 2;
    } else {
      const sqMeters = areaToSqMeters(inputs.rai, inputs.ngan, inputs.wa);
      currentPerimeter = getPerimeterFromArea(sqMeters);
    }

    const report = calculateFenceProject({
      perimeter: currentPerimeter,
      layers: Number(inputs.layers) || 0,
      postSpacing: spacing,
      rollLength: Number(inputs.rollLength) || 50,
      pricePerRoll: Number(inputs.pricePerRoll) || 0,
      pricePerPost: 375 
    });

    const finalPosts = inputs.includePosts ? report.totalPosts : 0;
    const finalPostCost = inputs.includePosts ? (finalPosts * 375) : 0;
    
    const uClipPerPost = Number(inputs.layers) || 0;
    const totalUClips = inputs.includePosts ? (finalPosts * uClipPerPost) : 0;
    const uClipCost = totalUClips * 5; 

    let shippingCost = 0;
    if (inputs.shippingType === 'express') {
      shippingCost = (report.totalRolls * 100);
    } else if (inputs.shippingType === 'pk' && selectedLocation) {
      shippingCost = parseFloat(selectedLocation.ค่ารถ) || 0;
    }

    const finalBudget = report.wireCost + finalPostCost + uClipCost + shippingCost;

    setResults({
      ...report,
      totalPosts: finalPosts,
      perimeter: currentPerimeter,
      totalUClips,
      uClipCost,
      shippingCost,
      totalBudget: finalBudget
    });
  }, [inputs, calcMode, selectedLocation]);

  const handleRollChange = (e) => {
    const length = e.target.value;
    let price = 510;
    let label = "เบอร์ 12";

    if (length === "50") {
      label = "เบอร์ 12";
      price = 510;
    } else if (length === "100") {
      label = "เบอร์ 14";
      price = 520;
    }

    setInputs(prev => ({ 
      ...prev, 
      rollLength: length, 
      pricePerRoll: price,
      wireLabel: label 
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black text-blue-900 mb-3 tracking-tight uppercase">โปรแกรมคำนวณราคาวัสดุล้อมรั้ว</h1>
          <p className="text-slate-600 text-lg text-blue-600 font-bold">บริษัท แสนดีเด่น สตีล จำกัด</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold mb-5 flex items-center">
                <span className="bg-blue-600 text-white w-7 h-7 rounded-lg flex items-center justify-center mr-3 text-sm">1</span>
                ระบุขนาดพื้นที่ดิน
              </h2>
              <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                <button onClick={() => setCalcMode('dimension')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${calcMode === 'dimension' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>ระบุกว้าง x ยาว (เมตร)</button>
                <button onClick={() => setCalcMode('area')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${calcMode === 'area' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>ระบุ ไร่ - งาน - วา</button>
              </div>

              {calcMode === 'dimension' ? (
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <input type="number" name="width" value={inputs.width} onChange={handleChange} className="w-full border rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
                    <p className="text-[10px] text-slate-400 ml-2 font-medium">* ความกว้างที่ดิน (เมตร)</p>
                  </div>
                  <div className="space-y-1">
                    <input type="number" name="length" value={inputs.length} onChange={handleChange} className="w-full border rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
                    <p className="text-[10px] text-slate-400 ml-2 font-medium">* ความยาวที่ดิน (เมตร)</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <input type="number" name="rai" value={inputs.rai} onChange={handleChange} className="w-full border rounded-xl p-3.5 text-center outline-none focus:ring-2 focus:ring-blue-500" />
                    <p className="text-[10px] text-slate-400 text-center font-medium">* ไร่</p>
                  </div>
                  <div className="space-y-1">
                    <input type="number" name="ngan" value={inputs.ngan} onChange={handleChange} className="w-full border rounded-xl p-3.5 text-center outline-none focus:ring-2 focus:ring-blue-500" />
                    <p className="text-[10px] text-slate-400 text-center font-medium">* งาน</p>
                  </div>
                  <div className="space-y-1">
                    <input type="number" name="wa" value={inputs.wa} onChange={handleChange} className="w-full border rounded-xl p-3.5 text-center outline-none focus:ring-2 focus:ring-blue-500" />
                    <p className="text-[10px] text-slate-400 text-center font-medium">* วา</p>
                  </div>
                </div>
              )}
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold mb-5 flex items-center">
                <span className="bg-blue-600 text-white w-7 h-7 rounded-lg flex items-center justify-center mr-3 text-sm">2</span>
                ตั้งค่าลวดหนามและเสา
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <select name="layers" value={inputs.layers} onChange={handleChange} className="w-full border rounded-xl p-3.5 bg-white outline-none focus:ring-2 focus:ring-blue-500">
                    {[3,4,5,6,7,8].map(l => <option key={l} value={l}>{l} ชั้น</option>)}
                  </select>
                  <p className="text-[10px] text-slate-400 ml-2 font-medium">* จำนวนเส้นลวดแนวนอน</p>
                </div>
                <div className="space-y-1">
                  <input type="number" step="0.1" name="postSpacing" value={inputs.postSpacing} onChange={handleChange} className="w-full border rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-blue-500" />
                  <p className="text-[10px] text-slate-400 ml-2 font-medium">* ระยะห่างเสา (เมตร)</p>
                </div>
                <div className="space-y-1">
                  <select name="rollLength" value={inputs.rollLength} onChange={handleRollChange} className="w-full border rounded-xl p-3.5 bg-white font-bold text-blue-600 outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="50">เบอร์ 12 (50 ม.)</option>
                    <option value="100">เบอร์ 14 (100 ม.)</option>
                  </select>
                  <p className="text-[10px] text-slate-400 ml-2 font-medium">* ความยาวลวดต่อม้วน</p>
                </div>
              </div>

              <div className="mt-6 flex items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                <input type="checkbox" id="noPost" className="w-5 h-5 text-blue-600 rounded cursor-pointer" checked={!inputs.includePosts} onChange={(e) => setInputs(prev => ({ ...prev, includePosts: !e.target.checked }))} />
                <label htmlFor="noPost" className="ml-3 font-bold text-blue-900 cursor-pointer">ไม่ต้องการเสา (คำนวณเฉพาะลวดและกิ๊บ)</label>
              </div>
            </section>

            <section className="bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-inner">
              <h2 className="text-xl font-bold text-blue-900 mb-5 flex items-center">
                <span className="bg-blue-600 text-white w-7 h-7 rounded-lg flex items-center justify-center mr-3 text-sm">3</span>
                ตั้งค่าราคาและบริการส่ง
              </h2>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-1">
                  <input type="number" name="pricePerRoll" value={inputs.pricePerRoll} onChange={handleChange} className="w-full border-blue-200 rounded-xl p-3.5 text-blue-900 font-bold bg-white" />
                  <p className="text-[10px] text-blue-400 ml-2 font-medium">* ราคาลวดหนาม/ม้วน</p>
                </div>
                <div className="space-y-1">
                  <input type="number" value={375} readOnly disabled={!inputs.includePosts} className={`w-full border-blue-200 rounded-xl p-3.5 font-bold bg-white ${!inputs.includePosts ? 'opacity-50' : 'text-blue-900'}`} />
                  <p className="text-[10px] text-blue-400 ml-2 font-medium">* ราคาเสารวมค่าขนส่ง/ต้น (Fixed)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div onClick={() => setInputs(prev => ({ ...prev, shippingType: 'express' }))} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${inputs.shippingType === 'express' ? 'border-orange-500 bg-orange-50 shadow-md' : 'border-white bg-white/50'}`}>
                  <div className="flex items-center">
                    <input type="radio" checked={inputs.shippingType === 'express'} readOnly className="w-4 h-4 text-orange-600" />
                    <span className="ml-3 font-bold text-slate-700">ขนส่งเอกชน (เหมา)</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 ml-7">ม้วนละ 100.- ทั่วประเทศ</p>
                </div>

                <div onClick={() => setInputs(prev => ({ ...prev, shippingType: 'pk' }))} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${inputs.shippingType === 'pk' ? 'border-orange-500 bg-orange-50 shadow-md' : 'border-white bg-white/50'}`}>
                  <div className="flex items-center">
                    <input type="radio" checked={inputs.shippingType === 'pk'} readOnly className="w-4 h-4 text-orange-600" />
                    <span className="ml-3 font-bold text-slate-700">รถขนส่ง บริษัท (ตามพื้นที่)</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 ml-7">เช็คราคาตามเขต/อำเภอ</p>
                </div>
              </div>

              {inputs.shippingType === 'pk' && (
                <div className="mt-4 pt-4 border-t border-orange-200">
                  <div className="relative">
                    <input type="text" placeholder="พิมพ์ชื่อตำบล หรือ รหัสไปรษณีย์..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-500 shadow-sm" />
                    {filteredShipping.length > 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                        {filteredShipping.map((item, idx) => (
                          <div key={idx} onClick={() => { setSelectedLocation(item); setSearchTerm(`${item.รหัส} ต.${item.ตำบล}`); }} className="p-3 hover:bg-orange-50 cursor-pointer border-b last:border-0 text-sm flex justify-between items-center">
                            <span className="text-slate-700">{item.รหัส} <strong>{item.ตำบล}</strong> ({item.อำเภอ})</span>
                            <span className="text-orange-600 font-bold">฿{item.ค่ารถ}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedLocation && (
                    <p className="mt-2 text-[11px] text-orange-800 font-bold">📍 ส่งไปที่: ต.{selectedLocation.ตำบล} อ.{selectedLocation.อำเภอ} ค่ารถ ฿{selectedLocation.ค่ารถ}</p>
                  )}
                </div>
              )}
            </section>

            <div className="py-8 px-4 bg-white rounded-2xl border border-slate-100 shadow-sm mt-6">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></span>
                  ช่องทางการติดต่อ / สอบถามข้อมูลเพิ่มเติม
                </h3>
                
                <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
                  <div className="flex-1 w-full p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">เบอร์โทรติดต่อเซลส์</p>
                    <p className="text-slate-700 font-bold text-lg">02-006-3442 บริษัท</p>
                    <p className="text-slate-700 font-bold text-lg">086-332-3030 ปุ๊ก</p>
                  </div>

                  <a 
                    href="https://lin.ee/5fIn9h4" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 w-full bg-[#00b900] hover:bg-[#00a300] text-white p-5 rounded-xl flex flex-col items-center justify-center transition-all shadow-md active:scale-95"
                  >
                    <span className="font-black text-xl flex items-center gap-2 text-white">
                      LINE ID
                    </span>
                    <span className="text-sm font-bold opacity-90 text-white">@ab99</span>
                  </a>
                </div>

                <div className="pt-4 border-t border-slate-50">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Facebook</p>
                  <a 
                    href="https://www.facebook.com/sandeedensteel" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 font-medium hover:text-blue-800 hover:underline transition-colors"
                  >
                    https://www.facebook.com/sandeedensteel
                  </a>
                </div>
              </div>
            </div>

          </div>

          <div className="lg:col-span-5">
            <section className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-8 border-4 border-slate-800">
              <h2 className="text-2xl font-black text-blue-400 mb-6 uppercase tracking-tighter">รายการวัสดุ</h2>
              
              <div className="space-y-4 mb-6">
                {inputs.includePosts && (
                  <div className="flex justify-between border-b border-slate-800 pb-3">
                    <span className="text-slate-400">จำนวนเสา:</span>
                    <span className="text-2xl font-bold text-white">{results?.totalPosts || 0} ต้น</span>
                  </div>
                )}

                <div className="flex justify-between border-b border-slate-800 pb-3">
                  <span className="text-slate-400">ลวดหนาม {inputs.wireLabel} ({inputs.rollLength}ม.):</span>
                  <span className="text-2xl font-bold text-orange-400">
                    {results?.totalRolls || 0} ม้วน
                  </span>
                </div>

                {inputs.shippingType && (
                  <div className="flex justify-between border-b border-slate-800 pb-3">
                    <span className="text-slate-400">ค่าขนส่ง {inputs.shippingType === 'pk' ? `(รถบริษัท)` : `(ม้วนละ 100.-)`}:</span>
                    <span className="text-2xl font-bold text-orange-400">฿{(results?.shippingCost || 0).toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between border-b border-slate-800 pb-3">
                  <span className="text-slate-400">กิ๊บตัว U (2.5"):</span>
                  <span className="text-2xl font-bold text-orange-400">{results?.totalUClips || 0} ตัว</span>
                </div>

                <div className="py-4 border-b border-slate-800">
                  <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/50">
                    <p className="text-[10px] text-blue-400 font-bold mb-3 uppercase tracking-widest text-center">
                      ตัวอย่างสินค้าที่ท่านเลือก
                    </p>
                    <div className="flex justify-center items-center">
                      {inputs.rollLength === "50" ? (
                        <div className="text-center">
                          <img src="/images/barbed-wire-12.png" alt="ลวดหนามเบอร์ 12" className="h-28 object-contain mx-auto drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                          <p className="text-xs text-slate-300 mt-2 font-bold">ลวดหนามเบอร์ 12</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <img src="/images/barbed-wire-14.png" alt="ลวดหนามเบอร์ 14" className="h-28 object-contain mx-auto drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
                          <p className="text-xs text-slate-300 mt-2 font-bold">ลวดหนามเบอร์ 14</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 mt-6 shadow-inner text-center">
                   <p className="text-xs text-blue-400 font-bold mb-1 uppercase tracking-widest">งบประมาณรวม</p>
                   <p className="text-5xl font-black text-green-400">฿{(results?.totalBudget || 0).toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-white rounded-2xl shadow-lg border-2 border-dashed border-slate-200">
                <div className="text-center">
                  <p className="text-[11px] text-slate-500 font-bold mb-2 uppercase tracking-tight">สแกนเพื่อชำระเงิน หรือ สอบถามเพิ่มเติม</p>
                  
                  <div className="relative inline-block p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <img 
                      src="/images/payment-qr.png"
                      alt="QR Code สำหรับชำระเงิน" 
                      className="w-40 h-40 mx-auto object-contain"
                    />
                  </div>
                  
                  <div className="mt-2 flex items-center justify-center gap-2">
                     <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                     <p className="text-[12px] font-black text-slate-700">ธนาคารกสิกรไทย (K-Bank)</p>
                  </div>
                  <p className="text-[10px] text-slate-400">บริษัท แสนดีเด่น สตีล จำกัด</p>
                </div>
              </div>

              <FenceVisualizer width={String(inputs.width)} length={String(inputs.length)} />
              <WireComparison totalPerimeter={results?.perimeter || 0} />

              <div className="grid grid-cols-2 gap-4 mt-6">
                <a href="https://sandeeden.co.th/our-products/" target="_blank" className="flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold transition-all text-[11px]">ดูสินค้า</a>
                <a href="https://lin.ee/5fIn9h4" target="_blank" className="flex items-center justify-center bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-bold transition-all text-[11px]">ติดต่อพนักงาน</a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}