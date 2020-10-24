export interface OrderDetails {
    success: number;
    error: any[];
    data: Order;
}

export interface Order {
    order_id: string;
    invoice_no: string;
    invoice_prefix: string;
    store_id: string;
    store_name: string;
    store_url: string;
    customer_id: string;
    firstname: string;
    lastname: string;
    telephone: string;
    email: string;
    payment_firstname: string;
    payment_lastname: string;
    payment_company: string;
    payment_address_1: string;
    payment_address_2: string;
    payment_postcode: string;
    payment_city: string;
    payment_zone_id: string;
    payment_zone: string;
    payment_zone_code: string;
    payment_country_id: string;
    payment_country: string;
    payment_iso_code_2: string;
    payment_iso_code_3: string;
    payment_address_format: string;
    payment_method: string;
    shipping_firstname: string;
    shipping_lastname: string;
    shipping_company: string;
    shipping_address_1: string;
    shipping_address_2: string;
    shipping_postcode: string;
    shipping_city: string;
    shipping_zone_id: string;
    shipping_zone: string;
    shipping_zone_code: string;
    shipping_country_id: string;
    shipping_country: string;
    shipping_iso_code_2: string;
    shipping_iso_code_3: string;
    shipping_address_format: string;
    shipping_method: string;
    comment: string;
    total: string;
    order_status_id: string;
    order_status: string;
    language_id: string;
    currency_id: string;
    currency_code: string;
    currency_value: string;
    date_modified: string;
    date_added: string;
    ip: string;
    payment_address: string;
    shipping_address: string;
    products: Product[];
    vouchers: any[];
    totals: Total[];
    histories: History[];
}

export interface History {
    date_added: string;
    status: string;
    comment: string;
}

export interface Product {
    product_id: string;
    order_product_id: string;
    name: string;
    model: string;
    option: Option[];
    quantity: string;
    price: string;
    total: string;
    return: string;
    image: string;
}

export interface Option {
    name: string;
    value: string;
}

export interface Total {
    order_total_id: string;
    order_id: string;
    code: string;
    title: string;
    value: string;
    sort_order: string;
}