import { Center } from "@mantine/core";
import { FallingLines } from "react-loader-spinner";

const Loader = () => {
    return ( 
        <Center
      style={{
        width: "100%",
        height: window.innerHeight,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

      }}
    >
      <FallingLines
        color="#18216d"
        width="100"
        visible={true}
      />
    </Center>
     );
}
 
export default Loader;
