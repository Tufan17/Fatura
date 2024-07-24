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
import { createUser } from "../../../database/service/auth_service";

import {
  primaryColor,
  quaternaryColor,
  secondaryColor,
} from "../../constants/colors";
import { toast } from "react-toastify";
import { Bars } from "react-loader-spinner";
const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [taxNO, setTaxNo] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [againPassword, setAgainPassword] = useState("");
  const [loader, setLoader] = useState(false);

  const handleLogin = async () => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    if (email.length === 0) {
      toast.error("Mail alanı boş bırakılamaz");
    } else if (name.length === 0) {
      toast.error("Kurum adı alanı boş bırakılamaz");
    }else if (taxNO.length === 0) {
      toast.error("Vergi numarası alanı boş bırakılamaz");
    }else if (phone.length === 0) {
      toast.error("Telefon numarası alanı boş bırakılamaz");
    } else if (password.length === 0 || againPassword.length === 0) {
      toast.error("Şifre alanları boş bırakılamaz");
    } else if (!isValidEmail) {
      toast.error("E-mail format hatası...");
    } else if (password.length < 6) {
      toast.error("Şifre 6 haneden fazla olmalı...");
    } else if (password !== againPassword) {
      toast.error("Şifreler uyuşmuyor...");
    } else {
      setLoader(true);
      await createUser(email, password, name,taxNO,phone).then((data) => {
        console.log(data);
        if (!data.status) {
          toast.info(
            "Kayıt esnasında bir sorun oluştu lütfen daha sonra deneyiniz...."
          );
        } else {
          toast.success("Kayıt başarıyla gerçekleşti....");
          // setTimeout(() => {
          //   window.location.pathname = "/dashboard";
          // }, 3000);
        }setLoader(false);
      });
    }
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
          className="rounded"
          size={420}
          my={40}
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

          <TextInput
            mt={"sm"}
            maxLength={30}
            placeholder="Mail Adresi"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <TextInput
            mt={"sm"}
            maxLength={30}
            placeholder="İşletme Adı"
            required
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
          <TextInput
            mt={"sm"}
            maxLength={30}
            placeholder="Vergi Numarası"
            required
            value={taxNO}
            onChange={(e) => setTaxNo(e.currentTarget.value)}
          />
          <TextInput
            mt={"sm"}
            placeholder="Telefon Numarası"
            maxLength={11}
            required
            value={phone}
            onChange={(e) => setPhone(e.currentTarget.value)}
          />
          <PasswordInput
            placeholder="Şifre"
            required
            mt="md"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <PasswordInput
            placeholder="Şifreyi Doğrulayın"
            required
            mt="md"
            value={againPassword}
            onChange={(e) => setAgainPassword(e.currentTarget.value)}
          />

          <Button
            fullWidth
            mt="xl"
            bg={primaryColor}
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
            ) :"Kaydol"}
          </Button>

          <Flex
            justify="center"
            className="text-center"
            direction="row"
            wrap="wrap"
            mt={"sm"}
          >
            Hesabın var mı?{" "}
            <Anchor
              underline="never"
              href="/login"
              style={{ color: secondaryColor }}
              ml={"sm"}
            >
              Giriş Yap
            </Anchor>
          </Flex>
        </Container>
      </Center>
    </div>
  );
};

export default RegisterPage;
