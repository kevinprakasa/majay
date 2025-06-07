import { priceFormat } from '@/app/helper';

export interface ReceiptItem {
  name: string;
  code: string;
  quantity: number;
  priceUnit: number;
  priceTotal: number;
}

export interface ReceiptData {
  items: ReceiptItem[];
  totalAmount: number;
  date: Date;
  receiptNumber?: string;
}

export class PrinterService {
  async printReceipt(receiptData: ReceiptData): Promise<boolean> {
    try {
      return await this.printBrowserReceipt(receiptData);
    } catch (error) {
      console.error('Print error:', error);
      throw new Error(`Failed to print receipt: ${error}`);
    }
  }

  private async printBrowserReceipt(
    receiptData: ReceiptData
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const printWindow = window.open('', '_blank', 'width=800,height=800');
      if (!printWindow) {
        resolve(false);
        return;
      }

      const receiptHtml = this.generateReceiptHtml(receiptData);
      printWindow.document.write(receiptHtml);
      printWindow.document.close();

      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.onafterprint = () => {
            printWindow.close();
            resolve(true);
          };
          // Timeout fallback
          setTimeout(() => {
            printWindow.close();
            resolve(true);
          }, 3000);
        }, 500);
      };
    });
  }

  private generateReceiptHtml(receiptData: ReceiptData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt</title>
        <style>
          @media print {
            @page {
              size: 80mm 297mm;
              margin: 0;
            }
            body { margin: 0; }
          }
          body {
            font-family: 'Courier New', monospace;
            font-size: 11px;
            line-height: 1.3;
            margin: 0;
            padding: 8px;
            width: 80mm;
            background: white;
          }
          .header {
            text-align: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
          }
          .store-name {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 3px;
          }
          .store-info {
            font-size: 10px;
            line-height: 1.2;
          }
          .receipt-header {
            display: flex;
            justify-content: space-between;
            margin: 15px 0 10px 0;
            font-size: 10px;
          }
          .receipt-date {
            text-align: right;
          }
          .customer-info {
            margin-bottom: 10px;
            font-size: 10px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            font-size: 10px;
          }
          .items-table th {
            border: 1px solid #000;
            padding: 3px;
            text-align: center;
            font-weight: bold;
            background: #f0f0f0;
          }
          .items-table td {
            border: 1px solid #000;
            padding: 3px;
            text-align: left;
          }
          .items-table .qty-col {
            text-align: center;
            width: 15%;
          }
          .items-table .price-col {
            text-align: right;
            width: 25%;
          }
          .items-table .name-col {
            width: 60%;
          }
          .empty-row {
            height: 20px;
          }
          .total-section {
            margin-top: 15px;
            text-align: right;
            font-size: 11px;
            font-weight: bold;
          }
          .signature-section {
            margin-top: 20px;
            font-size: 10px;
          }
          .signature-box {
            border: 1px solid #000;
            padding: 8px;
            margin: 10px 0;
            text-align: center;
            font-weight: bold;
          }
          .footer-note {
            margin-top: 15px;
            font-size: 9px;
            text-align: center;
            line-height: 1.2;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="store-name">TOKO MAJU JAYA</div>
          <div class="store-info">
            Jl. Darmo Sugondo No. 15-29<br>
            Telp. (0536) 3221753 Fax. (0536) 3222475<br>
            PALANGKA RAYA 73111 - KALIMANTAN TENGAH
          </div>
        </div>

        <div class="receipt-header">
          <div>NOTA NO. : ${receiptData.receiptNumber}</div>
          <div class="receipt-date">
            Tgl. : ${receiptData.date.toLocaleDateString('id-ID', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })} ${receiptData.date.toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>


        <div class="customer-info">
          Tuan: ............................................
        </div>
        <div class="customer-info">
          Toko: ............................................
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th class="qty-col">Banyaknya</th>
              <th class="name-col">Nama Barang</th>
              <th class="price-col">Harga</th>
              <th class="price-col">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            ${receiptData.items
              .map(
                (item) => `
              <tr>
                <td class="qty-col">${item.quantity}</td>
                <td class="name-col">${item.name}</td>
                <td class="price-col">${priceFormat(item.priceUnit)}</td>
                <td class="price-col">${priceFormat(item.priceTotal)}</td>
              </tr>
            `
              )
              .join('')}
            ${Array(Math.max(0, 6 - receiptData.items.length))
              .fill(0)
              .map(
                () => `
              <tr class="empty-row">
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="total-section">
          JUMLAH Rp. ${priceFormat(receiptData.totalAmount)}
        </div>

        <div class="signature-section">
          <div class="signature-box">
            Tanda Terima,
            <div style="margin-top: 50px;">
              <div style="border: 1px solid #000; display: inline-block; padding: 5px; font-weight: bold;">
                PERHATIAN:<br>
                Barang-barang yang sudah dibeli tidak dapat<br>
                dikembalikan / ditukar kecuali ada perjanjian
              </div>
            </div>
          </div>
        </div>

        <div class="footer-note">
          <div>JUAL:</div>
          <div>- Mesin Diesel, Spare Parts DF/Chang Chai/Chain Saw, Baut-baut, Terpal</div>
          <div>- Paku U-S, Kayu Kuda-kuda, Tali Nylon/Rafia, Milliard, Karung Goni, Racun Kayu</div>
          <div>- Aneka Pompa Air, Alat Tehnik & Bahan Bangunan</div>
          <div style="font-weight: bold; margin-top: 20px; font-size: 12px;">
              TERIMAKASIH ATAS KUNJUNGAN ANDA
          </div>
        </div>
      </body>

      </html>
    `;
  }
}

export const printerService = new PrinterService();
