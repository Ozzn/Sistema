import React from 'react';
import { FileDown, FileText } from 'lucide-react';
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Button } from '@/components/ui/button'; // Asegúrate de importar tu componente Button

import PropTypes from 'prop-types';

// Define PropTypes for the component
ExportButtons.propTypes = {
  data: PropTypes.array.isRequired,
  fileName: PropTypes.string,
};

const ExportButtons = ({ data, fileName = 'export' }) => {
  // Función para exportar a Excel con exceljs
  const exportToExcel = async () => {
    if (!data || data.length === 0) {
      console.warn('No hay datos para exportar');
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Datos');

      // Encabezados (usamos las claves del primer objeto como columnas)
      const headers = Object.keys(data[0]);
      worksheet.columns = headers.map(header => ({
        header: header.toUpperCase(),
        key: header,
        width: 20
      }));

      // Agregar datos
      data.forEach(item => {
        worksheet.addRow(item);
      });

      // Generar archivo
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
    }
  };

  // Función para exportar a PDF (se mantiene igual)
  const exportToPDF = () => {
    if (!data || data.length === 0) {
      console.warn('No hay datos para exportar');
      return;
    }

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