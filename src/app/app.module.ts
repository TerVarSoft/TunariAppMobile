import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { ProductsListComponent } from '../pages/products-list/products-list';
import { ProductDetailsComponent } from '../pages/product-details/product-details';
import { ProductImageComponent } from '../pages/product-image/product-image';
import { TabsPage } from '../pages/tabs/tabs';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    ProductsListComponent,
    ProductDetailsComponent,
    ProductImageComponent,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
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
    TabsPage
  ],
  providers: []
})
export class AppModule {}
