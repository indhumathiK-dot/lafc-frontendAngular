import { SubCategoryElement } from './category.model';

export interface Products {
    success: number;
    error: any[];
    data: Product;
}

export interface Product {
    id: number;
    product_id: number;
    name: string;
    manufacturer: string;
    sku: string;
    model: string;
    image: string;
    video: string;
    images: string[];
    original_image: string;
    original_images: string[];
    price_excluding_tax: number;
    price: number;
    price_formated: string;
    rating: number;
    description: string;
    attribute_groups: AttributeGroup[];
    special: number;
    special_excluding_tax: number;
    special_formated: string;
    special_start_date: string;
    special_end_date: string;
    discounts: any[];
    options: Option[];
    minimum: string;
    meta_title: string;
    meta_description: string;
    meta_keyword: string;
    seo_url: string;
    tag: string;
    upc: string;
    ean: string;
    jan: string;
    isbn: string;
    mpn: string;
    location: string;
    stock_status: string;
    stock_status_id: number;
    manufacturer_id: number;
    tax_class_id: number;
    date_available: string;
    weight: string;
    weight_class_id: number;
    length: string;
    width: string;
    height: string;
    length_class_id: number;
    subtract: string;
    sort_order: string;
    status: string;
    date_added: string;
    date_modified: string;
    viewed: string;
    weight_class: string;
    length_class: string;
    shipping: string;
    reward: null;
    points: string;
    category: SubCategoryElement[];
    quantity: number;
    reviews: Reviews;
    recurrings: any[];
    fromDate: Date;
    toDate: Date;
    productswithBrands: string;
    productListWithBrands: string;
    discountPrice: any;
    discountPercentile: any;
    isWishList?: boolean;
}

export interface AttributeGroup {
    attribute_group_id: string;
    name: string;
    attribute: Attribute[];
}

export interface Attribute {
    attribute_id: string;
    name: string;
    text: string;
}

export interface Option {
    product_option_id: number;
    option_value: OptionValue[];
    option_id: number;
    name: string;
    type: string;
    value: string;
    required: string;
}

export interface OptionValue {
    image: null;
    price: number;
    price_excluding_tax: number;
    price_formated: number;
    price_prefix: string;
    product_option_value_id: number;
    option_value_id: number;
    name: string;
    quantity: number;
}

export interface Reviews {
    review_total: string;
    reviews: Review[];
}

export interface Review {
    author: string;
    text: string;
    rating: number;
    date_added: string;
}

export interface ProductResolved {
    product: Product;
    error: any;
}