import { ProductWithUI } from "../../../../types";
import formatter from "../../../utils/formatter";

const ProductTableItem = ({
  product,
  startEditProduct,
  deleteProduct,
}: {
  product: ProductWithUI;
  startEditProduct: (product: ProductWithUI) => void;
  deleteProduct: (productId: string) => void;
}) => {
  return (
    <tr key={product.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {product.stock > 0 ? formatter.formatPriceWon(product.price) : "SOLD OUT"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            product.stock > 10
              ? "bg-green-100 text-green-800"
              : product.stock > 0
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {product.stock}개
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{product.description || "-"}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button onClick={() => startEditProduct(product)} className="text-indigo-600 hover:text-indigo-900 mr-3">
          수정
        </button>
        <button onClick={() => deleteProduct(product.id)} className="text-red-600 hover:text-red-900">
          삭제
        </button>
      </td>
    </tr>
  );
};

export default ProductTableItem;
