import { Product } from "../../../../types";
import { formatPrice } from "../../../utils/formatter";
import ProductListItem from "./ProductListItem";

const ProductList = ({ products, addToCart }: { products: Product[]; addToCart: (product: Product) => void }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => {
        return (
          <ProductListItem
            key={product.id}
            product={product}
            formatPrice={formatPrice}
            handleAddToCart={() => addToCart(product)}
          />
        );
      })}
    </div>
  );
};

export default ProductList;
