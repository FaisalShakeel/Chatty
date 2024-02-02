"use client"
import { Text, Box, Card, Avatar, HStack, Input, IconButton, Container, useToast, Menu, MenuButton, MenuList, Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogBody, Center, CircularProgress } from '@chakra-ui/react'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import storage from '@/app/firebaseConfig'
import { uploadBytes, getDownloadURL, ref } from "firebase/storage"
function Chat() {
    let toast = useToast()
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
    const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false)
    const { receiverId } = useParams()
    console.log(receiverId)
    const [text, setText] = useState("")
    const [messages, setMessages] = useState([])
    const [mediaType, setMediaType] = useState("")
    const [mediaURL, setMediaURL] = useState("")
    const [receiver, setReceiver] = useState({})
    let getMessagesAndReceiver = async () => {
        let response = await axios.get(`http://127.0.0.1:5050/getmessages/${localStorage.getItem("UID")}/${receiverId}`)
        let _response = await axios.get(`http://127.0.0.1:5050/getuser/${receiverId}`)
        console.log(receiverId)

        if (response.data.success && _response.data.success) {
            setReceiver(_response.data.user)
            setMessages(response.data.messages)
        }
        else {
        }
    }
    useEffect(() => {
        if (Object.keys(receiver).length == 0) {

            setInterval(() => { console.log("Getting    Messages"); getMessagesAndReceiver() }, 5000)

        }
    })
    return (<Box height="100%" width="100%" display="flex" flexDirection="column" >
        <AlertDialog onClose={() => { setIsImageDialogOpen(false) }} isOpen={isImageDialogOpen}>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogBody fontFamily="NSimSun" display="flex" flexDirection="column">
                        <Text textAlign="center">SELECT PHOTO</Text>
                        <Input type='file' accept='/image' onChange={async (e) => {
                            let selectedImage = e.target.files[0]
                            let storageRef = ref(storage, selectedImage.name + Math.random().toString())
                            await uploadBytes(storageRef, selectedImage)
                            let imageUrl = await getDownloadURL(storageRef)
                            setMediaURL(imageUrl)
                            setMediaType("PHOTO")
                        }} />
                        {mediaURL.length > 0 && mediaType == "PHOTO" ? <img src={mediaURL} /> : <Center><CircularProgress isIndeterminate color='black'></CircularProgress></Center>}
                        <Button onClick={() => {
                            async function sendMessage() {
                                console.log("Sending PHOTO Message")
                                if (mediaURL.length > 0 && mediaType == "PHOTO") {
                                    console.log(mediaURL)
                                    console.log(mediaType)

                                    console.log("Calling API")
                                    let response = await axios.post(`http://127.0.0.1:5050/addmessage/${localStorage.getItem("UID")}/${receiverId}`, { text: "", mediaUrl: mediaURL, mediaType })
                                    console.log(response.data.success)
                                    if (response.data.success) {

                                        console.log("Added Message")
                                        toast({ title: "Success", description: "Message Sent Successfully", status: "success", isClosable: true, duration: 2000, containerStyle: { fontFamily: "Print Clearly" } })
                                    }
                                    else {
                                        toast({ title: "Something Went Wrong", description: "Something Went Wrong While Sending Message", status: "error", isClosable: true, duration: 2000, containerStyle: { fontFamily: "Print Clearly" } })
                                    }

                                }
                                else {
                                    toast({ title: "Something Went Wrong", description: "Something Went Wrong While Sending Message", status: "error", isClosable: true, duration: 2000, containerStyle: { fontFamily: "Print Clearly" } })
                                }
                            }
                            sendMessage()
                        }}>SEND</Button>
                    </AlertDialogBody>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
        <AlertDialog onClose={() => { setIsVideoDialogOpen(false) }} isOpen={isVideoDialogOpen}>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogBody fontFamily="NSimSun" display="flex" flexDirection="column">
                        <Text textAlign="center" >SELECT VIDEO</Text>
                        <Input type='file' accept='video/' onChange={async (e) => {
                            let selectedVideo = e.target.files[0]
                            let storageRef = ref(storage, selectedVideo.name + Math.random().toString())
                            await uploadBytes(storageRef, selectedVideo)
                            let videoUrl = await getDownloadURL(storageRef)
                            setMediaURL(videoUrl)
                            setMediaType("VIDEO")
                        }} />
                        {mediaURL.length > 0 && mediaType == "VIDEO" ? <ReactPlayer height="100%" width="100%" controls={true} url={mediaURL}></ReactPlayer> : <Center><CircularProgress isIndeterminate color='black'></CircularProgress></Center>}
                        <Button onClick={() => {
                            async function sendMessage() {
                                if (mediaURL.length > 0 && mediaType == "VIDEO") {
                                    let response = await axios.post(`http://127.0.0.1:5050/addmessage/${localStorage.getItem("UID")}/${receiverId}`, { text: "", mediaUrl: mediaURL, mediaType })
                                    if (response.data.success) {


                                        console.log("Added Message")
                                        toast({ title: "Success", description: "Message Sent Successfully", status: "success", isClosable: true, duration: 2000, containerStyle: { fontFamily: "Print Clearly" } })
                                    }
                                    else {
                                        toast({ title: "Something Went Wrong", description: "Something Went Wrong While Sending Message", status: "error", isClosable: true, duration: 2000, containerStyle: { fontFamily: "Print Clearly" } })
                                    }

                                }
                                else {
                                    toast({ title: "Something Went Wrong", description: "Something Went Wrong While Sending Message", status: "error", isClosable: true, duration: 2000, containerStyle: { fontFamily: "Print Clearly" } })
                                }
                            }
                            sendMessage()
                        }}>SEND</Button>
                    </AlertDialogBody>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
        <Card display="flex" flexDirection="row" justifyContent="space-between">
            <Avatar src={receiver.profilePhotoUrl} />
            <Text fontFamily="NSimSun" fontSize="15px" fontWeight="bold">{receiver.name}</Text>
            <Menu>
                <MenuButton>
                    <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkCJMzKi3IqiFOM8LwR668vqngxUGMsxDoBQ&usqp=CAU' style={{height:25,width:30}} />
                </MenuButton>
                <MenuList fontFamily="SimSun" display="flex" flexDirection="column" justifyContent="center" fontWeight="bold">
                    <button style={{margin:"auto"}}>Delete Chat</button>
                </MenuList>
            </Menu>
        </Card>
        <Box width="100%">
            {
                messages.map((message) => {
                    if (message.senderId == localStorage.getItem("UID") && message.text.length > 0) {
                        return (<Card display="flex" flexDirection="column" marginLeft="auto" style={{width:"180px"}}><Text fontFamily="NSimSun">{message.text}</Text> <Text fontFamily="SimSun" fontSize="11px" fontWeight="bold">{message.addedON}</Text></Card>)
                    }
                    else if (message.senderId == receiverId && message.text.length > 0) {
                        return (<Card display="flex" flexDirection="column" style={{width:"180px"}}><Text fontFamily="NSimSun">{message.text}</Text> <Text fontFamily="SimSun" fontWeight="bold" fontSize="11px" >{message.addedON}</Text></Card>)
                    }
                    else if (message.senderId == localStorage.getItem("UID") && message.mediaUrl.length > 0 && message.mediaType == "PHOTO") {
                        return (<Card marginTop="5px" marginLeft="auto" display="flex" flexDirection="column" width="200px" height="375px"><img height="375px" width="270px" src={message.mediaUrl} style={{ marginLeft: "auto" }} /> <Text fontFamily="SimSun" textAlign="right" fontWeight="bold" fontSize="11px">{message.addedON}</Text> </Card>)
                    }
                    else if (message.senderId == receiverId && message.mediaUrl.length > 0 && message.mediaType == "PHOTO") {
                        return (<Card marginTop="5px" width="200px" display="flex" flexDirection="column" height="375px"><img height="375px"  width="200px" src={message.mediaUrl} style={{ marginRight: "auto" }} /> <Text fontFamily="SimSun" fontWeight="bold" fontSize="11px" textAlign="right">{message.addedON}</Text> </Card>)
                    }
                    else if (message.senderId == localStorage.getItem("UID") && message.mediaUrl.length > 0 && message.mediaType == "VIDEO") {
                        return (<Card display="flex" flexDirection="column"  marginTop="5px" width="200px" height="375px" marginLeft="auto"><ReactPlayer height="375px" width="270px" controls={true} url={message.mediaUrl}></ReactPlayer><Text fontFamily="SimSun" fontSize="11px" fontWeight="bold">{message.addedON}</Text></Card>)
                    }
                    else if (message.senderId == receiverId && message.mediaUrl.length > 0 && message.mediaType == "VIDEO") {
                        return (<Card marginTop="5px" display="flex" flexDirection="column" width="200px" height="375px" marginRight="auto"><ReactPlayer height={375} width={200} controls={true} url={message.mediaUrl}></ReactPlayer><Text fontFamily="SimSun" fontSize="11px" fontWeight="bold" >{message.addedON}</Text></Card>)

                    }
                })
            }

        </Box>

        <HStack >

            <Input placeholder='Write Message' fontFamily="NSimSun" fontSize="14px" fontWeight="bold" onChange={(e) => { setText(e.target.value) }} />
            <Menu>
                <MenuButton>
                    <img height="25px" width="26px" src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM1zuIzhqqgnFPMdrXCxhCy0WXhr_YunLdAw&usqp=CAU' />
                </MenuButton>
                <MenuList fontFamily="NSimSun" display="flex" flexDirection="column" justifyContent="center">
                    <button style={{ margin: "auto" }} onClick={() => { setIsImageDialogOpen(true); setIsVideoDialogOpen(false) }}><img height="25px" width="35px" src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlgthCGM5d11R9iapQzPR1HRnZsjOLVUkSAQ&usqp=CAU' /></button>
                    <button style={{ margin: "auto" }} onClick={() => { setIsVideoDialogOpen(true); setIsImageDialogOpen(false) }}><img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvxXCwBBcuGpe6ok-olkvlEqcn7vApDABZxw&usqp=CAU' height="25px" width="35px" /></button>
                </MenuList>
            </Menu>
            <IconButton onClick={() => {
                async function addMessage() {
                    if (text.length > 0) {
                        console.log("Sending Message")
                        let _response = await axios.post(`http://127.0.0.1:5050/addmessage/${localStorage.getItem("UID")}/${receiverId}`, { text })
                        console.log(_response.data.success)
                        if (_response.data.success) {
                            getMessagesAndReceiver()
                            console.log("Added Message")
                            toast({ title: "Success", description: "Message Sent Successfully", status: "success", isClosable: true, duration: 2000, containerStyle: { fontFamily: "Print Clearly" } })
                        }
                    }

                    else {
                        toast({ title: "Empty Message", description: "Cannot Send Empty Message", isClosable: true, duration: 2000, containerStyle: { fontFamily: "Print Clearly" }, status: "error" })
                    }
                }
                addMessage()
            }}>
                <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_v_IjwQk79SoRpjxOjoopzFzN8uHAhlFySw&usqp=CAU' height="14px" width="18px" />
            </IconButton>
        </HStack>
    </Box>)
}
export default Chat

/*
Plus Icon

PHOTO

VIDEO

setPhotoDialogBox
setVideoDialogBox
*/