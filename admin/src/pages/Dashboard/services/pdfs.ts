// Este archivo se dedicará exclusivamente a las operaciones relacionadas con el PDF.

class PdfService {
  downloadHistory = async (chatbotId: string) => {
    // Muestra un loader si tienes uno global disponible
    // toggleLoader(true); 

    try {
      // 1. Construye la URL del endpoint de FastAPI
      const apiUrl = `https://ubi.ceipa.edu.co/macito/download_pdf/${chatbotId}`;
      
      const response = await fetch(apiUrl);

      // 2. Si la respuesta no es OK (ej. 404 Not Found), lanza un error
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Error desconocido del servidor.' }));
        throw new Error(errorData.detail || `Error ${response.status}: No se pudo descargar el archivo.`);
      }

      // 3. Convierte la respuesta en un "blob" (un objeto de archivo)
      const pdfBlob = await response.blob();

      // 4. Crea una URL temporal en el navegador para el blob
      const url = window.URL.createObjectURL(pdfBlob);

      // 5. Crea un enlace <a> invisible para iniciar la descarga
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${chatbotId}.pdf`); // Nombre del archivo a descargar
      
      // 6. Añade el enlace al DOM, haz clic en él y luego remuévelo
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 7. Limpia la URL temporal
      window.URL.revokeObjectURL(url);

      // Opcional: Muestra una notificación de éxito
      // Toast({ type: 'success', message: 'PDF descargado con éxito!' });

    } catch (err: any) {
      console.error("Error al descargar el PDF:", err);
      // Opcional: Muestra una notificación de error
      // Toast({ type: 'error', message: err.message });
    } finally {
      // Oculta el loader si lo usaste
      // toggleLoader(false);
    }
  };
}

export default new PdfService();