import { Center, Flex, Image, Title } from "@mantine/core";
import { Navbar,Container, NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "../../database/service/auth_service";
import { logout } from "../redux/features/user";

const Header = () => {
    const user = useSelector((state: any) => state.user.value);
    const dispatch = useDispatch();
  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">
          <Flex>
            <Image src={"/logo.png"} w={50} />
            <Center>
              <Title ml={"sm"} order={3}>
                Fatura Kesme ve Yönetim Sistemi
              </Title>
            </Center>
          </Flex>
        </Navbar.Brand>
        <Navbar.Toggle />
        <NavDropdown title={user.name} id="basic-nav-dropdown">
          <NavDropdown.Item
            onClick={() => {
              window.location.href = "/login";
              signout();
              dispatch(logout());
              localStorage.clear();
            }}
          >
            Çıkış Yap
          </NavDropdown.Item>
        </NavDropdown>
      </Container>
    </Navbar>
  );
};

export default Header;
