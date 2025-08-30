'use client';
import ChatBox from '@/shared/components/chat-components/ChatBox';
import ChatDrawer from '@/shared/components/chat-components/ChatDrawer';
import SearchBox from '@/shared/components/chat-components/SearchBox';
import UserList from '@/shared/components/chat-components/UserList';
import { SocketContext } from '@/shared/context/socket/socketReducer';
import { apiGet, apiPost } from '@/shared/services/apiService';
import { Box, Container, Grid, Stack, useMediaQuery } from '@mui/material';
import debounce from 'lodash/debounce';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import CreateZoomMeetingDialog from '../components/chat-components/create-zoom-meeting';
import { useUI } from '../context/UIContext';
import axiosInstance from '../services/axiosInstance';

const Chat = ({ archived = false }) => {
  const { toggleLoader } = useUI();
  const { user } = useSelector((state) => state.auth);

  const matches = useMediaQuery('(min-width:900px)');
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const chatId = params.get('chatId');
  const {
    state: { socket },
  } = useContext(SocketContext);
  const chatContainerRef = useRef(null);

  const [userChat, setUserChat] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(true);
  const [sendMsgLoading, setSendMsgLoading] = useState(false);
  const [hasMoreChat, setHasMoreChat] = useState(true);
  const [messages, setMessages] = useState({ items: [] });
  const [openDrawer, setOpenDrawer] = useState(false);

  const [openCreateMeetingModal, setOpenCreateMeetingModal] = useState(false);

  const activeChatRef = useRef(activeChat);

  const recipient = useMemo(
    () => activeChat?.participants?.find((p) => p?.user?.id !== user?.id)?.user,
    [activeChat, user]
  );

  const fetchAllChats = useCallback(
    async (search = '', setChat = false) => {
      try {
        const data = await apiGet(`chat?search=${search}&is_archived=${archived}`);
        if (setChat) {
          console.log('bhai ya set horhi ha');
          setActiveChat(null);
          const chat = data?.response?.details.find((each) => each.id === Number(chatId));
          console.log('🚀 ~ chat:', chat);

          setActiveChat(chat);
        }
        setUserChat(data?.response?.details || []);
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setChatLoading(false);
      }
    },
    [user?.id]
  );

  const fetchChatMessages = async (scroll, chatId, lastMessageId) => {
    setLoading(true);
    try {
      const path = `chat/messages?chat_id=${chatId}&limit=10${lastMessageId ? `&last_message_id=${lastMessageId}` : ''}`;
      const data = await apiGet(path);

      setMessages((prev) =>
        scroll
          ? { ...data?.response?.details, items: [...prev.items, ...data?.response?.details.items] }
          : data?.response?.details
      );

      if (!data?.response?.details?.items) {
        setHasMoreChat(false);
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMsg = useCallback(
    async (msg) => {
      setSendMsgLoading(true);
      try {
        const data = await apiPost('chat/send-message', {
          content: msg,
          recipient_id: recipient?.id,
          chat_id: activeChatRef.current?.id,
        });

        const { message, chat } = data?.response?.details;
        setUserChat((prev) =>
          prev.map((each) => (each.id === chat.id ? { ...chat, unread_count: 0 } : each))
        );
        setMessages((prev) => ({ ...prev, items: [message, ...prev?.items] }));
        scrollToBottom();
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setSendMsgLoading(false);
      }
    },
    [recipient?.id]
  );

  const scrollToBottom = (delay = 50) => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }, delay);
    }
  };

  useEffect(() => {
    fetchAllChats();
  }, []);

  useEffect(() => {
    if (userChat.length && chatId && !activeChat) {
      setActiveChat(userChat.find((eachChat) => eachChat.id === Number(chatId)));
      fetchChatMessages(false, chatId);
    }
  }, [chatId, userChat]);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  useEffect(() => {
    const handleMessage = (data) => {
      const { chat, message, sendChatToRecipient } = data;

      setUserChat((prev) =>
        sendChatToRecipient
          ? [chat, ...prev]
          : prev.map((each) => {
              console.log("🚀 ~ :prev.map ~ each:", each)
              return each.id === chat.id
                ? activeChatRef.current?.id === chat.id
                  ? { ...chat, unread_count: 0 }
                  : chat
                : each;
            })
      );

      if (activeChatRef.current?.id === chat.id) {
        socket?.emit('onMessageMarkAsRead', { chatId: chat?.id });
        setMessages((prev) => ({ ...prev, items: [message, ...prev.items] }));
        scrollToBottom();
      }
    };

    const handleMessageRead = (data) => {
      console.log('🚀 ~ handleMessageRead ~ message:', data?.message);
      setMessages((prev) => ({
        ...prev,
        items: prev.items.map((each) => {
          if (each.id === data?.message.id) {
            return { ...each, ...data?.message };
          }
          return each;
        }),
      }));
    };

    socket?.on('onMessage', handleMessage);
    socket?.on('onMessageRead', handleMessageRead);

    return () => {
      socket?.off('onMessage', handleMessage);
      socket?.off('onMessageRead', handleMessageRead);
    };
  }, [socket]);

  useEffect(() => {
    if (activeChatRef.current?.id) {
      socket?.emit('onChatJoin', { chatId: activeChatRef.current?.id });
      socket?.emit('onMessageMarkAsRead', { chatId: activeChatRef.current?.id });
      setUserChat((prev) =>
        prev.map((each) =>
          each.id === activeChatRef.current?.id ? { ...each, unread_count: 0 } : each
        )
      );
    }

    return () => {
      if (activeChatRef.current?.id) {
        socket?.emit('onChatLeave', { chatId: activeChatRef.current?.id });
      }
    };
  }, [activeChat]);

  useEffect(() => {
    if (navigator?.serviceWorker) {
      const handleMessage = debounce((event) => {
        if (event.data?.type === 'NEW_NOTIFICATION') {
          const newChatId = Number(event.data.chatId);
          if (activeChatRef.current?.id === newChatId) return;

          const newActiveChat = userChat.find((eachChat) => eachChat.id === newChatId);
          setActiveChat(newActiveChat);
          setMessages({ items: [] });
          fetchChatMessages(false, newChatId);
          router.push(`${pathname}?chatId=${newChatId}`);
        }
      }, 300);

      navigator.serviceWorker.addEventListener('message', handleMessage);

      return () => {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      };
    }
  }, [userChat, router, pathname, fetchChatMessages]);

  const searchChats = debounce((e) => fetchAllChats(e), 300);

  const renderUserChats = () => (
    <Stack sx={{ height: 1, width: 1 }} spacing={1}>
      <Box sx={{ height: { md: 'calc(100% - 90%)' }, width: 1 }}>
        <SearchBox setSearch={searchChats} />
      </Box>
      <UserList
        userChat={userChat}
        setActiveChat={(chat) => {
          setActiveChat(chat);
          router.push(`${pathname}?chatId=${chat.id}`);
          setMessages({ items: [] });
          fetchChatMessages(false, chat.id);
          setOpenDrawer(false);
        }}
        loading={chatLoading}
        activeChat={activeChat}
      />
    </Stack>
  );

  const handleArchivedChat = async () => {
    try {
      toggleLoader();
      const res = await axiosInstance.put('chat/manage-chat-status', {
        id: activeChat.id,
      });
      fetchAllChats();
      setActiveChat(null);

      router.push(`${pathname}`);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      toggleLoader();
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ height: 'calc(100vh - 85px)', padding: { xs: 'auto', xs: '0 !important' } }}
    >
      <Box sx={{ height: '100%', py: 3 }}>
        <Grid container columnSpacing={2} sx={{ height: 1 }}>
          {matches ? (
            <Grid container direction={'row'} item md={5} sx={{ height: 1 }}>
              {renderUserChats()}
            </Grid>
          ) : (
            <ChatDrawer open={openDrawer} onRequestClose={() => setOpenDrawer(false)}>
              {renderUserChats()}
            </ChatDrawer>
          )}
          <Grid item md={7} xs={12} sx={{ height: 1 }}>
            <ChatBox
              hasMoreChat={hasMoreChat}
              messages={messages?.items}
              ref={chatContainerRef}
              handleScroll={() =>
                fetchChatMessages(
                  true,
                  activeChat?.id,
                  messages?.items[messages?.items?.length - 1].id
                )
              }
              activeChat={activeChat}
              loading={loading}
              handleSendMsg={handleSendMsg}
              recipient={recipient}
              sendMsgLoading={sendMsgLoading}
              chat={activeChat}
              handleOpenDrawer={() => setOpenDrawer(true)}
              openMeetingModal={() => setOpenCreateMeetingModal(!openCreateMeetingModal)}
              handleArchived={handleArchivedChat}
              archived={archived}
            />
          </Grid>
        </Grid>
        <CreateZoomMeetingDialog
          open={openCreateMeetingModal}
          onClose={() => setOpenCreateMeetingModal(!openCreateMeetingModal)}
          chat={activeChat}
          getChat={() => fetchAllChats('', true)}
          sendMsg={handleSendMsg}
        />
      </Box>
    </Container>
  );
};

export default Chat;
