import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BeeContainerComponent } from './bee-container/bee-container.component';
import { ColonySelectorComponent } from './colony-selector/colony-selector.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    AppComponent,
    BeeContainerComponent,
    ColonySelectorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    GraphQLModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
