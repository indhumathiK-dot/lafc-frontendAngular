import { Injectable } from '@angular/core';
import { Product } from 'src/app/models/products.model';
import { ProductsService } from 'src/app/services/products.service';
import { CategoryService } from 'src/app/services/category.service';
import { BestSellerHttpService } from 'src/app/core/services/http/bestsellerhttpservice';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
interface PriceRange {
    min: number;
    max: number;
    step: number;
}
@Injectable({
    providedIn: 'root'
})
export class ProductsOverviewService {
    products: Product[] = [];
    allProducts: Product[] = [];
    brandItems: any[] = [];
    rangeItems: any[] = [];
    isLoading: boolean = false;
    price: PriceRange = {
        min: 0,
        max: 1000,
        step: 100
    };
    customeSteps;
    materialItems: any[] = [];
    infoData: any[] = [];
    isListOpen: boolean = false;
    selectedBrands = [];
    selectedRange = [];
    selectedMaterial = [];
    selectedPrice = [];
    constructor(private productsService: ProductsService,
        public catService: CategoryService,
        public router: Router,
        public bestSellerHttpService: BestSellerHttpService) {
        this.getInfoData();
    }
    private _setPriceMinMax() {
        const prices = this.allProducts.map(e => e.price_excluding_tax).sort((a, b) => a - b);
        if (this.allProducts.length > 0) {
            if ((prices[0].toString().length > 0) && (prices[0].toString().length < 3)) {
                this.customeSteps = 100;
            } else if ((prices[0].toString().length >= 3) && (prices[0].toString().length < 5)) {
                this.customeSteps = 500;
            } else {
                this.customeSteps = 1000;
            }
        } else {
            this.price.min = 0;
            this.price.max = 0;
            this.customeSteps = 0;
        }
        this.price = {
            min: prices[0],
            max: prices[prices.length - 1],
            step: this.customeSteps
        };
    }
    private init() {
        this.getAllRanges();
        this.getAllMaterials();
        this.getAllBrands();
        this._setPriceMinMax();
    }
    getAllBrands() {
        const set = new Set();
        this.allProducts.forEach((prod) => {
            if (prod.manufacturer !== null && prod.manufacturer !== undefined) {
                set.add(prod.manufacturer);
            }
        });
        this.brandItems = [...set.values()];
    }
    getAllProductsByCategory(catId: string) {
        this.isLoading = true;
        this.products = [];
        this.productsService.getProductsByCategoryId(catId).pipe(take(1))
            .subscribe((products) => {
                this.allProducts = products;
                this.products = products;
                this.init();
                this.isLoading = false;
            });
    }
    getAllProductsByBrand(brandId: string) {
        this.productsService.getProductsByMnfctrID(brandId).pipe(take(1)).subscribe(products => {
            this.allProducts = products;
            this.products = products;
            this.init();
        });
    }
    getAllProductsByDeals(dealId: any) {
        this.bestSellerHttpService.getDealsByApiID(dealId).subscribe(products => {
            this.allProducts = products.data;
            this.products = products.data;
            this.init();
        });
    }
    // getAllProductsBySearch(searchtext) {
    //     this.productsService.searchProduct(searchtext).subscribe(products => {
    //         this.allProducts = products.data;
    //         this.products = products.data;
    //         this.init();
    //     });
    // }
    private _pickUniqueValuesByOption(optionName) {
        const v = new Set();
        this.allProducts.forEach((prod) => {
            if (prod.options !== null || prod.options !== undefined) {
                prod.options.forEach((opts) => {
                    if ((opts.option_value !== null || opts.option_value !== undefined) && (opts.name === optionName)) {
                        opts.option_value.forEach((opt) => {
                            v.add(opt.name);
                        });
                    }
                });
            }
        });
        return [...v.values()]
    }
    getAllRanges() {
        this.rangeItems = this._pickUniqueValuesByOption('Range');
    }
    getAllMaterials() {
        this.materialItems = this._pickUniqueValuesByOption('Material');
    }
    getSideMenuDataByCategory() { }
    onSortOptionChange(value, catId) {
        switch (value) {
            case 'relevance':
                this.getAllProductsByCategory(catId);
                break;
            case 'highestPriceFirst':
                this.products = this.products.sort(this.mycomparator);
                break;
            case 'lowestPriceFirst':
                this.products = this.products.sort(this.lowPriceComparator);
                break;
            case 'newArrival':
                this.products = this.products.sort(this.newArrivalsComparator);
                break;
            case 'discount':
                this.products = this.products.sort(this.dicountComparator);
                break;
            default:
                break;
        }
    }

    mycomparator = (a, b) => {
        return parseFloat(b.price) - parseFloat(a.price);
    }
    lowPriceComparator = (a, b) => {
        return parseFloat(a.price) - parseFloat(b.price);
    }
    newArrivalsComparator = (a, b) => {
        return new Date(b.date_added).getTime() - new Date(a.date_added).getTime();
    }
    dicountComparator = (a, b) => {
        return (b.discountPercentile) - (a.discountPercentile);
    }
    private _onOptionsChanged(optName, selectedValues) {
        if (selectedValues && selectedValues.length === 0) {
            return this.products.length > 0 ? [...this.products] : [...this.allProducts];
        }
        const products = this.allProducts.filter(prod => {
            const len = selectedValues.length;
            for (let i = 0; i < len; i++) {
                if (prod.options !== null || prod.options !== undefined) {
                    prod.options.forEach((opts) => {
                        if ((opts.option_value !== null || opts.option_value !== undefined) && (opts.name === optName)) {
                            opts.option_value.forEach(name => {
                                if (name.name === selectedValues[i]) {
                                    return true;
                                }
                            });
                        }
                    });
                }
            }
        });
        return products;
    }
    onRangeChanged(selectedRanges) {
        this.selectedRange = selectedRanges;
        this.products = this._onOptionsChanged('Range', selectedRanges);
    }
    onPriceChanged(min, max) {
        this.products = this.allProducts.filter(prod => {
            const price = prod.price_excluding_tax;
            this.selectedPrice = [min, max];
            return price >= min && price <= max;
        });
    }
    onBrandChanged(brands: any[] = []) {
        if (brands.length === 0) {
            this.products = [...this.allProducts];
            this.selectedBrands = [];
            return;
        }
        this.products = this.allProducts.filter(prod => {
            const manufacturer = prod.manufacturer;
            this.selectedBrands = brands;
            return brands.includes(manufacturer);
        });

    }
    onMaterialChanged(materials) {
        this.selectedMaterial = materials;
        this.products = this._onOptionsChanged('Material', materials);
    }

    getInfoData() {
        this.bestSellerHttpService.getBannerAPI().subscribe(res => {
            this.infoData = res.data;
        });
    }
    getImage(value) {
        this.router.navigate(['/', 'services', value.link, this.catService.slug(value.title)]);
    }

}