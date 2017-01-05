import { Pipe } from "@angular/core";

@Pipe({
  name: "orderby"
})
export class OrderByPipe {
  transform(array: Array<any>, key: string): Array<any> {

      array.sort((a: any, b: any) => {
          if (a[key] < b[key]) {
              return -1;
          } else if (a[key] > b[key]) {
              return 1;
          } else {
              return 0;
          }
      });
      return array;
  }
}