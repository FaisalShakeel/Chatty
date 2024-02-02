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
YouTube2.0
Chatty
Spotify
LinkedIn
Medium
Insta/Twitter
ELearning App With Stripe Payment Integration
ECOM With Stripe Payment Integration
Netflix
Twitch  Sockets,RTC(Real Time Commnunication)
AirBnB Clone:NextJS14,ChakraUI,NextAuth,Tailwind Css,Node JS
JobHub/UpWork Clone
JS Tutorial
TS Tutorial

GitHub Link

#React Projects
#Next Js Projects
#React Developer
#Web Developer
#OpenToWork
#Web 3 Developer
#Blockchain Developer

Medium Clone
Insta Clone
Twitter Clone
LinkedIn Clone Using Next JS14,ChakraUI,Tailwind Css ,Socket.IO And Node JS
Only Owner Is Allowed To Add Stories To His Lists
Full Stack Medium Clone Using Next JS14,ChakraUI,Tailwind Css ,Zustand,Context API And Node JS
We are done and dusted with this coding project
We will be using stripe in our freelance market place.Here is the  list of all the items
{
  paymeb nt_method_types:["card"],
  mode:"payment",
  success_url:"",
  cancel_url:"",
  price_data:{
    currency:"pkr",
    product_data:{
      name:"MacBook Pro 13"

    },3
    unit_amount:30*100
    }
    qty:3
  }

Web RTC

Live Streaming App Using React Native And NodeJS,WebRTC,Socket.IO
Write Propsal

STATUS:ACTIVE
Jobs People
Html,Css,JavaScript,TypeScript,React JS,NextJS,Tailwind Css,ChakraUI,MaterialUI,Node JS,Express JS,Azure,Digital Ocean,AWS
Category
Price Range
Type
Hourly OR Fixed
Message

Freelance Market Place Using Next JS And Node JS
HI Martin,I Have Gone Through
I Will Develop Web Apps Using NextJS And Node JS
This is my bank account No.You can send payment through this account no.You will be charged some extra money for sending money to this account as it is located in Pakistan
Full Stack Developer With Expertise In ReactJS,Next JS,UI Libraries,State Management And Node JS.Curious About Web3 And Blockchain Technology
Unleashing The Power Of Twitter
Posting Content On Twitter Related To Our Field Can Get You A Job
You Can Get The Source Code Here.Never Look Back In Life
Full Stack Medium Clone
Nav Bar:
Nav Bar Is Created Using HStack Component.It Contains App Icon,Search Bar,Notifications Icon And Profile Icon
Feed Section:
Feed Section Will Display Stories From Different Users.It will also display lists and users that you follow
It is created using grid component
AddStory Component
Now User Can Add Stories AndThose stories will be stored in mongodb
Chatty
JobHub
MusicAdda
ECOM
Bloggy
Source Code Live App
ELearn
LetsConnect
YouTube2.0
TikTok Clone
Insta Clone
RealEstate App
Live Streaming App
Movies App
Hotel Booking
Search Hotels,Filters.
Chat With Hotel Owner.
Confirm Booking
Cancel Booking
Rooms,From To

Home:Introduction With An Image
Skills
Projects
Contact LinkedIn,Twitter,Instagram,EMail
15 Projects In My Portfolio Website
Chatty:Chatty Is A Chat App Where Users Can Send And Receive Text,Image And Video Messages. Users Can Also Make Video Amd Voice Calls.Group Chat Feature Is Also Available
ECOM:ECOM as the name suggests is an Ecommerce platform for users where user can buy and sell products.User can add products,delete and update them. User can buy products and pay through stripe.User Can Also View His Product Statistics Like Which Product Is Doing Great In The Market.As A Buyer ,You Can Rate And ReView The Product.
E-LEARN:It is an online learning platform for users.Where users can find courses of different categories.He can filters courses.He can add  his own courses. Each course will have a name ,description ,reviews and lecs.He can add lecs to the course.Users can chat with each other.
LetsConnect:A Platform For Users To Connect With People Related to their field.User can setuphis profile including his bio,skills,projects.education and work experience. He can post content,his posts can be liked,saved and commented.He can create groups and include members. Users can chat with earch other as well.
Music Adda:Its A Music Platform Where Users Can Listen To Songs Of Different Categories.He can search songs. He can create playlists and add songs to them.He can also like other playlists,follow artists.

JobHub:A Platform Where Users Can Find And Post Jobs.You Can Join Both As A Freelance OR A Client.Clients Can Post Jobs And Hire The Best Resource.As A Client,You Can ReView The Seller. As A Seller,You can add your bio and portfolio that you can show to others.Client Can Chat With Seller As Well.Freelancers Will Bid On Jobs And Write Their Proposal
YouTube2.0:This app works like youtube where users can create channels,upload videos and get likes,views and comments.You can like,save videos to watch them later.You can edit and delete videos. You can follow others and get notified everytime
Live Streaming App:This App allows users to stream live videos.Users can also do live chatting
Movies App
Real Estate App
Client Will Go Through All The Proposals And Hire The Person
Frontend Source Code
Backend Source Code

Languages And Tools
Html
Css
JS
TS
React JS
React Native
Solidity
Ethereum
Next JS
Node Js
Prisma
Sanity.IO Socket.IO
Express JS
Tailwind Css

Cloud Platforms You Can Deploy Node JS App To
Render.com
Railway
Heroku
DigitalOcean
AWS:For DeployMent
Azure
Posts Jobs Groups People
Stories Lists People

All Sports Software Development Music Health And Fitness Business Technology Education Politics

Profile Photo Name Bio Follow/Following

Followers Following Stories Lists
*/
