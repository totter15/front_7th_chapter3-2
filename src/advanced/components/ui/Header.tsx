import Input from "./Input";

const Button = ({
  children,
  onClick,
  type,
}: {
  children: React.ReactNode;
  onClick: () => void;
  type: "primary" | "secondary";
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm rounded transition-colors ${
        type === "primary" ? "bg-gray-800 text-white" : "text-gray-600 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );
};

const Header = ({
  hasSearch,
  searchValue,
  setSearchValue,
  searchPlaceholder,
  children,
}: {
  hasSearch?: boolean;
  searchValue?: string;
  setSearchValue?: (value: string) => void;
  searchPlaceholder?: string;
  children: React.ReactNode;
}) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
            {hasSearch && (
              <div className="ml-8 flex-1 max-w-md">
                <Input
                  input={searchValue ?? ""}
                  onChange={(e) => setSearchValue?.(e.target.value)}
                  placeholder={searchPlaceholder ?? ""}
                />
              </div>
            )}
          </div>

          <nav className="flex items-center space-x-4">{children}</nav>
        </div>
      </div>
    </header>
  );
};

Header.Button = Button;

export default Header;
