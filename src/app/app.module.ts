import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { HttpModule, JsonpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';

import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { ProductsListComponent } from '../pages/products-list/products-list';
import { ProductDetailsComponent } from '../pages/product-details/product-details';
import { ProductImageComponent } from '../pages/product-image/product-image';
import { ProductEditComponent } from '../pages/product-edit/product-edit';
import { ProductAddComponent } from '../pages/product-add/product-add';
import { ProductsViewOptionsComponent } from '../pages/products-view-options/products-view-options';
import { ConfigComponent } from '../pages/config/config';
import { TabsPage } from '../pages/tabs/tabs';
import { ProductsService } from '../services/products.service';
import { SettingsService } from '../services/settings.service';
import { ProductInfoService } from '../services/product-info.service';
import { OrderByPipe } from '../pipes/orderBy';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    ProductsListComponent,
    ProductDetailsComponent,
    ProductImageComponent,
    ProductEditComponent,
    ProductAddComponent,
    ConfigComponent,
    TabsPage,
    OrderByPipe,
    ProductsViewOptionsComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule,
    JsonpModule,
    ReactiveFormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    ProductsListComponent,
    ProductDetailsComponent,
    ProductImageComponent,
    ProductEditComponent,
    ProductAddComponent,
    ConfigComponent,
    TabsPage,
    ProductsViewOptionsComponent
  ],
  providers: [ ProductsService, SettingsService, ProductInfoService ]
})
export class AppModule {}
