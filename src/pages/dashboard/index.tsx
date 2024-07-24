import {Tabs, Title } from "@mantine/core";
import BillsPage from "./bills";
import UsersPage from "./users";
import { PiUsers } from "react-icons/pi";
import { RiBillLine } from "react-icons/ri";
import Header from "../../components/header";
const DashboardPage = () => {

  return (
    <div>
      <Header/>

      <Tabs defaultValue="bills" orientation="vertical">
        <Tabs.List>
        <Tabs.Tab value="bills" leftSection={<RiBillLine  size={25} />}>
            <Title order={5}>Faturalar</Title>
          </Tabs.Tab>
          <Tabs.Tab value="user" leftSection={<PiUsers size={25} />}>
            <Title order={5}>Müşteriler</Title>
          </Tabs.Tab>
          
        </Tabs.List>
        <Tabs.Panel value="user"><UsersPage /></Tabs.Panel>
        <Tabs.Panel value="bills"><BillsPage/></Tabs.Panel>
      </Tabs>
    </div>
  );
};
export default DashboardPage;
