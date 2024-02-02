"use client"
import { Card, Text, Box, HStack, Button, Avatar, Input, VStack } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import axios, { all } from "axios";
export default function Home() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [chats, setChats] = useState([])
  console.log(localStorage.getItem("UID"))

  let getUsersAndChats = async () => {
    let allChats = []
    let response = await axios.get("http://127.0.0.1:5050/getusers")
    let _users = response.data.users.filter((_user) => { return (_user._id != localStorage.getItem("UID")) })
    for (let user of _users) {
      let _response = await axios.get(`http://127.0.0.1:5050/getmessages/${localStorage.getItem("UID")}/${user._id}`)
      if (_response.data.messages.length > 0) {
        console.log(_response.data.messages)
        allChats.push({ userProfilePhotoUrl: user.profilePhotoUrl, userName: user.name, lastMessage: _response.data.messages[_response.data.messages.length - 1], addedON: _response.data.messages[_response.data.messages.length - 1].addedON, UID: user._id })
      }
    }
    console.log("Setting Users And Chats")
    console.log(_users)
    console.log(allChats)
    let _allChats = allChats.sort((chat1,chat2)=>{
     let createdAt1= new Date(chat1.lastMessage.addedON)
     let createdAt2=new Date(chat2.lastMessage.addedON)
     if(createdAt1>createdAt2)
     {
      return -1
     }
     else
     {
      return 1
     }
    })
    setChats(_allChats)
    setUsers(_users)

  }
  useEffect(() => {
    if (users.length == 0) {
      console.log("Getting Users And Chats")
      getUsersAndChats()
    }
  })
  if (localStorage.getItem("UID") != null) {
    return (
      <Box height="100%" display="flex" flexDirection="column" width="100%">
        <HStack>
          <Text fontFamily="NSimSun" fontSize="15px" color="green" fontWeight="bold" marginBottom="10px">CHATTY</Text>
          <Button onClick={() => { router.push("/login") }} fontFamily="NSimSun" fontSize="13px" fontWeight="bold" height="26px" marginLeft="auto">Sign In</Button>
          <Avatar onClick={() => {
            router.push(`/profile/fas345435`)
          }} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM2QHD9DgCKTgUqH0Ld1pPKkfg7zRCBYx8tg&usqp=CAU"></Avatar>
        </HStack>
        <Box width="100%">
          <Swiper modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={10}
            slidesPerView={5}
            navigation
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log('slide change')}>
            {
              users.map((user) => {
                return (<SwiperSlide><Card display="flex" justifyContent="space-between" flexDirection="column" fontFamily="NSimSun">
                  <img src={user.profilePhotoUrl} />
                  <Text textAlign="center">{user.name}</Text>
                  <Button onClick={() => { router.push(`/chat/${user._id}`) }}>Message</Button>
                </Card></SwiperSlide>)
              })
            }
          </Swiper>
        </Box>
        <HStack height="100%" width="100%">
          <Box height="650px" fontFamily="SimSun" width="70%" display="flex" flexDirection="column">
            <Input fontWeight="bold" placeholder="Search Chats" fontFamily="NSimSun" borderRadius="20px" fontSize="12px" />
            <Box>
              {
                chats.map((chat) => {
                  return (<Card onClick={() => {
                    router.push(`/chat/${chat.UID}`)
                  }}>
                    <HStack fontFamily="NSimSun" justifyContent="space-between">3
                      <Avatar src={chat.userProfilePhotoUrl} />
                      <VStack>
                        <Text fontWeight="bold" fontSize="17px" >{chat.userName}</Text>
                        {chat.lastMessage.text.length > 0 ? <Text>{chat.lastMessage.text}</Text> : chat.lastMessage.mediaUrl.length > 0 && chat.lastMessage.mediaType == "PHOTO" ? <Text>Sent A Photo</Text> : chat.lastMessage.mediaUrl.length > 0 && chat.lastMessage.mediaType == "VIDEO" ? <Text>Sent A Video</Text> : <Text></Text>}
                      </VStack>
                      <Text>{chat.addedON}</Text>
                    </HStack>
                  </Card>)
                })
              }
            </Box>
          </Box>

          <Box width="30%" backgroundColor="green" height="650px" textAlign="center" color="white" fontWeight="bold" borderRadius="8px" fontFamily="NSimSun" display="flex" flexDirection="column">
            Send And Receive Messages Through CHATTY
          </Box>
        </HStack>
      </Box>
    )
  }
  else {
    return (<Card display="flex" margin="auto" fontFamily="SimSun" fontWeight="bold" flexDirection="column" width="200px" height="300px">
      <Text textAlign="center" fontFamily="SimSun" fontWeight="bold" color="green" fontSize="18px">CHATTY</Text>
      <Button marginTop="50px" onClick={() => { router.push("/signup") }}>SIGNUP</Button>
      <Text textAlign="center">OR</Text>
      <Button onClick={() => { router.push("/login") }}>LOGIN</Button>
    </Card>)
  }
}
/*

*/
