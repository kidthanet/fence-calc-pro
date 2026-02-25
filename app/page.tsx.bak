"use client";

import { useState, useEffect } from 'react';
import { areaToSqMeters, getPerimeterFromArea, calculateFenceProject } from '@/lib/calculations';
import FenceVisualizer from '@/components/FenceVisualizer';
import WireComparison from '@/components/WireComparison';
import { generateQuotation } from '@/lib/exportPdf';

export default function FenceCalculatorPage() {
  const [calcMode, setCalcMode] = useState('dimension');
  const [inputs, setInputs] = useState({
    width: 20, length: 20, rai: 0, ngan: 0, wa: 0,
    layers: 4, postSpacing: 2.5, rollLength: 50,
    pricePerRoll: 450, pricePerPost: 150
  });

  const [leadInfo, setLeadInfo] = useState({ name: '', phone: '' });
  const [results, setResults] = useState(null);

  // คำนวณผลลัพธ์แบบ Real-time
  useEffect(() => {
    let currentPerimeter = 0;
    if (calcMode === 'dimension') {
      currentPerimeter = (Number(inputs.width) + Number(inputs.length)) * 2;
    } else {
      const sqMeters = areaToSqMeters(inputs.rai, inputs.ngan, inputs.wa);
      currentPerimeter = getPerimeterFromArea(sqMeters);
    }
    const report = calculateFenceProject({
      perimeter: currentPerimeter,
      layers: inputs.layers,
      postSpacing: inputs.postSpacing,
      rollLength: inputs.rollLength,
      pricePerRoll: inputs.pricePerRoll,
      pricePerPost: inputs.pricePerPost
    });
    setResults(report);
  }, [inputs, calcMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  // ฟังก์ชันดาวน์โหลด PDF (ตัดส่วน Fetch ไปยัง LINE Notify ออก)
  const handleDownloadPDF = () => {
    // ยังคงเก็บเบอร์โทรไว้เพื่อให้ชื่อและเบอร์ไปปรากฏในใบ PDF
    if (!leadInfo.phone || leadInfo.phone.length < 9) {
      alert("กรุณากรอกเบอร์โทรศัพท์เพื่อใช้ในการออกใบเสนอราคา");
      return;
    }

    // เจน PDF ทันที
    generateQuotation({ ...results, customer: leadInfo });
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black text-blue-900 mb-3 tracking-tight">Fence Pro Calculator</h1>
          <p className="text-slate-600 text-lg italic text-blue-600">PK Group - วัสดุล้อมรั้วมาตรฐานสากล</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ส่วนกรอกข้อมูล */}
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
                    <input type="number" name="width" value={inputs.width} onChange={handleChange} className="w-full border rounded-xl p-3.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                    <p className="text-[10px] text-slate-400 ml-2">* ความกว้างที่ดิน (เมตร)</p>
                  </div>
                  <div className="space-y-1">
                    <input type="number" name="length" value={inputs.length} onChange={handleChange} className="w-full border rounded-xl p-3.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                    <p className="text-[10px] text-slate-400 ml-2">* ความยาวที่ดิน (เมตร)</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <input type="number" name="rai" value={inputs.rai} onChange={handleChange} className="w-full border rounded-xl p-3.5 text-center" />
                    <p className="text-[10px] text-slate-400 text-center">ไร่</p>
                  </div>
                  <div className="space-y-1">
                    <input type="number" name="ngan" value={inputs.ngan} onChange={handleChange} className="w-full border rounded-xl p-3.5 text-center" />
                    <p className="text-[10px] text-slate-400 text-center">งาน</p>
                  </div>
                  <div className="space-y-1">
                    <input type="number" name="wa" value={inputs.wa} onChange={handleChange} className="w-full border rounded-xl p-3.5 text-center" />
                    <p className="text-[10px] text-slate-400 text-center">ตารางวา</p>
                  </div>
                </div>
              )}
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold mb-5 flex items-center">
                <span className="bg-blue-600 text-white w-7 h-7 rounded-lg flex items-center justify-center mr-3 text-sm">2</span>
                ตั้งค่ารั้วและเสา
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <select name="layers" value={inputs.layers} onChange={handleChange} className="w-full border rounded-xl p-3.5">
                    {[3,4,5,6,7,8].map(l => <option key={l} value={l}>{l} ชั้น</option>)}
                  </select>
                  <p className="text-[10px] text-slate-400 ml-2">* จำนวนเส้นลวดแนวนอน</p>
                </div>
                <div className="space-y-1">
                  <input type="number" step="0.1" name="postSpacing" value={inputs.postSpacing} onChange={handleChange} className="w-full border rounded-xl p-3.5" />
                  <p className="text-[10px] text-slate-400 ml-2">* ระยะห่างเสา (มาตรฐาน 2.5ม.)</p>
                </div>
                <div className="space-y-1">
                  <select name="rollLength" value={inputs.rollLength} onChange={handleChange} className="w-full border rounded-xl p-3.5">
                    <option value="50">50 เมตร</option>
                    <option value="100">100 เมตร</option>
                  </select>
                  <p className="text-[10px] text-slate-400 ml-2">* ความยาวลวดต่อม้วน</p>
                </div>
              </div>
            </section>

            <section className="bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-inner">
              <h2 className="text-xl font-bold text-blue-900 mb-5 flex items-center">
                <span className="bg-blue-600 text-white w-7 h-7 rounded-lg flex items-center justify-center mr-3 text-sm">3</span>
                ตั้งค่าราคาวัสดุ (บาท)
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <input type="number" name="pricePerRoll" value={inputs.pricePerRoll} onChange={handleChange} className="w-full border-blue-200 rounded-xl p-3.5 text-blue-900 font-bold" />
                  <p className="text-[10px] text-blue-400 ml-2">* ราคาลวดหนาม/ม้วน</p>
                </div>
                <div className="space-y-1">
                  <input type="number" name="pricePerPost" value={inputs.pricePerPost} onChange={handleChange} className="w-full border-blue-200 rounded-xl p-3.5 text-blue-900 font-bold" />
                  <p className="text-[10px] text-blue-400 ml-2">* ราคาเสารั้ว/ต้น</p>
                </div>
              </div>
            </section>
          </div>

          {/* ส่วนแสดงผลและปุ่มกด */}
          <div className="lg:col-span-5">
            <section className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-8 border-4 border-slate-800">
              <h2 className="text-2xl font-black text-blue-400 mb-6 uppercase tracking-tighter">สรุปรายการวัสดุ</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">ความยาวรั้วรวม:</span>
                  <span className="text-xl font-bold">{results?.perimeter.toLocaleString()} ม.</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">จำนวนเสา:</span>
                  <span className="text-xl font-bold text-orange-400">{results?.totalPosts} ต้น</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">ลวดหนามที่ใช้:</span>
                  <span className="text-xl font-bold text-orange-400">{results?.totalRolls} ม้วน</span>
                </div>
                <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 mt-4">
                   <p className="text-xs text-blue-400 font-bold mb-1 uppercase tracking-widest">งบประมาณรวมโดยประมาณ</p>
                   <p className="text-4xl font-black text-green-400">฿{results?.totalBudget.toLocaleString()}</p>
                </div>
              </div>

              {/* ส่วนกรอกชื่อเพื่อลงใน PDF */}
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-4 mb-6">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <input 
                      type="text" placeholder="ชื่อลูกค้า" value={leadInfo.name}
                      onChange={(e) => setLeadInfo({...leadInfo, name: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                    <p className="text-[9px] text-slate-500 ml-2">แสดงชื่อในใบเสนอราคา</p>
                  </div>
                  <div className="space-y-1">
                    <input 
                      type="tel" placeholder="เบอร์โทรศัพท์ *" value={leadInfo.phone}
                      onChange={(e) => setLeadInfo({...leadInfo, phone: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                    <p className="text-[9px] text-blue-400 ml-2">จำเป็นสำหรับพิมพ์เอกสาร</p>
                  </div>
                </div>

                <button 
                  onClick={handleDownloadPDF}
                  className="flex items-center justify-center gap-3 w-full bg-white hover:bg-slate-100 text-slate-900 py-4 rounded-xl font-bold transition-all active:scale-95 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  ดาวน์โหลด PDF
                </button>
              </div>

              <FenceVisualizer width={Number(inputs.width)} length={Number(inputs.length)} />
              <WireComparison totalRolls={results?.totalRolls} />

              <a href="https://www.pkgroupth.com/" target="_blank" className="block text-center w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition-all">
                เยี่ยมชมเว็บไซต์ PK Group
              </a>
            </section>
          </div>

        </div>
      </div>
    </main>
  );
}