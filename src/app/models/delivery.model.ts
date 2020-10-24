import { Country } from './country.model';

export interface DeliveryAddress {
    firstname: string;
    lastname: string;
    city: string;
    address_1: string;
    address_2: string;
    country_id: string;
    country: Country;
    postcode: string;
    zone_id: string;
    mobileNumber: string;
    email: string;
    note: string;
}
