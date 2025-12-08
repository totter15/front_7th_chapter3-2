import { Product } from "../../../../types";
import ProductListItem from "./ProductListItem";

const ProductList = ({ products, addToCart }: { products: Product[]; addToCart: (product: Product) => void }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => {
        return <ProductListItem key={product.id} product={product} handleAddToCart={() => addToCart(product)} />;
      })}
    </div>
  );
};

export default ProductList;
