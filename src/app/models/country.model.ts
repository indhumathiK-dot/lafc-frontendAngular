export interface Countries {
    success: number;
    error: any[];
    data: Country[];
}

export interface Country {
    country_id: number;
    name: string;
    iso_code_2: string;
    iso_code_3: string;
    address_format: string;
    postcode_required: string;
    status: string;
    zone: Zone[];
}

export interface Zone {
    zone_id: string;
    country_id: string;
    name: string;
    code: string;
    status: string;
}