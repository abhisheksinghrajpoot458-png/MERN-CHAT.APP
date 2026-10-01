// // import {
// //     Container, Box, Text, Tab,
// //     TabList,
// //     TabPanel,
// //     TabPanels,
// //     Tabs
// // } from '@chakra-ui/react';
// // import React from 'react'
// // import Login from '../components/Authentication/Login';
// // import Signup from '../components/Authentication/Signup';

// // const HomePage = () => {
// //     const history = useHistory();
// //       useEffect(() => {
// //           const userInfo = JSON.parse(localStorage.getItem("userInfo"));
// //           setUser(userInfo);
  
// //           if (!userInfo) {
// //               // Redirect to login page if user is not logged in
// //              history.push("/login");
// //           }
// //       }, [history]);
// //     return(
// //         <Container maxW='xl' centerContent>
// //             <Box
// //                 d="flex"
// //                 justifyContent="center"
// //                 p={3}
// //                 bg="white"
// //                 w="100%"
// //                 m="40px 0 15px 0"
// //                 borderRadius="lg"
// //                 borderWidth="1px"
// //             >
// // <Text fontSize="4xl" fontFamily="work sans " color="black">Welcome </Text>

// //             </Box>
// //             <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
// //                 <Tabs variant='soft-rounded' colorScheme='green'>
// //   <TabList mb='1em'>
// //     <Tab width="50%">Login </Tab>
// //     <Tab width="50%">Sign Up</Tab>
// //   </TabList>
// //   <TabPanels>
// //     <TabPanel> <Login /> </TabPanel>
// //     <TabPanel> <Signup /> </TabPanel>
// //   </TabPanels>
// // </Tabs>
// //         </Box>
// //     </Container>
// //   )
// // };

// // export default HomePage





// import React from "react";

// import {
//     Container,
//     Box,
//     Text,
//     Tab,
//     TabList,
//     TabPanel,
//     TabPanels,
//     Tabs,
// } from "@chakra-ui/react";

// import Login from "../components/Authentication/Login";
// import Signup from "../components/Authentication/Signup";


// const HomePage = () => {
//     return (
//         <Container maxW="xl" centerContent>

//             {/* Welcome Header */}
//             <Box
//                 display="flex"
//                 justifyContent="center"
//                 p={3}
//                 bg="white"
//                 w="100%"
//                 m="40px 0 15px 0"
//                 borderRadius="lg"
//                 borderWidth="1px"
//             >
//                 <Text
//                     fontSize="4xl"
//                     fontFamily="Work Sans"
//                     color="black"
//                 >
//                     Welcome
//                 </Text>
//             </Box>


//             {/* Login / Signup */}
//             <Box
//                 bg="white"
//                 w="100%"
//                 p={4}
//                 borderRadius="lg"
//                 borderWidth="1px"
//             >
//                 <Tabs
//                     variant="soft-rounded"
//                     colorScheme="green"
//                 >
//                     <TabList mb="1em">
//                         <Tab width="50%">
//                             Login
//                         </Tab>

//                         <Tab width="50%">
//                             Sign Up
//                         </Tab>
//                     </TabList>

//                     <TabPanels>
//                         <TabPanel>
//                             <Login />
//                         </TabPanel>

//                         <TabPanel>
//                             <Signup />
//                         </TabPanel>
//                     </TabPanels>
//                 </Tabs>
//             </Box>

//         </Container>
//     );
// };


// export default HomePage;



import React from "react";

import {
    Container,
    Box,
    Text,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
} from "@chakra-ui/react";

import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";


const HomePage = () => {
    return (
        <Container
            maxW="xl"
            centerContent
        >

            {/* Header */}
            <Box
                display="flex"
                justifyContent="center"
                p={3}
                bg="white"
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
            >
                <Text
                    fontSize="4xl"
                    fontFamily="Work Sans"
                    color="black"
                >
                    Talk-A-Tive
                </Text>
            </Box>


            {/* Login / Signup */}
            <Box
                bg="white"
                w="100%"
                p={4}
                borderRadius="lg"
                borderWidth="1px"
            >

                <Tabs
                    variant="soft-rounded"
                    colorScheme="green"
                >

                    <TabList mb="1em">

                        <Tab width="50%">
                            Login
                        </Tab>

                        <Tab width="50%">
                            Sign Up
                        </Tab>

                    </TabList>


                    <TabPanels>

                        <TabPanel>
                            <Login />
                        </TabPanel>

                        <TabPanel>
                            <Signup />
                        </TabPanel>

                    </TabPanels>

                </Tabs>

            </Box>

        </Container>
    );
};


export default HomePage;

