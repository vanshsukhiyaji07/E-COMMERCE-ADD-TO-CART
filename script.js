class Products {
    constructor(id, name, price, imageUrl) {
        if (this.constructor === Products) {
            throw new Error("Cannot initialize the abstract class");
        }
        this.id = id;
        this.name = name;
        this.price = price;
        this.imageUrl = imageUrl;
    }

    displayProduct() {
        throw new Error("Abstract method must be implemented");
    }
}

class PhysicalProduct extends Products {
    constructor(id, name, price, weight, imageUrl) {
        super(id, name, price, imageUrl);
        this.weight = weight;
    }

    displayProduct() {
        return `
            <div class="product">
                <img src="${this.imageUrl}" alt="${this.name}" class="product-image">
                <h3>${this.name}</h3>
                <p>Weight: ${this.weight} Kg</p>
                <p>Price: $${this.price}</p>
                <button onclick="shop.addToCart(${this.id})">Add to Cart</button>
            </div>
        `;
    }
}

class DigitalProduct extends Products {
    constructor(id, name, price, fileSize, imageUrl) {
        super(id, name, price, imageUrl);
        this.fileSize = fileSize;
    }

    displayProduct() {
        return `
            <div class="product">
                <img src="${this.imageUrl}" alt="${this.name}" class="product-image">
                <h3>${this.name}</h3>
                <p>File Size: ${this.fileSize} MB</p>
                <p>Price: $${this.price}</p>
                <button onclick="shop.addToCart(${this.id})">Add to Cart</button>
            </div>
        `;
    }
}

class CartItem {
    constructor(product, quantity = 1) {
        this.product = product;
        this.quantity = quantity;
    }

    incrementQuantity() {
        this.quantity++;
    }

    getTotalPrice() {
        return this.product.price * this.quantity;
    }

    displayCartItem() {
        return `
            <li>
                <span>${this.product.name}</span>
                <span>Quantity: ${this.quantity}</span>
                <span>Price: $${this.getTotalPrice().toFixed(2)}</span>
            </li>
        `;
    }
}

class Cart {
    constructor() {
        this.items = [];
    }

    addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            const existingItem = this.items.find(item => item.product.id === productId);
            if (existingItem) {
                existingItem.incrementQuantity();
            } else {
                this.items.push(new CartItem(product));
            }
            this.displayCart();
        } else {
            throw new Error("Product not found");
        }
    }

    displayCart() {
        const cartItemList = document.getElementById("cart-item");
        cartItemList.innerHTML = "";
        this.items.forEach(item => {
            cartItemList.innerHTML += item.displayCartItem();
        });
    }

    checkout() {
        if (this.items.length === 0) {
            alert("Your cart is empty.");
            return;
        }
        alert(`Checkout ${this.items.length} items. Total price: $${this.getTotal().toFixed(2)}`);
        this.items = [];
        this.displayCart();
    }

    getTotal() {
        return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
    }
}

const shop = new Cart();

const products = [
    new PhysicalProduct(1, "Face Wash", 30.00, 1.5, "https://img.freepik.com/free-photo/organic-cosmetic-product-with-dreamy-aesthetic-fresh-background_23-2151382816.jpg"),
    new DigitalProduct(2, "Smart Watch", 20.00, 50, "https://images.unsplash.com/photo-1523275335684-37898b6baf30?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D"),
];

const productSection = document.getElementById("product-section");
products.forEach(product => {
    productSection.innerHTML += product.displayProduct();
});

document.getElementById("checkout-button").addEventListener("click", () => {
    shop.checkout();
});
