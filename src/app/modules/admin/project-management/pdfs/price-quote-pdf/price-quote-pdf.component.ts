import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-price-quote-pdf',
  templateUrl: './price-quote-pdf.component.html',
  styleUrls: ['./price-quote-pdf.component.scss']
})
export class PriceQuotePdfComponent implements OnInit {
  private router = inject(Router);
  private spinner = inject(NgxSpinnerService);

  @Input() projectDetails: any;
  @Input() isHide: any;
  constructor(public activeModal: NgbActiveModal) { }
  close() {
    this.activeModal.close();
  }

  ngOnInit(): void {

  }
  next() {
    this.close()
    this.router.navigate(['/admin/departments/project-management']);
  }

  downloadPDF(): void {
    // Get the element you want to download as a PDF
    const content = document.getElementById('contentToDownload');
    this.spinner.show();

    if (content) {
      html2canvas(content, { useCORS: true, allowTaint: false }).then(canvas => {
        const imgData = canvas.toDataURL('image/png'); // Convert content to image

        // Get canvas dimensions
        const contentWidth = canvas.width;
        const contentHeight = canvas.height;

        // Margins in millimeters
        const margin = 10; // 10mm margin on all sides

        // Set PDF dimensions to match the content, including margin
        const pdfWidth = 210 - 2 * margin; // A4 width (210mm) minus margins
        const pdfHeight = (contentHeight * pdfWidth) / contentWidth;

        // Create PDF with dynamic height
        const pdf = new jsPDF('p', 'mm', [pdfHeight + 2 * margin, 210]);

        // Add image to PDF with margin
        pdf.addImage(imgData, 'PNG', margin, margin, pdfWidth, pdfHeight);

        pdf.save(Math.random() * 10 + '.pdf');

        this.spinner.hide();

      });

    } else {
      console.error('Element not found');
      this.spinner.hide();


    }
  }
}
