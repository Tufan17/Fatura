import {
  Button,
  Modal,
  Group,
  Table,
  Title,
  Text,
  TextInput,
  Center,
  Select,
  Input,
} from "@mantine/core";
import { Container } from "react-bootstrap";
import { primaryColor } from "../../constants/colors";
import { TiUserAdd } from "react-icons/ti";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { IoSaveOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import clientController from "../../../database/db/controller/clientController";
import { useSelector } from "react-redux";
import { FaRegTrashAlt } from "react-icons/fa";
import { Timestamp } from "firebase/firestore";

interface Client {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  created_at: Timestamp
}

const UsersPage = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [openedTrash, trashButton] = useDisclosure(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [tax, setTax] = useState("");
  const [phone, setPhone] = useState("");
  const user = useSelector((state: any) => state.user.value);
  const [clients, setClients] = useState<Client[]>([]);
  const [oldClients, setClientsOld] = useState<Client[]>([]);
  const [, setError] = useState<string | null>(null);
  const [id, setId] = useState("");

  const fetchClients = async () => {
    try {
      const response = await clientController.index(user.id);
      if (response) {
        setClients(response);
        setClientsOld(response);
      }
    } catch (err) {
      setError("Failed to fetch clients");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [user.id]);

  const deleteClient = async (id: string) => {
    trashButton.open();
    setId(id);
  };

  const handleDelete = async () => {
    try {
      await clientController.destroy(id);
      toast.success("Müşteri başarıyla silindi.");
      fetchClients(); // Refresh the list after deletion
    } catch (err) {
      toast.error("Müşteri silinirken bir hata oluştu.");
      console.error(err);
    } finally {
      trashButton.close();
    }
  };
  const save = async () => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (name.length === 0) {
      toast.error("Müşteri ismini boş bırakamazsınız...");
    } else if (email.length === 0) {
      toast.error("Mail alanını doldurunuz...");
    } else if (!isValidEmail) {
      toast.error("Mail formatı hatalı...");
    } else if (address.length === 0) {
      toast.error("Adresi boş bırakamazsınız...");
    } else if (phone.length === 0) {
      toast.error("Telefon numarası alanını boş bırakamazsınız...");
    } else if (tax.length === 0) {
      toast.error("Tax numarası alanını boş bırakamazsınız...");
    } else {
      try {
        const data = await clientController.create({
          name: name,
          phone: phone,
          email: email,
          address: address,
          owner_id: user.id,
          tax_no: tax,
        });
        if (data) {
          toast.success("Müşteri kaydı başarıyla gerçekleşti.");
          setName("");
          setEmail("");
          setAddress("");
          setPhone("");
          setTax("");
          close();
          fetchClients();
        }
      } catch (err) {
        toast.error("Müşteri kaydedilirken bir hata oluştu.");
        console.error(err);
      }
    }
  };

  console.log(clients);
  return (
    <Container className="p-4">
      <Modal
        opened={openedTrash}
        onClose={close}
        title="Müşteriyi silmek istediğinize emin misiniz?"
        centered
      >
        <Group justify="end">
          <Button color="red" onClick={handleDelete}>
            Evet
          </Button>
          <Button onClick={trashButton.close}>İptal</Button>
        </Group>
      </Modal>
      <Modal opened={opened} onClose={close} title="Müşteri Ekle" centered>
        <Group ml={"md"}>
          <Text mt={"sm"} w={"100px"}>
            Adı - Soyadı :
          </Text>
          <TextInput
            mt={"sm"}
            maxLength={30}
            placeholder="Müşteri Adı Soyadı"
            required
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </Group>
        <Group ml={"md"}>
          <Text mt={"sm"} w={"100px"}>
            Mail Adresi :
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
        </Group>
        <Group ml={"md"}>
          <Text mt={"sm"} w={"100px"}>
            Adresi :
          </Text>
          <TextInput
            mt={"sm"}
            maxLength={50}
            placeholder="Müşteri Adresi"
            required
            value={address}
            onChange={(e) => setAddress(e.currentTarget.value)}
          />
        </Group>
        <Group ml={"md"}>
          <Text mt={"sm"} w={"100px"}>
            Tel :
          </Text>
          <TextInput
            mt={"sm"}
            maxLength={11}
            placeholder="Telefon Numarası"
            required
            type="phone"
            value={phone}
            onChange={(e) => setPhone(e.currentTarget.value)}
          />
        </Group>
        <Group ml={"md"}>
          <Text mt={"sm"} w={"100px"}>
            Tax :
          </Text>
          <TextInput
            mt={"sm"}
            placeholder="Vergi Numarası"
            required
            value={tax}
            onChange={(e) => setTax(e.currentTarget.value)}
          />
        </Group>
        <Center mt={"md"}>
          <Button variant="filled" color={"green"} radius="lg" onClick={save}>
            <IoSaveOutline size={25} style={{ paddingRight: "5px" }} /> Kaydet
          </Button>
        </Center>
      </Modal>
      <Group justify="space-between">
        <Group>
          <Title order={3}>Müşterilerimiz</Title>
          <Select
            placeholder="Sırala"
            data={["En Yeni", "En Eski"]}
            onChange={(e) => {
              const sortClients = (order: string) => {
                const sorted = [...clients].sort((a, b) => {
                  if (order === "En Yeni") {
                    return b.created_at.toDate().getTime() - a.created_at.toDate().getTime();
                  } else {
                    return a.created_at.toDate().getTime() - b.created_at.toDate().getTime();
                  }
                });
                setClients(sorted);
              };

              if (e === "En Yeni" || e === "En Eski") {
                sortClients(e);
              }
            }}
          />
          <Input placeholder="Müşteri Ara" onChange={(e)=>{
            console.log(e.target.value);

            const data=oldClients.filter(client => client.name.includes(e.target.value));
            setClients(data);
          }} />
        </Group>
        <Button
          variant="filled"
          color={primaryColor}
          radius="lg"
          onClick={open}
        >
          <TiUserAdd size={25} style={{ paddingRight: "5px" }} /> Ekle
        </Button>
      </Group>
      <Table.ScrollContainer mt={"sm"} minWidth={500}>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Müşteri Numarası</Table.Th>
              <Table.Th>Adı-Soyadı</Table.Th>
              <Table.Th>Mail Adresi</Table.Th>
              <Table.Th>Adresi</Table.Th>
              <Table.Th>Telefon Numarası</Table.Th>
              <Table.Th>Eylemler</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {clients.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6} className="text-center">
                  Tüh! Her hangi bir müşteriniz yok.
                </Table.Td>
              </Table.Tr>
            ) : (
              clients.map((client) => (
                <Table.Tr key={client.id}>
                  <Table.Td>{client.id}</Table.Td>
                  <Table.Td>{client.name}</Table.Td>
                  <Table.Td>{client.email}</Table.Td>
                  <Table.Td>{client.address}</Table.Td>
                  <Table.Td>{client.phone}</Table.Td>
                  <Table.Td>
                    <FaRegTrashAlt
                      size={25}
                      onClick={() => deleteClient(client.id)}
                      color="red"
                    />
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Container>
  );
};

export default UsersPage;
