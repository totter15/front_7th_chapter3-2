import { useState } from "react";
import { ProductWithUI } from "../../../../types";
import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";

const ProductSection = ({
  products,
  deleteProduct,
  updateProduct,
  addProduct,
  addNotification,
}: {
  products: ProductWithUI[];
  deleteProduct: (productId: string) => void;
  addNotification: (message: string, type: "error" | "success" | "warning") => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  addProduct: (newProduct: Omit<ProductWithUI, "id">) => void;
}) => {
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [],
  });
  const [showProductForm, setShowProductForm] = useState(false);

  const resetForm = () => {
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });
  };

  // 제춤 추가
  const startAddProduct = () => {
    setEditingProduct("new");
    resetForm();
    setShowProductForm(true);
  };

  // 제품 수정
  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  };

  // 제품 입력 완료
  const submitProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== "new") {
      updateProduct(editingProduct, productForm);
      setEditingProduct(null);
      addNotification("상품이 수정되었습니다.", "success");
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts,
      });
      addNotification("상품이 추가되었습니다.", "success");
    }

    resetForm();
    setEditingProduct(null);
    setShowProductForm(false);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <button
            onClick={startAddProduct}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            새 상품 추가
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <ProductTable
          products={products}
          startEditProduct={startEditProduct}
          deleteProduct={(productId) => {
            deleteProduct(productId);
            addNotification("상품이 삭제되었습니다.", "success");
          }}
        />
      </div>

      {showProductForm && (
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <ProductForm
            handleProductSubmit={submitProductForm}
            editingProduct={editingProduct}
            productForm={productForm}
            setProductForm={setProductForm}
            addNotification={addNotification}
            onCancel={() => {
              setEditingProduct(null);
              resetForm();
              setShowProductForm(false);
            }}
          />
        </div>
      )}
    </section>
  );
};

export default ProductSection;
