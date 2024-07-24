import { Button, Flex, Group, Modal, Select, Table, Text, Title } from "@mantine/core";
import { Container } from "react-bootstrap";
import { primaryColor } from "../../constants/colors";
import billsController from "../../../database/db/controller/billsController";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useSelector } from "react-redux";
import { FaRegEye, FaRegTrashAlt } from "react-icons/fa";
const BillsPage = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [preview, setPreview] = useDisclosure(false);

  const user = useSelector((state: any) => state.user.value);
  const [bills, setBills] = useState([]);
  const [bill, setBill] = useState<any>(null);
  const [id, setId] = useState('');
   const fetchBills = async () => {
    try {
      const response = await billsController.index(user.id);
      if (response) {
        setBills(response);
      }
    } catch (err) {
      console.error(err);
    }
  };

      useEffect(() =>{
        fetchBills();
      },[]);
      
  const deleteBill=(id:string)=>{
    open();
    setId(id);

  }
  const handleDelete=async()=>{
      await billsController.destroy(id).then(()=>{
        fetchBills();
        setId("");
        close();
      });
  };


  return <Container className="p-4">
    <Modal opened={opened} onClose={close} title="Müşteriyi silmek istediğinize emin misiniz?" centered>
        <Group justify="end">
          <Button color="red" onClick={handleDelete}>Evet</Button>
          <Button onClick={close}>İptal</Button>
        </Group>
      </Modal>
      {bill&&<Modal opened={preview} title={bill.bill_no} onClose={setPreview.close} centered>
            <Flex>
            <Container>
            <Title order={5} style={{ textAlign:"center" }}>Satıcı Bilgileri</Title>
            <Text>{user.name}</Text>
            </Container>
            <Container>
            <Title order={5} style={{ textAlign:"center" }}>Alıcı Bilgileri</Title>
            <Text>{user.name}</Text>
            </Container>
            </Flex>
            <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
          <Table.Th>Ürünün Adı</Table.Th>
          <Table.Th>Fiyatı</Table.Th>
          <Table.Th>Adeti</Table.Th>
          <Table.Th>Toplam Fiyat</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
           <Table.Tr key={bill.id}>
           <Table.Td>{bill.product.name}</Table.Td>
           <Table.Td>{bill.product.price}₺</Table.Td>
           <Table.Td>{bill.product.count}</Table.Td>
           <Table.Td>{bill.product.price*bill.product.count}₺</Table.Td>
          
         </Table.Tr>
         <Table.Tr >
           <Table.Td colSpan={3}></Table.Td>
           <Table.Td>KDV {(bill.product.price*bill.product.count)*bill.product.tax_rate/100}₺</Table.Td>
         </Table.Tr>
         <Table.Tr >
           <Table.Td colSpan={3}>Toplam</Table.Td>
           <Table.Td>{(bill.product.price*bill.product.count)+(bill.product.price*bill.product.count)*bill.product.tax_rate/100}₺</Table.Td>
         </Table.Tr>
          
        </Table.Tbody>
      </Table>     

      </Modal>}
    <Group justify="space-between">
      <Group>
      <Title order={3}>Faturalarım</Title>

          <Select
            placeholder="Sırala"
            data={["En Yeni", "En Eski"]}
            onChange={(e) => {
              const sortBills = (order: string) => {
                const sorted = [...bills].sort((a:any, b:any) => {
                  if (order === "En Yeni") {
                    return b.created_at.toDate().getTime() - a.created_at.toDate().getTime();
                  } else {
                    return a.created_at.toDate().getTime() - b.created_at.toDate().getTime();
                  }
                });
                setBills(sorted);
              };

              // Kullanımı
              if (e === "En Yeni" || e === "En Eski") {
                sortBills(e);
              }
            }}
          />
        </Group>
      <Button variant="filled" color={primaryColor} onClick={()=>{window.location.pathname="/dashboard/bills"}} radius="lg">Fatura Oluştur</Button>
    </Group>
    <Table.ScrollContainer mt={"sm"} minWidth={500}>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
          <Table.Th>Fatura Numarası</Table.Th>
          <Table.Th>Ürünün Adı</Table.Th>
          <Table.Th>Müşterinin Adı</Table.Th>
          <Table.Th>Müşterinin Mail Adresi</Table.Th>
          <Table.Th>Ürün Fiyatı</Table.Th>
          <Table.Th>Eylemler</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{
           bills.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6} className="text-center">
                    Tüh! Henüz bir faturanız yok.
                </Table.Td>
              </Table.Tr>
            ) : (bills.map((bill:any) => (
              <Table.Tr key={bill.id}>
                <Table.Td>{bill.bill_no}</Table.Td>
                <Table.Td>{bill.product.name}</Table.Td>
                <Table.Td>{bill.client.name}</Table.Td>
                <Table.Td>{bill.client.email}</Table.Td>
                <Table.Td>{bill.product.price * bill.product.count}</Table.Td>
                <Table.Td> <FaRegTrashAlt size={20} onClick={() => deleteBill(bill.id)} color="red"/> <FaRegEye onClick={()=>{
                  setBill(bill);
                  setPreview.open();
                }} size={25} color="blue"/></Table.Td>
              </Table.Tr>
            )))
          
          }</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  </Container>;
};

export default BillsPage;
