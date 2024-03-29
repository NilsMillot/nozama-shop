import { html } from "lit";
import { Base } from "../Base";
import { getCartValue, setCartValue, getCartKeys } from "../idbHelper";

export class ProductCard extends Base {
  constructor() {
    super();

    this.product = {};
    this.loaded = false;
    this.location = "";
  }
  static get properties() {
    return {
      product: { type: Object },
      loaded: { type: Boolean, state: true },
      location: { type: String },
    };
  }
  firstUpdated() {
    this.querySelector("img").addEventListener("load", () => {
      this.loaded = true;
    });
  }
  addToCart() {
    getCartValue("articles")
      .then((res) => {
        let arrItems = res;
        arrItems.push(this.product);
        setCartValue("articles", arrItems);
      })
      .catch((err) => console.error(err));
    getCartValue("total")
      .then((res) => {
        let total = res;
        total += this.product.price;
        setCartValue("total", total);
      })
      .catch((err) => console.error(err));
  }
  removeFromCart() {
    getCartValue("articles").then((articles) => {
      let arrItems = articles;
      getCartValue("total")
        .then((res) => {
          const total = res;
          const objFindInArr = arrItems.find((e) => e.id === this.product.id);
          const total2 = total - objFindInArr.price;
          setCartValue("total", total2);
          let objFindIndex = arrItems.indexOf(objFindInArr);
          if (objFindIndex !== -1) {
            arrItems.splice(objFindIndex, 1);
          }
          setCartValue("articles", arrItems);
        })
        .catch((err) => console.error(err));
    });
  }
  render() {
    let buttons;
    if (this.location === "home") {
      buttons = html`<button @click="${this.addToCart}">add to cart</button>`;
    } else {
      buttons = html`<button @click="${this.removeFromCart}">
        remove from cart
      </button>`;
    }
    return html`
      <div>
        <a href="/product/${this.product.id}" class="card">
          <header>
            <figure>
              <div
                class="placeholder ${this.loaded ? "fade" : ""}"
                style="background-image: url(http://localhost:9000/image/24/${this
                  .product.image})"
              ></div>
              <img
                alt="${this.product.title}"
                src="http://localhost:9000/image/620/${this.product.image}"
                loading="lazy"
                width="1280"
                height="720"
              />
            </figure>
          </header>
          <main>
            <h1>${this.product.title}</h1>
            <p>${this.product.description}</p>
            <p>${this.product.id}</p>
          </main>
        </a>
        <div class="buttons">${buttons}</div>
      </div>
    `;
  }
}
customElements.define("product-card", ProductCard);
