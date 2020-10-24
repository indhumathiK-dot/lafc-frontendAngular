export interface ShippingMethod {
    success: number;
    error: any[];
    data: ShippingMethodModel;
}

export interface ShippingMethodModel {
    shipping_methods: ShippingMethods;
    code: string;
    comment: string;
}

export interface ShippingMethods {
    flat: ShippingMethodsFlat;
    pickup: ShippingMethodsPickup;
}

export interface ShippingMethodsFlat {
    title: string;
    quote: FlatQuote;
    sort_order: string;
    error: boolean;
}
export interface FlatQuote {
    flat: QuoteFlat;
}

export interface QuoteFlat {
    code: string;
    title: string;
    cost: string;
    tax_class_id: string;
    text: string;
}

export interface ShippingMethodsPickup {
    title: string;
    quote: PickupQuote;
    sort_order: string;
    error: boolean;
}

export interface PickupQuote {
    pickup: QuotePickup;
}

export interface QuotePickup {
    code: string;
    title: string;
    cost: number;
    tax_class_id: number;
    text: string;
}
