export interface PincodeModel {
    success: number;
    error: any[];
    data: Pincode;
}

export interface Pincode {
    pincode: number;
    deilverydays: string;
    cityname: string;
    statename: string;
    zonename: string;
    codcharge: string;
    shippingcharge: string;
    deliverydetails: Deliverydetail[];
    installationAvailable: any;
}

export interface Deliverydetail {
    image: string;
    description: string;
}
