"use client"
import { Text, Input, Button, Box, Avatar, useToast,AlertDialog,AlertDialogOverlay, AlertDialogBody,AlertDialogCloseButton,AlertDialogContent,AlertDialogHeader} from "@chakra-ui/react"
import { useState } from "react"
import { storage } from "../firebaseConfig"
import { uploadBytes, getDownloadURL, ref } from "firebase/storage"
import axios from "axios"
import { useRouter } from "next/navigation"
function SignUp() {
  const router=useRouter()
   let toast= useToast()
   const [isOpen,setIsOpen]=useState(false)
    const [userName, setUserName] = useState("")
    const [EMailAddress, setEMailAddress] = useState("")
    const [bio, setBio] = useState("")
    const [passWord, setPassWord] = useState("")
    const [profilePhotoUrl, setProfilePhotoUrl] = useState("")
    return (
        <Box className="flex flex-col w-full sm:w-full md:w-3/4 lg:w-3/4 xl:w-3/4"  margin="auto" >
             <AlertDialog isOpen={isOpen}>
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <Text fontFamily="NSimSun" fontWeight="bold">Already Registered</Text>
                </AlertDialogHeader>
                <AlertDialogBody display="flex" flexDirection="column" fontFamily="NSimSun" justifyContent="center">
                  <Text textAlign="center">This UserName Is Already Taken</Text>
                  <Text textAlign="center">Try With Another UserName</Text>
                  <Text textAlign="center">OR</Text>
                  <Button onClick={()=>{router.push("/login")}}>LOGIN</Button>
                </AlertDialogBody>
                <AlertDialogCloseButton fontFamily="Josefin Slab" onClick={()=>{setIsOpen(false)}}>Close</AlertDialogCloseButton>
              </AlertDialogContent>
            </AlertDialogOverlay>
           </AlertDialog>
            {
                profilePhotoUrl.length > 0 ? <Avatar size="lg" src={profilePhotoUrl} margin="auto" /> : <Avatar margin="auto" name={userName.at(0)} />
            }

            <Input fontWeight="bold" borderColor="black" placeholder="UserName" fontSize="13px" fontFamily="NSimSun" onChange={(e) => { setUserName(e.target.value) }} />
            <Input fontWeight="bold" borderColor="black" placeholder="EMail" fontSize="13px" fontFamily="NSimSun" onChange={(e) => {
                setEMailAddress(e.target.value)
            }} />
            <Input fontWeight="bold" borderColor="black" placeholder="Bio" fontSize="13px" fontFamily="NSimSun" onChange={(e) => {
                setBio(e.target.value)
            }} />
            <Input fontWeight="bold" borderColor="black" placeholder="PassWord" fontSize="13px" fontFamily="NSimSun" onChange={(e) => {
                setPassWord(e.target.value)
            }} />
            {
profilePhotoUrl.length==0?<Box height="120px" width="100%" borderWidth="1px" backgroundColor="white" borderColor="black" borderRadius="5px" display="flex" flexDirection="column">
                <Text fontFamily="NSimSun" fontWeight="bold" margin="auto" fontSize="13px">PROFILE PHOTO </Text>
                <input type="file" name="file" style={{ fontFamily: "NSimSun",fontSize:"13px",height: 120, width: "100%", margin: "auto" }} onChange={(e) => {
                    async function generateImageUrl() {
                        let selectedImage = e.target.files[0]
                        console.log(selectedImage.type)
                        let storageRef = ref(storage, selectedImage.name)
                        await uploadBytes(storageRef, selectedImage)
                        let selectedImageUrl = await getDownloadURL(storageRef)
                        console.log("URL Generated!")
                        setProfilePhotoUrl(selectedImageUrl)
                    }
                    generateImageUrl()
                }} />
            </Box>:<Text> </Text>
}

            <Button fontFamily="NSimSun" fontSize="13px" onClick={()=>{
               async function createUser()
                {

                    let missingFields = false
                    let user = [userName,EMailAddress,bio,profilePhotoUrl,passWord]
                    for(let attribute of user)
                {
                    if(attribute.length==0)
                    {
                        missingFields=true
                    }
                }
                    if(missingFields)
            {
                toast({title:"Missing Fields!",description:"Please Fill All The Fields",duration:2000,isClosable:true,status:"warning",containerStyle:{fontFamily:"Print Clearly"}})
            }
            else
            {
                  let response= await axios.post("http://127.0.0.1:5050/createaccount",{name:userName,EMailAddress,passWord,bio,profilePhotoUrl})
                  if(response.data.success)
                  {
                     localStorage.setItem("UID",response.data.user._id)
                     localStorage.setItem("EMailAddress",response.data.user.EMailAddress)
                     localStorage.setItem("passWord",response.data.user.passWord)
                     localStorage.setItem("profilePhotoUrl",response.data.user.profilePhotoUrl)
                    console.log(response.data.user)
                    toast({title:"Account Created!", status:"success", description:"Your Account Has Been Created",duration:2000,isClosable:true,containerStyle:{fontFamily:"Print Clearly"}}) 
                  }
                  else if(response.data.success==false && response.data.message=="AlreadyRegistered")
                  {
                    setIsOpen(true)
                  }
                  else 
                  {
                    toast({title:"Failed!",description:"Failed To Create Account",status:"error",duration:2000,isClosable:true,containerStyle:{fontFamily:"Print Clearly"}})
                    console.log("Failed! To Created Account!")
                  }
                }
            }
                createUser()
            }}>Create Account</Button>
        </Box>
    )
}
export default SignUp