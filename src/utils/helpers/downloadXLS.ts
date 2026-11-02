const wrapXLS = (inner: string): string => `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" 
          xmlns:x="urn:schemas-microsoft-com:office:excel" 
          xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8"></head>
      <body>${inner}</body>
    </html>`;

export const downloadXLS = (html: string, name: string): void => {
  const blob = new Blob([wrapXLS(html)], { type: 'application/vnd.ms-excel' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
};
