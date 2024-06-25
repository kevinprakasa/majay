import QRCode from 'qrcode';

export const generateQRCodeCanvas = async (
  code: string,
  name: string,
  canvas: HTMLCanvasElement,
  onError?: () => void,
  onSuccess?: () => {}
) => {
  QRCode.toCanvas(
    canvas,
    code,
    {
      errorCorrectionLevel: 'H',
      margin: 4,
      width: 300,
    },
    // @ts-ignore
    (error, canvas) => {
      if (error) {
        if (onError) onError();
        return;
      }

      const ctx = canvas.getContext('2d');

      // Set text properties
      const text = name || 'No name provided';
      const fontSize = 16;
      ctx.font = `${fontSize}px arial`;
      ctx.textAlign = 'center';
      ctx.fillStyle = 'black';

      // Calculate text position
      const textX = canvas.width / 2;
      const textY = canvas.height - fontSize + 5;

      // Draw text
      ctx.fillText(text, textX, textY);
      if (onSuccess) onSuccess();
    }
  );
};

export const priceFormat = (number: number | string): string => {
  // Convert number to string and add thousand separators
  const formattedNumber = Number(number).toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });
  // Remove currency symbol and replace with 'Rp.'
  return formattedNumber.replace('IDR', 'Rp.').replace(',00', '');
};

export const numberFormat = (number: number | string): string => {
  // Convert number to string and add thousand separators
  return Number(number).toLocaleString('id-ID');
};
