import { Option } from './products.model';
import { ICategory } from './category.model';

export interface Cart {
    success: number;
    error: any[];
    data: ICartData;
}

export interface ICartData {
    weight: string;
    products: CartProduct[];
    vouchers: any[];
    coupon_status: string;
    coupon: string;
    voucher_status: string;
    voucher: string;
    reward_status: boolean;
    reward: string;
    totals: Total[];
    total: string;
    total_raw: number;
    total_product_count: number;
}

export interface CartProduct {
    key: string;
    thumb: string;
    name: string;
    points?: number;
    product_id?: string;
    model?: string;
    option?: Option[];
    quantity: string;
    recurring?: string;
    stock?: boolean;
    reward?: string;
    price?: string;
    total: string;
    isWishList: boolean;
    category: any[];
}
export interface Total {
    title: string;
    text: string;
    value: number;
}

export class AddCartProduct {
    constructor(
        product_id: string,
        quantity: string,
        option: { [key: string]: string }
        ) { }
}
