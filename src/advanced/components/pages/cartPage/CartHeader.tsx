import HeaderCartIcon from "../../icons/HeaderCartIcon";
import Header from "../../ui/Header";

const CartHeader = ({
  goAdminPage,
  cartCount,
  searchTerm,
  setSearchTerm,
}: {
  goAdminPage: () => void;
  cartCount: number;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}) => {
  return (
    <Header
      hasSearch={true}
      searchValue={searchTerm}
      setSearchValue={setSearchTerm}
      searchPlaceholder="상품 검색..."
      children={
        <>
          <Header.Button onClick={goAdminPage} type={"secondary"}>
            {"관리자 페이지로"}
          </Header.Button>

          <div className="relative">
            <HeaderCartIcon />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
        </>
      }
    />
  );
};

export default CartHeader;
