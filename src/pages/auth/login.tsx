import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Title,
  Text,
  Container,
  Button,
  Center,
  Flex,
  Anchor,
} from "@mantine/core";

import {
  primaryColor,
  quaternaryColor,
  secondaryColor,
} from "../../constants/colors";
import { toast } from "react-toastify";
import { login } from "../../../database/service/auth_service";
import { Bars } from "react-loader-spinner";
const LoginPage = () => {
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [wrong, setWrong] = useState("");

  const handleLogin = () => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (email.length === 0 || password.length === 0) {
      setWrong("empty");
      setTimeout(() => {
        setWrong("");
      }, 2000);
    } else if (isValidEmail === false) {
      setWrong("email_format");

      setTimeout(() => {
        setWrong("");
      }, 2000);
    } else if (email.length > 30) {
      setWrong("email_length");
      setTimeout(() => {
        setWrong("");
      }, 2000);
    } else {
      loginFun(email, password);
    }
  };
  const loginFun = async (email: string, password: string) => {
    setLoader(true);
    const res = await login(email, password);
    if (res?.status == true) {
      toast.success("Giriş Başarılı.");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      toast.error("Giriş Başarısız. Lütfen bilgilerinizi kontrol ediniz.");
    }
    setTimeout(() => {
      setLoader(false);
    }, 1000);
  };

  return (
    <div
      style={{
        backgroundImage: "url('/images/bg-login.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100vh",
      }}
    >
      <Center className="width-auth" h={"100%"}>
        <Container
          className="width-auth"
          size={420}
          p="xl"
          style={{
            border: "1px solid " + quaternaryColor,
            backgroundColor: "white",
          }}
        >
          <div
            style={{
              maxWidth: "170px",
              minWidth: "22.5rem",
            }}
          >
            <Center>
              <img
                style={{
                  width: "100px",
                  height: "auto",
                  padding: "1rem",
                }}
                src="/logo.png"
                alt="image"
                className="form-image"
              />
            </Center>
          </div>
          <Title c={primaryColor} order={3} m="xl" className="text-center">
            Fatura Kesme ve Yönetim Sistemi{" "}
          </Title>
          <Text size="sm" className="text-center" mt={5} color={secondaryColor}>
            Fatura takip sayfamıza hoşgeldiniz.
          </Text>
          {wrong === "email_format" && (
            <Text color="red" size="sm" mt={5}>
              E-posta adresinin yazımını kontrol edin (Örn. ad@example.com)
            </Text>
          )}
          {wrong === "wrong_email" && (
            <Text color="red" size="sm" mt={5}>
              Girdiğiniz veriler sistemdeki verilerle eşleşmiyor
            </Text>
          )}
          <TextInput
            mt={"sm"}
            maxLength={30}
            placeholder="Mail Adresi"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          {wrong === "wrong_password" && (
            <Text color="red" size="sm" mt="md">
              Şİfre yanlış
            </Text>
          )}
          {wrong === "password_length" && (
            <Text color="red" size="sm" mt="md">
              Şifre 8 ila 20 karakter arasında olmalıdır
            </Text>
          )}
          <PasswordInput
            placeholder="Password"
            required
            mt="md"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />

          {wrong === "empty" && (
            <Text color="red" size="sm" mt={5}>
              Lütfen boş kutuları doldurunuz
            </Text>
          )}
          <Button
            fullWidth
            mt="xl"
            bg={wrong === "" ? primaryColor : "#ff0000"}
            onClick={() => {
              handleLogin();
            }}
          >
            {loader ? (
              <Bars
                height="20"
                width="80"
                color="white"
                ariaLabel="bars-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            ) : (
              "Giriş Yap"
            )}
          </Button>

          <Flex
            justify="center"
            className="text-center"
            direction="row"
            wrap="wrap"
            mt={"sm"}
          >
            Hesabın yok mu?{" "}
            <Anchor
              underline="never"
              href="/register"
              style={{ color: secondaryColor }}
              ml={"sm"}
            >
              Kayıdol
            </Anchor>
          </Flex>
        </Container>
      </Center>
    </div>
  );
};

export default LoginPage;
