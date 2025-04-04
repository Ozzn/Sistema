"use client";
import { FC } from "react";
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface ExportButtonsProps {
  data: any[];
  fileName: string;
  headers: string[]; // Encabezados de la tabla
  columnKeys: string[]; // Claves de las columnas en el objeto de datos
}

const ExportButtons: FC<ExportButtonsProps> = ({ data, fileName, headers, columnKeys }) => {
  const exportToExcel = () => {
    if (data.length === 0) return alert("No hay datos para exportar.");
    
    // Convertir datos en formato adecuado para Excel
    const worksheet = utils.json_to_sheet(data.map((item) => {
      // Mapeamos las claves de las columnas a los datos del objeto
      const row: any = {};
      columnKeys.forEach((key, index) => {
        row[headers[index]] = key.split('.').reduce((o: any, i: string) => o?.[i], item);
      });
      return row;
    }));
    
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Datos");
    writeFile(workbook, `${fileName}.xlsx`);
  };

  const exportToPDF = () => {
    if (data.length === 0) return alert("No hay datos para exportar.");

    const doc = new jsPDF();
    doc.text("Lista de Datos", 14, 10);

    const tableData = data.map((item) => 
      columnKeys.map((key) => key.split('.').reduce((o: any, i: string) => o?.[i], item))
    );

    (doc as any).autoTable({
      head: [headers],
      body: tableData,
      startY: 20,
    });

    doc.save(`${fileName}.pdf`);
  };

  return (
    <div className="flex space-x-4 mb-4">
      <button
        onClick={exportToExcel}
        className="bg-green-500 text-white px-4 py-2 rounded-md"
      >
        Exportar a Excel
      </button>
      <button
        onClick={exportToPDF}
        className="bg-red-500 text-white px-4 py-2 rounded-md"
      >
        Exportar a PDF
      </button>
    </div>
  );
};

export default ExportButtons;
