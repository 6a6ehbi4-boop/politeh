import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { HeatExchangerInputs, HeatExchangerResults } from '../types';
import type { SelectionItem } from '../calc/selectHeatExchanger';

export function generateSelectionPdf(
  inputs: HeatExchangerInputs,
  results: HeatExchangerResults,
  selections: SelectionItem[]
): void {
  const doc = new jsPDF({ unit: 'mm' });
  const pageW = doc.internal.pageSize.getWidth();

  doc.setFontSize(16);
  doc.text('Лист подбора пластинчатого теплообменника', pageW / 2, 15, { align: 'center' });
  doc.setFontSize(10);
  doc.text('Ридан, паяные ПТО серии XB. Вода / этиленгликоль 20%. K=2500 Вт/(м²·К)', pageW / 2, 22, {
    align: 'center',
  });

  // Исходные данные
  doc.setFontSize(12);
  doc.text('Исходные данные', 14, 35);
  doc.setFontSize(10);
  doc.text(`Tг1 = ${inputs.Tg1} °C, Tг2 = ${results.Tg2} °C`, 14, 42);
  doc.text(`Tх1 = ${inputs.Tx1} °C, Tх2 = ${results.Tx2} °C`, 14, 48);
  doc.text(`Gг = ${inputs.Gg} м³/ч, Gх = ${inputs.Gx} м³/ч`, 14, 54);
  doc.text(`Q = ${results.Q.toFixed(2)} кВт`, 14, 60);

  // Подобранные модели
  doc.setFontSize(12);
  doc.text('Подобранные теплообменники', 14, 72);

  autoTable(doc, {
    startY: 76,
    head: [['Артикул', 'Серия', 'Пластин', 'Площадь, м²', 'Масса, кг', 'Присоед.', 'Запас %']],
    body: selections.map((s) => [
      s.model.code,
      s.model.series,
      String(s.model.plates),
      s.model.area.toFixed(2),
      s.model.mass.toFixed(1),
      s.model.connection,
      s.reservePct.toFixed(1),
    ]),
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
  });

  doc.setFontSize(9);
  const finalY = (doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? 76;
  doc.text(
    'Рекомендуется уточнить подбор в программе HEX Design на ridan.ru',
    14,
    finalY + 12
  );
  doc.text('Каталог RC.HE.31.01', 14, finalY + 18);

  doc.save(`подбор-ПТО-Q${results.Q.toFixed(0)}.pdf`);
}
