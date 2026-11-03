/* OS Apartments: read-only CSV report export. Uses the dashboard's loaded data. */
(() => {
  const $ = id => document.getElementById(id);
  const button = $('export-excel-btn');
  const period = $('export-excel-period');
  const message = $('export-excel-message');
  if (!button || !period) return;
  const isAr = () => typeof currentLanguage !== 'undefined' && currentLanguage === 'ar';
  const names = {
    bookings:['Bookings','الحجوزات'], finances:['Finances','المالية'], expenses:['Expenses','المصروفات'],
    monthly:['Monthly Performance','الأداء الشهري'], overview:['Overview','الملخص']
  };
  const monthName = (value) => {
    const [year, m] = value.split('-').map(Number);
    return new Intl.DateTimeFormat(isAr() ? 'ar-SA-u-ca-gregory' : 'en-US', {month:'long',year:'numeric'}).format(new Date(year,m-1,1));
  };
  function refreshMonths() {
    const previous = period.value;
    const available = new Set();
    // Reuse the months displayed by Monthly Performance and include months with expenses.
    const reportSelect = $('report-month');
    if (reportSelect) for (const opt of reportSelect.options) if (/^\d{4}-\d{2}$/.test(opt.value)) available.add(opt.value);
    if (typeof bookings !== 'undefined' && Array.isArray(bookings)) for (const b of bookings) {
      const m = String(b.check_in || '').slice(0,7);
      if (/^\d{4}-\d{2}$/.test(m)) available.add(m);
    }
    if (typeof expenses !== 'undefined' && Array.isArray(expenses)) for (const e of expenses) {
      const m = String(e.expense_date || '').slice(0,7);
      if (/^\d{4}-\d{2}$/.test(m)) available.add(m);
    }
    const months = [...available].sort().reverse();
    const signature = (isAr()?'ar':'en')+'|'+months.join('|');
    if (period.dataset.monthSignature === signature) return;
    period.dataset.monthSignature = signature;
    period.replaceChildren();
    period.add(new Option(isAr()?'كل الفترات':'All time','all'));
    for (const m of months) period.add(new Option(monthName(m),m));
    period.value = [...period.options].some(o=>o.value===previous) ? previous : 'all';
  }
  function translate() {
    const ar=isAr();
    $('csv-export-title').textContent=ar?'تصدير التقارير':'Export reports';
    $('csv-export-subtitle').textContent=ar?'حمّل جميع التقارير في ملف CSV واحد.':'Download all reports in one CSV file.';
    $('export-excel-period-label').textContent=ar?'الفترة':'Period';
    $('csv-download-label').textContent=ar?'تحميل CSV':'Download CSV';
    period.options[0].textContent=ar?'كل الفترات':'All time';
    refreshMonths();
  }
  translate();
  period.addEventListener('focus',refreshMonths);
  period.addEventListener('pointerdown',refreshMonths);
  $('report-month')?.addEventListener('change',refreshMonths);
  if ($('report-month')) new MutationObserver(refreshMonths).observe($('report-month'),{childList:true});
  // Language toggle updates this toolbar even when other dashboard sections rerender.
  const observer=new MutationObserver(()=>translate());
  observer.observe(document.documentElement,{attributes:true,attributeFilter:['lang','dir']});
  document.addEventListener('click',e=>{if(e.target.closest('[data-lang], [data-language], #lang-toggle, #language-toggle')) queueMicrotask(translate);});
  const num = n => Math.round((Number(n)||0)*100)/100;
  const sum = (rows,fn) => num(rows.reduce((s,r)=>s+(Number(fn(r))||0),0));
  const month = v => String(v||'').slice(0,7);
  const quote = v => {
    let s=String(v??'');
    // Protect against spreadsheet formula injection when opening CSV in Excel.
    if (/^[\s\u0000-\u001f]*[=+@\-]/.test(s) && !/^-?\d+(\.\d+)?$/.test(s.trim())) s="'"+s;
    return '"'+s.replace(/"/g,'""')+'"';
  };
  function downloadCSV(filename,headers,rows) {
    const csv='\uFEFF'+[headers,...rows].map(row=>row.map(quote).join(',')).join('\r\n');
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));
    const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),30000);
  }
  button.addEventListener('click',()=>{
    if (typeof bookingsLoaded==='undefined'||!bookingsLoaded) {
      message.textContent=isAr()?'انتظر حتى تكتمل تحميل الحجوزات.':'Wait for bookings to finish loading.';return;
    }
    button.disabled=true;
    try {
      refreshMonths();
      const selected=period.value==='all'?'':period.value;
      if(selected&&!/^\d{4}-\d{2}$/.test(selected)) throw Error(isAr()?'اختر شهراً صحيحاً.':'Select a valid month.');
      const allBookings=selected?bookings.filter(b=>month(b.check_in)===selected):bookings.slice();
      const active=allBookings.filter(activeBooking);
      const costs=selected?expenses.filter(e=>month(e.expense_date)===selected):expenses.slice();
      const revenueMap=monthlyEarningsMap(), expenseMap=monthlyExpenseMap();
      const months=[...new Set([...revenueMap.keys(),...expenseMap.keys(),...(selected?[selected]:[])])].filter(m=>/^\d{4}-\d{2}$/.test(m)).sort();
      const periodMonths=selected?[selected]:months;
      const ar=isAr();
      const headers={
        bookings:ar?['الضيف','المنصة','الوصول','المغادرة','الحالة','السعر الأصلي','الخصم','إجمالي الحجز','مستحقات المضيف','المدفوع من الضيف','المتبقي','حالة دفع الضيف','حالة التحويل','المبلغ المحول','تاريخ التحويل','رقم التأكيد']:['Guest','Platform','Check-in','Check-out','Status','Original Price','Discount','Guest Booking Total','Host Earnings','Guest Payment Tracked','Remaining','Guest Payment Status','Host Payout Status','Host Payout Received','Payout Date','Confirmation Code'],
        finances:ar?['الضيف','المنصة','الوصول','السعر الأصلي','الخصم','إجمالي الحجز','مستحقات المضيف','المدفوع من الضيف','المتبقي','حالة دفع الضيف','حالة التحويل','المبلغ المحول','تاريخ التحويل']:['Guest','Platform','Check-in','Original Price','Discount','Guest Booking Total','Host Earnings','Guest Payment Tracked','Remaining','Guest Payment Status','Host Payout Status','Host Payout Received','Payout Date'],
        expenses:ar?['التاريخ','الفئة','الوصف','المبلغ']:['Date','Category','Description','Amount'],
        monthly:ar?['الشهر','الإيرادات','المصروفات','الأرباح بعد المصروفات','نسبة الإشغال','عدد الحجوزات','الليالي']:['Month','Revenue','Expenses','Earnings After Expenses','Occupancy Rate','Bookings','Booked Nights'],
        overview:ar?['المؤشر','القيمة']:['Metric','Value']
      };
      const state=b=>osStateLabel(osGuestPaymentState(b));
      const payout=b=>osStateLabel(osPayoutState(b));
      const bookingRow=b=>[b.guest_name||'',b.platform||'',b.check_in||'',b.check_out||'',b.status||'',safeNumber(b.original_price)??'',safeNumber(b.discount_amount)??'',overviewGuestTotal(b)??'',safeNumber(b.amount)??'',amountReceived(b)??'',outstandingBalance(b)??'',state(b),payout(b),safeNumber(b.host_payout_received)??'',b.host_payout_date||'',b.confirmation_code||''];
      // A CSV has one sheet, so group all five reports into clearly labeled sections.
      // Every row is padded to the same number of columns for consistent CSV parsing.
      const sections=[];
      const addSection=(key,rows)=>sections.push({key,rows});
      addSection('overview', (()=>{
        const revenue=sum(periodMonths,m=>revenueMap.get(m));const expense=sum(periodMonths,m=>expenseMap.get(m));
        const tracked=active.filter(b=>outstandingBalance(b)!==null);
        return ar?[
          ['الفترة',selected||'كل الفترات'],['عدد الحجوزات',active.length],['إجمالي قيمة الحجوزات',sum(active,overviewGuestTotal)],['مستحقات المضيف',sum(active,b=>safeNumber(b.amount))],['الإيرادات',revenue],['المصروفات',expense],['الأرباح بعد المصروفات',num(revenue-expense)],['المدفوعات المسجلة',sum(tracked,amountReceived)],['المتبقي',sum(tracked,outstandingBalance)]
        ]:[
          ['Period',selected||'All Time'],['Bookings',active.length],['Guest Booking Total',sum(active,overviewGuestTotal)],['Host Earnings',sum(active,b=>safeNumber(b.amount))],['Revenue',revenue],['Expenses',expense],['Earnings After Expenses',num(revenue-expense)],['Tracked Guest Payments',sum(tracked,amountReceived)],['Remaining',sum(tracked,outstandingBalance)]
        ];
      })());
      addSection('bookings',allBookings.map(bookingRow));
      addSection('finances',active.map(b=>{const r=bookingRow(b);return [r[0],r[1],r[2],...r.slice(5,15)];}));
      addSection('expenses',costs.map(e=>[e.expense_date||'',typeof osExpenseLabel==='function'?osExpenseLabel(e.category):e.category||'',e.description||'',safeNumber(e.amount)??'']));
      addSection('monthly',periodMonths.map(m=>{const revenue=num(revenueMap.get(m));const expense=num(expenseMap.get(m));const detail=monthlyBookingDetails(m);return [m,revenue,expense,num(revenue-expense),monthlyOccupancy(m)??'',detail.count,detail.nights];}));
      const width=Math.max(...Object.values(headers).map(h=>h.length))+1;
      const pad=r=>[...r,...Array(Math.max(0,width-r.length)).fill('')];
      const output=[];
      for (const section of sections){
        output.push(pad([ar?'القسم':'Section',names[section.key][ar?1:0]]));
        output.push(pad(headers[section.key]));
        section.rows.forEach(r=>output.push(pad(r)));
        output.push(pad([]));
      }
      // A single CSV download includes every section; no report selection required.
      downloadCSV(`OS_Apartments_All_Reports_${selected||'All_Time'}.csv`,output.shift(),output);
      message.textContent=ar?'تم تحميل ملف CSV بنجاح.':'CSV downloaded successfully.';
    }catch(err){console.error('CSV export failed:',err);message.textContent=(isAr()?'تعذر تصدير التقرير: ':'Could not export report: ')+err.message;}
    finally{button.disabled=false;}
  });
})();
