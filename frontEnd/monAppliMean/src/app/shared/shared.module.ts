import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
  declarations: [HeaderComponent, FooterComponent], // Declare  components 
  exports: [HeaderComponent, FooterComponent], // Exporting them 
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule
  
  ],
})
export class SharedModule {}
