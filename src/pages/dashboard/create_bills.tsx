import { useEffect, useState } from "react";
import {
  TextInput,
  Textarea,
  NumberInput,
  Group,
  Container,
  Select,
  Button,
} from "@mantine/core";
import Header from "../../components/header";
import { useSelector } from "react-redux";
import clientController from "../../../database/db/controller/clientController";
import { toast } from "react-toastify";
import billsController from "../../../database/db/controller/billsController";
import { Bars } from "react-loader-spinner";

  
const CreateBillsPage = () => {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [sellerAddress, setSellerAddress] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
  const [sellerTaxNumber, setSellerTaxNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerTaxNumber, setCustomerTaxNumber] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [itemUnitPrice, setItemUnitPrice] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(18);
  const [discount, setDiscount] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");
  const user = useSelector((state: any) => state.user.value);
  const [clients, setClients] = useState([]);
  const [selectDatas, setSelectDatas] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [loader, setLoader] = useState(false);
  
  const fetchClients = async () => {
    try {
      const response = await clientController.index(user.id);
      if (response) {
        setClients(response);
        setSelectDatas(response.map((item:any) => {
          return { value: item.id, label: item.name };
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  function generateRandomNumber() {
    const randomNumber = Math.floor(Math.random() * 1000000000000)
      .toString()
      .padStart(12, "0");
    const formattedNumber = `${randomNumber.slice(0, 4)}-${randomNumber.slice(
      4,
      8
    )}-${randomNumber.slice(8)}`;
    return formattedNumber;
  }
  useEffect(() => {
    fetchClients();
    const randomFormattedNumber = generateRandomNumber();

    setInvoiceNumber(randomFormattedNumber);
    setSellerName(user.name);
    setSellerAddress(user.address);
    setSellerPhone(user.phone);
    setSellerEmail(user.email);
    setSellerTaxNumber(user.tax_no);
  }, []);
  const handleChange = (value: string | number | undefined) => {
    if (typeof value === 'number') {
      return value;
    } else if (typeof value === 'string') {
      return parseInt(value, 10);
    } else {
      return 0;
    }
  };
  console.log(invoiceNumber);
  const handleSaveInvoice=async()=>{
    if (!invoiceNumber || !sellerName || !sellerAddress || !sellerPhone || !sellerEmail || !sellerTaxNumber ||
        !customerName || !customerAddress || !customerPhone || !customerEmail || !customerTaxNumber ||
        !itemName || itemQuantity <= 0 || itemUnitPrice <= 0) {
      toast.error("Lütfen tüm gerekli alanları doldurduğunuzdan emin olun.");
      return;
    }
    setLoader(true);
    try {
      const data={
        owner_id: user.id,
        seller: user,
        bill_no:invoiceNumber,
        client:customer,
        product: {
            name:itemName,
            count:itemQuantity,
            price:itemUnitPrice,
            tax_rate:taxRate,
            discount:discount,
            notes:notes,
            terms:terms,
        }
      };
      billsController.create(data).then((response:any) => {
            if(response){
                toast.success("Fatura başarıyla kaydedildi.");
                setTimeout(() => {
                    window.location.pathname = "/dashboard";
                  }, 3000);
            }
            setLoader(false);
        });
     
    } catch (error) {
      toast.error("Fatura kaydedilirken bir hata oluştu.");
      setLoader(false);
      
    }
  
  };
  return (
    <>
      <Header />

      <Container>
        <Group>
          <div className="col">
            <TextInput
              label="Fatura Numarası"
              disabled
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.currentTarget.value)}
              required
            />
            <TextInput
              label="Satıcı Adı"
              disabled
              value={sellerName}
              onChange={(e) => setSellerName(e.currentTarget.value)}
              required
            />
            <Textarea
              label="Satıcı Adresi"
              disabled
              value={sellerAddress}
              onChange={(e) => setSellerAddress(e.currentTarget.value)}
              required
            />
            <TextInput
              disabled
              label="Satıcı Telefon Numarası"
              value={sellerPhone}
              onChange={(e) => setSellerPhone(e.currentTarget.value)}
              required
            />
            <TextInput
              disabled
              label="Satıcı Email Adresi"
              value={sellerEmail}
              onChange={(e) => setSellerEmail(e.currentTarget.value)}
              required
            />
            <TextInput
              disabled
              label="Satıcı Vergi Numarası"
              value={sellerTaxNumber}
              onChange={(e) => setSellerTaxNumber(e.currentTarget.value)}
              required
            />
          </div>
          <div className="col">
          <Select
            checkIconPosition="right"
            data={selectDatas}
            label="Müşteri Seçiniz"
            placeholder="Müşteriler"
            defaultValue="React"
            onChange={(e) => {
                if(e){
                    const data:any = clients.find((client: any) => client.id === e);
                    setCustomer(data);
                    setCustomerName(data.name);
                    setCustomerAddress(data.address);
                    setCustomerEmail(data.email);
                    setCustomerPhone(data.phone);
                    setCustomerTaxNumber(data.tax_no);
                }

            }}
            />
            <TextInput
              label="Müşteri Adı"
              value={customerName}
              onChange={(e) => setCustomerName(e.currentTarget.value)}
              required
              disabled
            />
            <Textarea
              label="Müşteri Adresi"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.currentTarget.value)}
              disabled
              required
            />
            <TextInput
              label="Müşteri Telefon Numarası"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.currentTarget.value)}
              required
              disabled
            />
            <TextInput
              label="Müşteri Email Adresi"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.currentTarget.value)}
              disabled
              required
            />
            <TextInput
              label="Müşteri Vergi Numarası"
              value={customerTaxNumber}
              onChange={(e) => setCustomerTaxNumber(e.currentTarget.value)}
              disabled
              required
            />
          </div>
        </Group>

        <TextInput
          label="Ürün/Hizmet Adı"
          value={itemName}
          onChange={(e) => setItemName(e.currentTarget.value)}
          required
        />
        <Textarea
          label="Açıklama"
          value={itemDescription}
          onChange={(e) => setItemDescription(e.currentTarget.value)}
        />
        <NumberInput
          label="Miktar"
          value={itemQuantity}
          onChange={(value) => setItemQuantity(handleChange(value))}
          required
        />
        <NumberInput
          label="Birim Fiyat"
          value={itemUnitPrice}
          onChange={(value) => setItemUnitPrice(handleChange(value))}
          required
        />
        <NumberInput
          label="Vergi Oranı (%)"
          value={taxRate}
          onChange={(value) => setTaxRate(handleChange(value))}
          required
        />
        <NumberInput
          label="İndirim"
          value={discount}
          onChange={(value) => setDiscount(handleChange(value))}
          min={0}
        />

        <Textarea
          label="Notlar"
          value={notes}
          onChange={(e) => setNotes(e.currentTarget.value)}
        />
        <Textarea
          label="Şartlar ve Koşullar"
          value={terms}
          onChange={(e) => setTerms(e.currentTarget.value)}
        />

        <Group justify="center" m="md">
          <Button variant="filled" color="green" onClick={handleSaveInvoice}>{loader ? (
              <Bars
                height="20"
                width="80"
                color="white"
                ariaLabel="bars-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            ) :"Faturayı Kaydet"}</Button>
        </Group>
      </Container>
    </>
  );
};

export default CreateBillsPage;
