import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ProjectService } from '../core/services/project.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-project-dialog',
  templateUrl: './delete-project-dialog.component.html',
  styleUrls: ['./delete-project-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class DeleteProjectDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { projectId: number },
    private projectService: ProjectService,
    private snackBar: MatSnackBar
  ) {}

  deleteProject(): void {
    this.projectService.deleteProject(this.data.projectId).subscribe({
      next: () => this.dialogRef.close(),
      error: () => {
        this.snackBar.open(
          'Something went wrong when deleting project.',
          '',
          {
            duration: 2000,
          }
        );
      },
    });
  }
}
