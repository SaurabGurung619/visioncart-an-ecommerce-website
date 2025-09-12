import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { ProductFilterService } from '../../../../shared/services/product-filter';
import { CartService } from '../../../../shared/services/cart';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NgFor],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss'
})
export class HomePage implements OnInit {
  allProducts: any[] = [];
  products: any[] = [];
  selectedPriceRange: any = null;

  priceRanges = [
    { label: 'Under ₹1000', min: 0, max: 999 },
    { label: '₹1000 - ₹1500', min: 1000, max: 1500 },
    { label: '₹1501 - ₹2000', min: 1501, max: 2000 },
    { label: 'Above ₹2000', min: 2001, max: Infinity }
  ];

  constructor(
    private filterService: ProductFilterService,
    private cartService: CartService,
    private router: Router // ✅ inject Router
  ) {}

  ngOnInit() {
    const baseLamps = [
      { name: 'Smart LED Lamp', desc: 'Energy-efficient lamp with app control', image: 'images.jpeg', price: 899 },
      { name: 'Color-Changing Lamp', desc: 'Customizable RGB colors with voice support', image: '123.webp', price: 1099 },
      { name: 'Motion Sensor Lamp', desc: 'Activates on motion detection', image: '81vBzovGknL.webp', price: 1199 },
      { name: 'Portable Smart Lamp', desc: 'Battery-powered and USB rechargeable', image: 'VALTTL62BR62243_LP.jpg', price: 799 },
      { name: 'Smart Desk Lamp', desc: 'Adjustable brightness and angle', image: 'WTLMPMODAWFMLS1_LS_1.avif', price: 1299 },
      { name: 'WiFi Ceiling Lamp', desc: 'Smart home compatible ceiling fixture', image: '195a7736-jpg-65e1f6cadc0af.avif', price: 1999 },
      { name: 'Night Light Lamp', desc: 'Auto-sensing soft glow light', image: 'istockphoto-119833409-612x612.jpg', price: 599 },
      { name: 'Smart Ambient Lamp', desc: 'Creates mood lighting with app features', image: '61FctGSFyyL._UF1000,1000_QL80_.jpg', price: 1499 }
    ];
    
    

    // Generate 100 dynamic products
    for (let i = 1; i <= 100; i++) {
      const base = baseLamps[i % baseLamps.length];
      this.allProducts.push({
        name: `${base.name} ${i}`,
        description: base.desc,
        price: base.price + (i % 5) * 100,
        imageUrl: `assets/images/products/${base.image}`
      });
      
    }

    this.products = [...this.allProducts];

    // Live search filter from shared service
    this.filterService.currentSearchTerm$.subscribe(term => {
      const lowerTerm = term.toLowerCase();
      this.products = this.allProducts
        .filter(p =>
          (p.name.toLowerCase().includes(lowerTerm) ||
           p.description.toLowerCase().includes(lowerTerm)) &&
          this.matchPriceRange(p)
        );
    });
  }

  sortProducts(option: string) {
    if (option === 'lowToHigh') {
      this.products.sort((a, b) => a.price - b.price);
    } else if (option === 'highToLow') {
      this.products.sort((a, b) => b.price - a.price);
    }
  }

  filterByPrice(range: any) {
    this.selectedPriceRange = range;
    this.applyFilters();
  }

  clearFilters() {
    this.selectedPriceRange = null;
    this.applyFilters();
  }

  applyFilters() {
    this.products = this.allProducts.filter(p => this.matchPriceRange(p));
  }

  matchPriceRange(product: any): boolean {
    if (!this.selectedPriceRange) return true;
    return (
      product.price >= this.selectedPriceRange.min &&
      product.price <= this.selectedPriceRange.max
    );
  }

  // ✅ Add to Cart Method with redirection
  addProductToCart(product: any) {
    this.cartService.addToCart(product);
    console.log('Added to cart:', product); // Debug
    this.router.navigate(['/cart']); // ✅ redirect to cart page
  }
}
