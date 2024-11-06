export class Pago {
    idPago?: number;
    monto?: number;
    montoRestante?: number;
    metodo?: string;
    estado?: number;
    fechaPago?: string;
    //Datos adicionales de otras tablas 
    idServicio?: number;
    idCliente?: number;
    nomCliente?: string;
    costo?: number; //COSTO DEL SERVICIO
    montoInicial?: number;  // lO MISMO QUE EL SERVICIO PERO SE ACTUALIZA Y SE GUARDA EN TBL.PAGO 

}