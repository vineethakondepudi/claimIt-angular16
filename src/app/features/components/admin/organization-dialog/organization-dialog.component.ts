import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-organization-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organization-dialog.component.html',
  styleUrls: ['./organization-dialog.component.scss'],
})
export class OrganizationDialogComponent {
  organizationList: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<OrganizationDialogComponent>
  ) {
    this.organizationList = data.organizationList;
  }

  onOrganizationSelect(orgId: string): void {
    this.dialogRef.close(orgId); // Close the dialog and send back the selected orgId
  }
}
