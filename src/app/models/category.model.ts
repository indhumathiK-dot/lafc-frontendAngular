export interface ICategory {
    success: number;
    error: any[];
    data: Data;
}
export interface Data {
    id: number;
    name: string;
    description: string;
    image: string;
    original_image: string;
    iconimage: string;
    filters: Filters;
    seo_url: string;
    sub_categories: SubCategoryElement[];
}
export interface Filters {
    filter_groups: any[];
}
export interface SubCategoryElement {
    category_id: number;
    id: string;
    parent_id: number;
    name: string;
    seo_url: string;
    image: string;
    original_image: string;
    iconimage: string;
    filters: Filters;
    categories: SubCategoryElement[];
    sub_categories: SubCategoryElement[];
}


export interface SubCategoryElementResolved {
    subCategoryElement: SubCategoryElement;
    error?: any;
}