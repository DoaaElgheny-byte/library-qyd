import { Injectable } from '@angular/core';
import { toDataURL } from 'qrcode';


@Injectable({
  providedIn: 'root'
})
export class ZatcaQrService {

  constructor() { }

  async generateQrCode(data: any): Promise<string> {
    console.log(data);

    const formattedData = `
      اسم البائع: ${data.sellerName}
      رقم التسجيل التجاري : ${311846150900003}
      تاريخ الفاتورة: ${data.invoiceDate}
      اجمالي الفاتورة: ${data.total}
      ضريبة القيمة المضافة (15%): ${data.vatNumber}
    `;

    // Generate the QR code as a data URL
    return await toDataURL(formattedData); // Ensure this returns a promise
  }

  generateZatcaQRCode(data: ZatcaData): Promise<string> {
    const base64Data = this.encodeZatcaData(data);
    return toDataURL(base64Data);
  }

  private encodeZatcaData(data: ZatcaData): string {
    const tlv = [
      this.tlv(1, data.sellerName),
      this.tlv(2, data.vatNumber),
      this.tlv(3, data.timestamp),
      this.tlv(4, data.total),
      this.tlv(5, data.vatTotal),
    ];

    const binaryString = tlv.map((item) => item.join('')).join('');
    return btoa(binaryString);
  }

  private tlv(tag: number, value: string): string[] {
    const tagHex = tag.toString(16).padStart(2, '0');
    const lengthHex = value.length.toString(16).padStart(2, '0');
    const valueHex = this.stringToHex(value);
    return [tagHex, lengthHex, valueHex];
  }

  private stringToHex(str: string): string {
    return Array.from(str)
      .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');
  }
}

interface ZatcaData {
  sellerName: string;
  vatNumber: string;
  timestamp: string;
  total: string;
  vatTotal: string;
}
