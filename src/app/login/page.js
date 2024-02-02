"use client"
import { Box, Input, Button, IconButton, useToast, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogCloseButton, Text } from "@chakra-ui/react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
function Login() {
 const router= useRouter()
  let toast = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [EMailAddress, setEMailAddress] = useState("")
  const [password, setPassWord] = useState("")
  return (
    <Box margin="auto" justifyContent="center" alignItems="center" className="flex flex-col w-full sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/3">
      <AlertDialog isOpen={isOpen} onClose={()=>{setIsOpen(false)}}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>
              <Text fontFamily="NSimSun">Not Registered</Text>
            </AlertDialogHeader>
            <AlertDialogBody fontFamily="NSimSun" display="flex" flexDirection="column" justifyContent="center">
              <Text textAlign="center">This Username Is Not Registered Yet!</Text>
               <Text textAlign="center"> Login With Another Username
              </Text>
              <Text textAlign="center">OR</Text>
            <Button fontFamily="NSimSun" onClick={()=>{router.push("/signup")}}>Create Account</Button>
            </AlertDialogBody>
            <AlertDialogCloseButton onClick={() => { setIsOpen(false) }}>Close</AlertDialogCloseButton>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Text color="green" fontFamily="NSimSun" fontWeight="bold" fontSize="13px">CHATTY</Text>
      <Input fontWeight="bold" marginTop="20px" borderColor="black" placeholder="EMail Address" fontFamily="NSimSun" fontSize="13px" onChange={(e) => { setEMailAddress(e.target.value) }} />
      <Input fontWeight="bold" borderColor="black" placeholder="PassWord" fontFamily="NSimSun" fontSize="13px" onChange={(e) => {
        setPassWord(e.target.value)
      }} />
      <Button fontFamily="NSimSun" fontSize="13px"  onClick={() => {
        async function login() {
          console.log(EMailAddress)
          console.log(password)
          if(EMailAddress.length>0&&password.length>0)
          {
          
            let response = await axios.post("http://127.0.0.1:5050/login", { EMailAddress,passWord:password })
            if (response.data.success) {
              let user = response.data.user
              console.log(user)
              localStorage.setItem("UID", user._id)
              localStorage.setItem("EMailAddress", user.EMailAddress)
              localStorage.setItem("passWord", user.passWord)
              localStorage.setItem("profilePhotoUrl", user.profilePhotoUrl)
              toast({ title: "Success", description: "You Are Successfully Logged In", isClosable: true, duration: 2000, status: "success", containerStyle: { fontFamily: "Print Clearly" } })
            }
            else if (response.data.success == false && response.data.message == "NotRegistered") {
              console.log(response.data)
              setIsOpen(true)
            }
            else if (response.data.success == false && response.data.message == "Incorrect Password") {
              console.log(response.data)
              toast({ title: "Failed!", description: "Password Is Incorrect!", status: "error", isClosable: true, duration: 2000, containerStyle: { fontFamily: "Print Clearly" } })
            }
            else if (response.data.success == false && response.data.message == "Failed") {
              console.log(response.data)
              toast({ title: "Failed!", description: "There Was Some Problem While Logging In", status: "error", isClosable: true, duration: 2000, containerStyle: { fontFamily: "Print Clearly" } })
            }
        }
        else
        {
          toast({title:"Missing Fields",description:"Please Fill All The Fields",isClosable:true,duration:2000,status:"info",containerStyle:{fontFamily:"Print Clearly"}})
        }
      }
        login()
      }} >LOGIN</Button>
    </Box>
  )
}
export default Login