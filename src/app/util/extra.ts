import { DetalleVenta } from "@dto/detalle-venta-dto";
import { Venta } from "@dto/venta.dto";

export class Extra {
    public static dateToString(d: Date): string {
        const dia = `${d.getDate()}`.padStart(2, '0');
        const mes = `${d.getMonth() + 1}`.padStart(2, '0');
        const strF: string = `${d.getFullYear()}-${mes}-${dia}`;
        return strF;
    }

    public static dateTimeToString(d: Date): string {
        const dia = `${d.getDate()}`.padStart(2, '0');
        const mes = `${d.getMonth() + 1}`.padStart(2, '0');
        const hora = `${d.getHours()}`.padStart(2, '0');
        const minuto = `${d.getMinutes()}`.padStart(2, '0');
        const segundo = `${d.getSeconds()}`.padStart(2, '0');
        const strF: string = `${d.getFullYear()}-${mes}-${dia}T${hora}:${minuto}:${segundo}`;
        return strF;
    }

    public static dateStrToDate(dateStr: string): Date {
        return new Date(+dateStr.split('-')[0], (+dateStr.split('-')[1]) - 1, +dateStr.split('-')[2]);
    }

    public static buildSortString(sort: { key: string, value: any }[] | { [field: string]: string }): string | null {
        if (Array.isArray(sort)) {
            for (let s of sort) {
                if (s.value === 'ascend') return `+${s.key}`;
                if (s.value === 'descend') return `-${s.key}`;
            }
            return null;
        } else {
            for (let k of Object.keys(sort)) {
                if (sort[k] === 'ascend') return `+${k}`;
                if (sort[k] === 'descend') return `-${k}`;
            }
            return null;
        }
    }

    public static toSortOrder(srtQuery: string | null): string | null {
        if (srtQuery?.charAt(0) === '+') return 'ascend';
        if (srtQuery?.charAt(0) === '-') return 'descend';
        return null;
    }


    static formatterNroFactura = (value: number): string => `${value ? value.toString().padStart(7, '0') : ''}`;
    static parserNroFactura = (value: string): string => `${value ? Number(value) : ''}`;

    public static agregarCssImpresion(targetWindow: Window): void {
        // Copy styles from parent window
        document.querySelectorAll("style").forEach(htmlElement => {
            targetWindow.document.head.appendChild(htmlElement.cloneNode(true));
        });
        // Copy stylesheet link from parent window
        const styleSheetElement = this._getStyleSheetElement();
        targetWindow.document.head.appendChild(styleSheetElement);
    }

    private static _getStyleSheetElement() {
        const styleSheetElement = document.createElement("link");
        document.querySelectorAll("link").forEach(htmlElement => {
            if (htmlElement.rel === "stylesheet") {
                const absoluteUrl = new URL(htmlElement.href).href;
                styleSheetElement.rel = "stylesheet";
                styleSheetElement.type = "text/css";
                styleSheetElement.href = absoluteUrl;
            }
        });
        return styleSheetElement;
    }

    public static getVentaPrueba(): Venta {
        const venta = new Venta();
        venta.id = 7655;
        venta.anulado = false;
        venta.ci = 4567123;
        venta.dvruc = 4;
        venta.fechafactura = new Date();
        venta.fechacobro = new Date();
        venta.idcliente = 2000;
        venta.cliente = 'JUAN PEREZ';
        venta.idcobradorcomision = 50;
        venta.cobrador = 'ANA DIAZ';
        venta.fechacobro = new Date();
        venta.idtimbrado = 10;
        venta.idusuarioregistrocobro = 1;
        venta.usuarioregistrocobro = 'ADMIN';
        venta.nrofactura = 3457;
        venta.prefijofactura = "003-002";
        venta.total = 240000;
        venta.totalexentoiva = 0;
        venta.totalgravadoiva10 = 240000;
        venta.totalgravadoiva5 = 0;
        venta.totaliva10 = 21818;
        venta.totaliva5 = 0;
        return venta;
    }

    public static getDetalleVentaPrueba(): DetalleVenta[] {
        const detalles: DetalleVenta[] = [];
        const detalle1 = new DetalleVenta();
        detalle1.id = 600;
        detalle1.descripcion = "(108654) TV CABLE | CUOTA ENE/2023"
        detalle1.porcentajeiva = 10;
        detalle1.monto = 90000;
        detalle1.cantidad = 1;
        detalle1.subtotal = 90000;
        detalle1.eliminado = false;
        detalle1.idcuota = 435999;
        detalle1.idservicio = 9;
        detalle1.idsuscripcion = 100000;
        detalles.push(detalle1);
    
        const detalle2 = new DetalleVenta();
        detalle2.id = 601;
        detalle2.descripcion = "(108654) INTERNET 50MB | CUOTA ENE/2023"
        detalle2.porcentajeiva = 10;
        detalle2.monto = 150000;
        detalle2.cantidad = 1;
        detalle2.subtotal = 150000;
        detalle2.eliminado = false;
        detalle2.idcuota = 435999;
        detalle2.idservicio = 12;
        detalle2.idsuscripcion = 100000;
        detalles.push(detalle2);
        return detalles;
    }
}