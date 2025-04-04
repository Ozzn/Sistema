import React from 'react';
import { FileDown, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ExportButtons = ({ data, fileName = 'export' }) => {
  // Función para exportar a Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  // Función para exportar a PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = Object.keys(data[0]);
    const tableRows = data.map(row => tableColumn.map(col => row[col]));

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
    });

    doc.save(`${fileName}.pdf`);
  };

  return (
    <div className="flex gap-2 mt-4">
      <Button onClick={exportToExcel} variant="outline">
        <FileDown className="mr-2 h-4 w-4" />
        Exportar Excel
      </Button>
      <Button onClick={exportToPDF} variant="outline">
        <FileText className="mr-2 h-4 w-4" />
        Exportar PDF
      </Button>
    </div>
  );
};

export default ExportButtons;
