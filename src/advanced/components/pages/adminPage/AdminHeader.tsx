import Header from "../../ui/Header";

const AdminHeader = ({ goShoppingPage }: { goShoppingPage: () => void }) => {
  return (
    <Header
      children={
        <Header.Button onClick={goShoppingPage} type="primary">
          쇼핑몰로 돌아가기
        </Header.Button>
      }
    />
  );
};

export default AdminHeader;
