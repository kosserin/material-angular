import { Component } from '@angular/core';
import { PageHeaderComponent } from "../page-header/page-header.component";

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [PageHeaderComponent],
  templateUrl: './management.component.html',
  styleUrl: './management.component.scss'
})
export class ManagementComponent {

}
