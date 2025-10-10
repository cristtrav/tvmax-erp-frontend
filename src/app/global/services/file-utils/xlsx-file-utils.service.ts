import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class XLSXFileUtilsService {

  constructor() { }

  public downloadXLSX(xlsx: any, nombrearchivo: string){
    var newBlob = new Blob([xlsx], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          const data = window.URL.createObjectURL(newBlob);
            
          var link = document.createElement('a');
          link.href = data;
          link.download = nombrearchivo;
          // this is necessary as link.click() does not work on the latest firefox
          link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          
          setTimeout(function () {
              // For Firefox it is necessary to delay revoking the ObjectURL
              window.URL.revokeObjectURL(data);
              link.remove();
          }, 100);

  }

  /*public downloadKUDE(kude: any, nombrearchivo: string){
    var newBlob = new Blob([kude], { type: "application/pdf" });
          const data = window.URL.createObjectURL(newBlob);
            
          var link = document.createElement('a');
          link.href = data;
          link.download = nombrearchivo;
          // this is necessary as link.click() does not work on the latest firefox
          link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          
          setTimeout(function () {
              // For Firefox it is necessary to delay revoking the ObjectURL
              window.URL.revokeObjectURL(data);
              link.remove();
          }, 100);
  }*/
}
