
import { Injectable } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { SubCategoryElement } from '../models/category.model';
import { BehaviorSubject } from 'rxjs';
const MAX_LEVEL = 5;
const SIDE_MENU_LEVEL = 2;
export interface CategoryFilterTree {
    cat?: SubCategoryElement;
    isOpen?: boolean;
    isSelected?: boolean;
    level?: number;
    _parent?: CategoryFilterTree;
    children?: CategoryFilterTree[];
}

@Injectable({
    providedIn: 'root'
})
export class CategoryFilterService {
    constructor(private catService: CategoryService) { }
    selectedSet: Array<CategoryFilterTree> = [];
    primaryView: CategoryFilterTree;
    secondaryView: CategoryFilterTree;
    selectedSet$$ = new BehaviorSubject(this.selectedSet);
    tree: CategoryFilterTree = {
        cat: null,
        isOpen: true,
        isSelected: true,
        level: 0,
        _parent: null,
        children: []
    };
    map: Map<number, CategoryFilterTree> = new Map();
    private fetchAllCategories() {
        return this.catService.getCategoriesByLevel(MAX_LEVEL);
    }
    getRootCategories() {
        return this.tree.children.map(e => e.cat);
    }
    getCategoryById(id: number) {
        return this.map.has(id) && this.map.get(id).cat;
    }
    getCategoryFilterTreeById(id: number) {
        return this.map.get(id);
    }
    getSelectedSet() {
        return this.selectedSet$$.asObservable();
    }
    buildFilterTree() {
        return new Promise((res, rej) => {
            if (this.tree.children.length !== 0) {
                res(true);
                return;
            }
            this.fetchAllCategories().subscribe((e: any) => {
                const element: SubCategoryElement[] = e;
                for (const cat of element) {
                    this.tree.children.push(this.build(cat, this.tree));
                }
                res(true);
            });
        });

    }
    private toggleDeepestChild(root: CategoryFilterTree) {
        if (root === null || root.children.length === 0) {
            return;
        }
        const firstChild = root.children[0];
        firstChild.isOpen = true;
        firstChild.isSelected = true;
        this.selectedSet.push(firstChild);
        this.toggleDeepestChild(firstChild);
    }
    getTopSelectedCat() {
        return this.selectedSet.find(e => (e.level === SIDE_MENU_LEVEL - 2));
    }
    toggleSelection(id: number) {
        this._toggle(id);
        let lastCat = this.selectedSet[this.selectedSet.length - 1]
        if (lastCat && lastCat.level <= 3) {
            this.toggleDeepestChild(lastCat);
        };
        this.primaryView = { ...this.selectedSet.find(e => ((e.level === SIDE_MENU_LEVEL) && e.isSelected)) };
        this.secondaryView = this.selectedSet.find(e => (e.level === SIDE_MENU_LEVEL - 1));
    }
    private _toggle(id) {
        if (id === null || id === undefined) {
            return;
        }
        let node = this.map.get(id);
        if (node === undefined || node === null) {
            return;
        }
        this.selectedSet.forEach(s => {
            s.isSelected = false;
            s.isOpen = false;
        });
        node.isSelected = true;
        node.isOpen = true;
        this.selectedSet = [node];
        while (node._parent) {
            const parent = node._parent;
            if (parent) {
                parent.isSelected = true;
                parent.isOpen = true;
                this.selectedSet.push(parent);
            }
            node.isSelected = true;
            node.isOpen = true;
            node = parent;
        }
        this.selectedSet = this.selectedSet.sort((a, b) => a.level - b.level);
        this.selectedSet = this.selectedSet.filter(e => e.cat !== null);
        this.selectedSet$$.next(this.selectedSet);
    }
    private _open(root: CategoryFilterTree) {
        if (!root) {
            return;
        }
        root.isOpen = true;
        for (const child of root.children) {
            if (!root.isOpen) {
                this._open(child);
            }
        }
        return;
    }
    // private _closeOthers(root: CategoryFilterTree) {
    //     if (root === null || root === undefined) {
    //         return;
    //     }
    //     root.isOpen = false;
    //     for (const child of root.children) {
    //         if (child.isOpen) {
    //             this._closeOthers(child);
    //     }
    // }
    toggleExpansion(id: number) {
        let node = this.map.get(id);
        let isOpen = node.isOpen
        //node.isOpen = !node.isOpen;
        return true;
    }
    private build(root: SubCategoryElement, filterTree: CategoryFilterTree) {
        const element: CategoryFilterTree = {
            cat: root,
            isOpen: false,
            isSelected: false,
            level: filterTree.level + 1,
            _parent: filterTree,
            children: []
        };
        if (root.categories && root.categories.length > 0) {
            for (const cat of root.categories) {
                element.children.push(this.build(cat, element));
            }
        }
        this.map.set(root.category_id, element);
        return element;

    }
}
