import { ProductWithUI } from "../../../../types";
import ProductTableItem from "./ProductTableItem";
const ProductTable = ({
  products,
  startEditProduct,
  deleteProduct,
}: {
  products: ProductWithUI[];
  startEditProduct: (product: ProductWithUI) => void;
  deleteProduct: (productId: string) => void;
}) => {
  const TableHeader = ({ header }: { header: string }) => {
    return <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>;
  };

  return (
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <TableHeader header="상품명" />
          <TableHeader header="가격" />
          <TableHeader header="재고" />
          <TableHeader header="설명" />
          <TableHeader header="작업" />
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {products.map((product) => (
          <ProductTableItem
            key={product.id}
            product={product}
            startEditProduct={startEditProduct}
            deleteProduct={deleteProduct}
          />
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
