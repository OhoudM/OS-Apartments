/* OS Apartments: read-only Excel export extension. */
(() => {
  const exportButton = document.getElementById('export-excel-btn');
  const periodSelect = document.getElementById('export-excel-period');
  const message = document.getElementById('export-excel-message');
  if (!exportButton || !periodSelect) return;

  const labels = () => currentLanguage === 'ar' ? {
    overview:'الملخص', bookings:'الحجوزات', finances:'المالية', expenses:'المصاريف', monthly:'الأداء الشهري',
    metric:'المؤشر', value:'القيمة', period:'الفترة', all:'كل الفترات', count:'عدد الحجوزات',
    guest:'الضيف', platform:'المنصة', checkin:'الوصول', checkout:'المغادرة', status:'الحالة',
    guestTotal:'إجمالي قيمة الحجز', net:'صافي مبلغ الحجز بعد الرسوم', received:'المبلغ المستلم',
    remaining:'المتبقي', code:'رقم التأكيد', date:'التاريخ', category:'الفئة', description:'الوصف',
    amount:'المبلغ', month:'الشهر', revenue:'الإيرادات التشغيلية', cost:'المصاريف التشغيلية',
    profit:'صافي الربح', occupancy:'نسبة الإشغال', nights:'الليالي المحجوزة',
    missing:'غير مسجل', partial:'المدفوعات المتاحة فقط؛ قد لا تشمل مدفوعات المنصات'
  } : {
    overview:'Overview', bookings:'Bookings', finances:'Finances', expenses:'Expenses', monthly:'Monthly Performance',
    metric:'Metric', value:'Value', period:'Period', all:'All Time', count:'Bookings',
    guest:'Guest', platform:'Platform', checkin:'Check-in', checkout:'Check-out', status:'Status',
    guestTotal:'Guest Booking Total', net:'Net Booking Earnings (after fees)', received:'Received',
    remaining:'Remaining', code:'Confirmation Code', date:'Date', category:'Category', description:'Description',
    amount:'Amount', month:'Month', revenue:'Operating Revenue', cost:'Operating Expenses',
    profit:'Net Profit', occupancy:'Occupancy Rate', nights:'Booked Nights',
    missing:'Not recorded', partial:'Only tracked payments; platform payments may not be recorded'
  };

  const round = n => Math.round((Number(n) || 0) * 100) / 100;
  const sum = (items, fn) => round(items.reduce((total, item) => total + (Number(fn(item)) || 0), 0));
  const monthKey = value => String(value || '').slice(0, 7);
  const excelDate = value => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return value || '';
    const [y,m,d] = value.split('-').map(Number);
    return new Date(Date.UTC(y,m-1,d,12));
  };

  const addSheet = (workbook, name, headers, rows, currencyColumns = [], dateColumns = [], percentColumns = []) => {
    const sheet = workbook.addWorksheet(name, { views:[{state:'frozen',ySplit:1}] });
    sheet.addRow(headers);
    rows.forEach(row => sheet.addRow(row));
    sheet.autoFilter = {from:{row:1,column:1},to:{row:Math.max(1,rows.length+1),column:headers.length}};
    sheet.getRow(1).height = 29;
    sheet.getRow(1).eachCell(cell => {
      cell.fill = {type:'pattern',pattern:'solid',fgColor:{argb:'FF4B5130'}};
      cell.font = {name:'Arial',bold:true,color:{argb:'FFFFFFFF'},size:11};
      cell.alignment = {vertical:'middle',wrapText:true};
    });
    sheet.eachRow((row,index) => {
      if(index === 1) return;
      if(index % 2 === 0) row.eachCell(cell => {cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFF7F5EE'}};});
      row.eachCell(cell => {cell.alignment={vertical:'middle',wrapText:true};});
    });
    headers.forEach((header,i) => {
      const column = sheet.getColumn(i+1);
      const maxLength = Math.max(String(header).length, ...rows.slice(0,150).map(row => String(row[i] ?? '').length));
      column.width = Math.min(38,Math.max(16,maxLength+3));
    });
    currencyColumns.forEach(index => {sheet.getColumn(index).numFmt = '#,##0.00 "SAR";[Red](#,##0.00) "SAR"';});
    dateColumns.forEach(index => {sheet.getColumn(index).numFmt = 'yyyy-mm-dd';});
    percentColumns.forEach(index => {sheet.getColumn(index).numFmt = '0"%"';});
    return sheet;
  };

  exportButton.addEventListener('click',async () => {
    const L = labels();
    if (typeof ExcelJS === 'undefined') {
      message.textContent = currentLanguage === 'ar' ? 'تعذر تحميل مكتبة Excel. تحقق من اتصال الإنترنت.' : 'Excel library could not load. Check your internet connection.';
      return;
    }
    if (!bookingsLoaded) {
      message.textContent = currentLanguage === 'ar' ? 'انتظر حتى تكتمل تحميل الحجوزات.' : 'Wait for bookings to finish loading.';
      return;
    }
    exportButton.disabled = true;
    message.textContent = currentLanguage === 'ar' ? 'جاري تجهيز ملف Excel...' : 'Preparing Excel workbook...';
    try {
      const selected = periodSelect.value === 'month' ? document.getElementById('report-month')?.value : '';
      if (periodSelect.value === 'month' && !selected) throw Error('Please select a report month.');
      const allActive = activeBookings();
      const chosenBookings = selected ? bookings.filter(b => monthKey(b.check_in) === selected) : bookings.slice();
      const chosenActive = chosenBookings.filter(activeBooking);
      const chosenExpenses = selected ? expenses.filter(e => monthKey(e.expense_date) === selected) : expenses.slice();
      const revenueMap = monthlyEarningsMap();
      const expenseMap = monthlyExpenseMap();
      const monthSet = new Set([...revenueMap.keys(),...expenseMap.keys()]);
      if (selected) monthSet.add(selected);
      const months = [...monthSet].filter(m=>/^\d{4}-\d{2}$/.test(m)).sort();
      const monthsToExport = selected ? [selected] : months;
      const revenue = sum(monthsToExport,m=>revenueMap.get(m));
      const costs = sum(monthsToExport,m=>expenseMap.get(m));
      const tracked = chosenActive.filter(b => outstandingBalance(b) !== null);
      const received = sum(tracked,b=>amountReceived(b));
      const remaining = sum(tracked,b=>outstandingBalance(b));
      const guestTotals = sum(chosenActive,b=>overviewGuestTotal(b));
      const netTotals = sum(chosenActive,b=>safeNumber(b.amount));
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'OS Apartments';
      workbook.title = 'OS Apartments Report';
      workbook.created = new Date();
      addSheet(workbook,L.overview,[L.metric,L.value],[
        [L.period,selected || L.all],[L.count,chosenActive.length],
        [L.guestTotal,guestTotals],[L.net,netTotals],[L.revenue,revenue],
        [L.cost,costs],[L.profit,round(revenue-costs)],
        [L.received,received],[L.remaining,remaining],
        [L.partial,'']
      ],[2]);
      addSheet(workbook,L.bookings,[L.guest,L.platform,L.checkin,L.checkout,L.status,L.guestTotal,L.net,L.received,L.remaining,L.code],
        chosenBookings.map(b=>[b.guest_name||'',b.platform||'',excelDate(b.check_in),excelDate(b.check_out),b.status||'',
          overviewGuestTotal(b) ?? '',safeNumber(b.amount) ?? '',amountReceived(b) ?? '',outstandingBalance(b) ?? '',b.confirmation_code||'']),
        [6,7,8,9],[3,4]);
      addSheet(workbook,L.finances,[L.guest,L.platform,L.checkin,L.net,L.received,L.remaining],
        chosenActive.map(b=>[b.guest_name||'',b.platform||'',excelDate(b.check_in),safeNumber(b.amount) ?? '',
          amountReceived(b) ?? '',outstandingBalance(b) ?? '']),[4,5,6],[3]);
      addSheet(workbook,L.expenses,[L.date,L.category,L.description,L.amount],
        chosenExpenses.map(e=>[excelDate(e.expense_date),e.category||'',e.description||'',safeNumber(e.amount) ?? '']),[4],[1]);
      addSheet(workbook,L.monthly,[L.month,L.revenue,L.cost,L.profit,L.occupancy,L.count,L.nights],
        monthsToExport.map(m=>{
          const earned = round(revenueMap.get(m)||0);
          const spent = round(expenseMap.get(m)||0);
          const detail = monthlyBookingDetails(m);
          return [m,earned,spent,round(earned-spent),monthlyOccupancy(m) ?? '',detail.count,detail.nights];
        }),[2,3,4],[],[5]);
      const bytes = await workbook.xlsx.writeBuffer();
      const blob = new Blob([bytes],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href=url;
      anchor.download=`OS_Apartments_Report_${selected||'All_Time'}.xlsx`;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(()=>URL.revokeObjectURL(url),30000);
      message.textContent = currentLanguage === 'ar' ? 'تم إنشاء ملف Excel.' : 'Excel report downloaded.';
    } catch(error) {
      console.error('Excel export failed:',error);
      message.textContent = (currentLanguage === 'ar' ? 'تعذر تصدير التقرير: ' : 'Could not export report: ') + error.message;
    } finally {exportButton.disabled=false;}
  });
})();
