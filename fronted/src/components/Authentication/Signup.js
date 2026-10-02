

// import React, { useState } from "react";
// import axios from "axios";
// import { useHistory } from "react-router-dom";

// import {
//   Button,
//   FormControl,
//   FormLabel,
//   Input,
//   InputGroup,
//   InputRightElement,
//   VStack,
//   useToast,
// } from "@chakra-ui/react";

// const Signup = () => {
//   const [show, setShow] = useState(false);

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [cpassword, setCPassword] = useState("");
//   const [pic, setPic] = useState("");

//   const [loading, setLoading] = useState(false);

//   const toast = useToast();
//   const history = useHistory();

//   // Show / Hide Password
//   const handleClick = () => {
//     setShow((prev) => !prev);
//   };

//   // Upload Image to Cloudinary
//   const postDetails = async (pics) => {
//     if (!pics) {
//       return;
//     }

//     // Check image type
//     if (pics.type !== "image/jpeg" && pics.type !== "image/png") {
//       toast({
//         title: "Please select a JPG or PNG image!",
//         status: "warning",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });

//       return;
//     }

//     // Check image size - 2MB
//     if (pics.size > 2 * 1024 * 1024) {
//       toast({
//         title: "Image size should be less than 2MB!",
//         status: "warning",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });

//       return;
//     }

//     try {
//       setLoading(true);

//       const data = new FormData();

//       data.append("file", pics);
//       data.append("upload_preset", "chat-app");

//       const response = await fetch(
//         "https://api.cloudinary.com/v1_1/tyo1eclb/image/upload",
//         {
//           method: "POST",
//           body: data,
//         }
//       );

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.error?.message || "Image upload failed"
//         );
//       }

//       setPic(result.url);

//       toast({
//         title: "Image Uploaded Successfully!",
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//         position: "bottom",
//       });
//     } catch (error) {
//       console.error("Cloudinary Error:", error);

//       toast({
//         title: "Image Upload Failed!",
//         description: error.message || "Unable to upload image",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Register User
//   const submitHandler = async () => {
//     // Check all fields
//     if (!name.trim() || !email.trim() || !password || !cpassword) {
//       toast({
//         title: "Please fill all the fields",
//         status: "warning",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });

//       return;
//     }

//     // Check password length
//     if (password.length < 6) {
//       toast({
//         title: "Password must be at least 6 characters",
//         status: "warning",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });

//       return;
//     }

//     // Check password match
//     if (password !== cpassword) {
//       toast({
//         title: "Passwords do not match",
//         status: "warning",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });

//       return;
//     }

//     try {
//       setLoading(true);

//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       };

//       // IMPORTANT:
//       // package.json has proxy:
//       // "proxy": "http://localhost:5000"
//       const { data } = await axios.post(
//         "/api/user",
//         {
//           name: name.trim(),
//           email: email.trim().toLowerCase(),
//           password,
//           pic,
//         },
//         config
//       );

//       // Save logged-in user information
//       localStorage.setItem("userInfo", JSON.stringify(data));

//       toast({
//         title: "Registration Successful!",
//         description: "Welcome to Chat App",
//         status: "success",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });

//       // Go to chats
//       history.push("/chats");
//     } catch (error) {
//       console.error("Signup Error:", error);

//       toast({
//         title: "Registration Failed!",
//         description:
//           error.response?.data?.message ||
//           error.message ||
//           "Something went wrong",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <VStack spacing="5px" color="black">

//       {/* Name */}
//       <FormControl id="name" isRequired>
//         <FormLabel>Name</FormLabel>

//         <Input
//           type="text"
//           placeholder="Enter Your Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//       </FormControl>

//       {/* Email */}
//       <FormControl id="email" isRequired>
//         <FormLabel>Email</FormLabel>

//         <Input
//           type="email"
//           placeholder="Enter Your Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//       </FormControl>

//       {/* Password */}
//       <FormControl id="password" isRequired>
//         <FormLabel>Password</FormLabel>

//         <InputGroup>
//           <Input
//             type={show ? "text" : "password"}
//             placeholder="Enter Your Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           <InputRightElement width="4.5rem">
//             <Button
//               h="1.75rem"
//               size="sm"
//               onClick={handleClick}
//             >
//               {show ? "Hide" : "Show"}
//             </Button>
//           </InputRightElement>
//         </InputGroup>
//       </FormControl>

//       {/* Confirm Password */}
//       <FormControl id="cpassword" isRequired>
//         <FormLabel>Confirm Password</FormLabel>

//         <InputGroup>
//           <Input
//             type={show ? "text" : "password"}
//             placeholder="Confirm Your Password"
//             value={cpassword}
//             onChange={(e) => setCPassword(e.target.value)}
//           />

//           <InputRightElement width="4.5rem">
//             <Button
//               h="1.75rem"
//               size="sm"
//               onClick={handleClick}
//             >
//               {show ? "Hide" : "Show"}
//             </Button>
//           </InputRightElement>
//         </InputGroup>
//       </FormControl>

//       {/* Profile Picture */}
//       <FormControl id="pic">
//         <FormLabel>Upload Your Picture</FormLabel>

//         <Input
//           type="file"
//           p={1.5}
//           accept="image/jpeg,image/png"
//           onChange={(e) => postDetails(e.target.files[0])}
//         />
//       </FormControl>

//       {/* Signup Button */}
//       <Button
//         colorScheme="blue"
//         width="100%"
//         style={{ marginTop: 15 }}
//         onClick={submitHandler}
//         isLoading={loading}
//         loadingText="Creating Account..."
//       >
//         Sign Up
//       </Button>
//     </VStack>
//   );

import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";

const Signup = () => {
  const [show, setShow] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [pic, setPic] = useState("");

  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const history = useHistory();

  // Backend API URL
  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://mern-chat-app-3oqx.onrender.com";

  // Show / Hide Password
  const handleClick = () => {
    setShow((prev) => !prev);
  };

  // Upload Image to Cloudinary
  const postDetails = async (pics) => {
    if (!pics) {
      return;
    }

    // Check image type
    if (pics.type !== "image/jpeg" && pics.type !== "image/png") {
      toast({
        title: "Please select a JPG or PNG image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      return;
    }

    // Check image size - 2MB
    if (pics.size > 2 * 1024 * 1024) {
      toast({
        title: "Image size should be less than 2MB!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("file", pics);
      data.append("upload_preset", "chat-app");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/tyo1eclb/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error?.message || "Image upload failed"
        );
      }

      setPic(result.url);

      toast({
        title: "Image Uploaded Successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.error("Cloudinary Error:", error);

      toast({
        title: "Image Upload Failed!",
        description: error.message || "Unable to upload image",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  // Register User
  const submitHandler = async () => {
    // Check all fields
    if (!name.trim() || !email.trim() || !password || !cpassword) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      return;
    }

    // Check password length
    if (password.length < 6) {
      toast({
        title: "Password must be at least 6 characters",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      return;
    }

    // Check password match
    if (password !== cpassword) {
      toast({
        title: "Passwords do not match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Production + Local API request
      const { data } = await axios.post(
        `${API_URL}/api/user`,
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          pic,
        },
        config
      );

      // Save logged-in user information
      localStorage.setItem("userInfo", JSON.stringify(data));

      toast({
        title: "Registration Successful!",
        description: "Welcome to Chat App",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      // Go to chats
      history.push("/chats");
    } catch (error) {
      console.error("Signup Error:", error);

      toast({
        title: "Registration Failed!",
        description:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px" color="black">

      {/* Name */}
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>

        <Input
          type="text"
          placeholder="Enter Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      {/* Email */}
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>

        <Input
          type="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      {/* Password */}
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>

        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={handleClick}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      {/* Confirm Password */}
      <FormControl id="cpassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>

        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm Your Password"
            value={cpassword}
            onChange={(e) => setCPassword(e.target.value)}
          />

          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={handleClick}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      {/* Profile Picture */}
      <FormControl id="pic">
        <FormLabel>Upload Your Picture</FormLabel>

        <Input
          type="file"
          p={1.5}
          accept="image/jpeg,image/png"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      {/* Signup Button */}
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
        loadingText="Creating Account..."
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;

// };

// export default Signup;

