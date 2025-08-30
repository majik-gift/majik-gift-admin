// import { Avatar, Box, Button, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
// import moment from 'moment';
// import { useState } from 'react';
// import { useSelector } from 'react-redux';

// const ChatBubble = ({ item, loading, isLastMessage }) => {
//   const { user } = useSelector((state) => state.auth);

//   const isMe = item?.sender?.id === user?.id;

//   // State to manage whether the full content is shown
//   const [showMore, setShowMore] = useState(false);

//   // Define a character limit for the content
//   const contentLimit = 150;
//   const isLongContent = item?.content?.length > contentLimit;

//   const toggleShowMore = () => {
//     setShowMore((prev) => !prev);
//   };

//   // Define message status
//   const isRead = item?.status === 'read';
//   const isDelivered = item?.status === 'unread';
//   const isSent = item?.status === 'unread';

//   const formatDate = (dateString) => {
//     const date = moment.utc(dateString);

//     if (date.isSame(moment(), 'day')) {
//       return `Today, ${date.format('hh:mm a')}`;
//     } else {
//       return date.format('MMM DD, h:mm a');
//     }
//   };

//   if (loading) {
//     // Skeleton state while loading
//     return (
//       <Box
//         sx={{
//           bgcolor: '#d4d4d4',
//           width: 'max-content',
//           px: 2,
//           py: 0.8,
//           maxWidth: '70%',
//           wordBreak: 'break-word',
//           borderRadius: isMe ? '10px 10px 0px 10px' : '0px 10px 10px 10px',
//           ...(isMe && {
//             ml: 'auto',
//           }),
//           my: 1,
//         }}
//       >
//         <Skeleton variant="text" width="100%" height={20} />
//         <Skeleton variant="text" width={80} height={15} sx={{ mt: 0.5 }} />
//       </Box>
//     );
//   }

//   const alignment = { alignSelf: isMe ? 'flex-end' : 'flex-start' };

//   return (
//     <>
//       <Box
//         sx={{
//           bgcolor: '#d4d4d4',
//           width: 'max-content',
//           px: 2,
//           py: 0.8,
//           maxWidth: '60%',
//           wordBreak: 'break-word',
//           borderRadius: isMe ? '15px 15px 0px 15px' : '0px 15px 15px 15px',
//           ...(isMe && {
//             ml: 'auto',
//             background: (theme) => theme.palette.secondary.main,
//             color: 'white',
//           }),
//           my: 1,
//         }}
//       >
//         {/* Display the content with "See More" toggle if content is too long */}
//         {isLongContent ? (
//           <>
//             <Typography sx={{ whiteSpace: 'pre-line' }}>
//               {showMore ? item?.content : `${item?.content.slice(0, contentLimit)}...`}
//             </Typography>
//             <Button
//               size="small"
//               onClick={toggleShowMore}
//               sx={{ mt: 1, color: isMe ? 'white' : 'primary.main' }}
//             >
//               {showMore ? 'See Less' : 'See More'}
//             </Button>
//           </>
//         ) : (
//           <Typography sx={{ whiteSpace: 'pre-line' }}>{item?.content}</Typography>
//         )}
//       </Box>
//       <Stack width={1} justifyContent={isMe ? 'flex-end' : 'flex-start'}>
//         <Typography variant="body2" color="#9D9D9D" sx={{ textAlign: isMe ? 'right' : 'left' }}>
//           {/* <TimeAgo createdAt={item?.createdAt} /> */}
//           {formatDate(item?.created_at)}
//         </Typography>
//         {item?.sender?.role === 'admin' && user.role !== 'admin' && (
//           <Typography variant="body2" color="#9D9D9D" sx={{ textAlign: isMe ? 'right' : 'left' }}>
//             {item?.sender?.role === 'admin' ? 'By Admin' : ' '}
//           </Typography>
//         )}
//         {isMe && (
//           <Box
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               ml: 1,
//               justifyContent: isMe ? 'flex-end' : 'flex-start',
//             }}
//           >
//             {/* {isMe &&
//               isLastMessage &&
//               item?.read_by?.map((eachUser) => {
//                 return (
//                   <Tooltip
//                     key={eachUser.id}
//                     title={
//                       eachUser.role === 'admin'
//                         ? 'Admin' + ' ' + eachUser.first_name + ' ' + eachUser.last_name
//                         : eachUser.first_name + ' ' + eachUser.last_name
//                     }
//                   >
//                     <Avatar src={eachUser?.profile_image} sx={{ width: '15px', height: '15px' }} />
//                   </Tooltip>
//                 );
//               })} */}
//           </Box>
//         )}
//       </Stack>
//     </>
//   );
// };

// export default ChatBubble;

import { Avatar, Box, Button, Skeleton, Stack, Typography } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const ChatBubble = ({ item, loading, isLastMessage }) => {
  const { user } = useSelector((state) => state.auth);

  const isMe = item?.sender?.id === user?.id;

  // State to manage whether the full content is shown
  const [showMore, setShowMore] = useState(false);

  // Define a character limit for the content
  const contentLimit = 150;
  const isLongContent = item?.content?.length > contentLimit;

  const toggleShowMore = () => {
    setShowMore((prev) => !prev);
  };

  // Define message status
  const isRead = item?.status === 'read';
  const isDelivered = item?.status === 'unread';
  const isSent = item?.status === 'unread';

  const formatDate = (dateString) => {
    const date = moment.utc(dateString);

    if (date.isSame(moment(), 'day')) {
      return `Today, ${date.format('hh:mm a')}`;
    } else {
      return date.format('MMM DD, h:mm a');
    }
  };

  const formatContentWithLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) =>
      urlRegex.test(part) ? (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'blue', textDecoration: 'underline' }}
        >
          {part}
        </a>
      ) : (
        part
      )
    );
  };

  if (loading) {
    // Skeleton state while loading
    return (
      <Box
        sx={{
          bgcolor: '#d4d4d4',
          width: 'max-content',
          px: 2,
          py: 0.8,
          maxWidth: '70%',
          wordBreak: 'break-word',
          borderRadius: isMe ? '10px 10px 0px 10px' : '0px 10px 10px 10px',
          ...(isMe && {
            ml: 'auto',
          }),
          my: 1,
        }}
      >
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width={80} height={15} sx={{ mt: 0.5 }} />
      </Box>
    );
  }

  const alignment = { alignSelf: isMe ? 'flex-end' : 'flex-start' };

  return (
    <Stack direction="row" spacing={1} justifyContent={'center'}>
      {!isMe && (
        <Stack direction="row" spacing={1}>
          <Avatar sx={{ width: '30px', height: '30px' }}></Avatar>
          {/* <Typography>{item?.sender?.first_name + ' ' + item?.sender?.last_name}</Typography> */}
        </Stack>
      )}
      <Box
        sx={{
          width: 'calc(100% - 60px)',
        }}
      >
        <Box
          sx={{
            bgcolor: '#d4d4d4',
            width: 'max-content',
            px: 2,
            py: 0.8,
            maxWidth: '60%',
            wordBreak: 'break-word',
            borderRadius: isMe ? '15px 15px 0px 15px' : '0px 15px 15px 15px',
            ...(isMe && {
              ml: 'auto',
              background: (theme) => theme.palette.secondary.main,
              color: 'white',
            }),
            my: 0.5,
          }}
        >
          {!isMe && (
            <Typography fontWeight="bold" fontSize="0.9rem">
              {item?.sender?.first_name + ' ' + item?.sender?.last_name}
            </Typography>
          )}
          {/* Display the content with "See More" toggle if content is too long */}
          {isLongContent ? (
            <>
              <Typography sx={{ whiteSpace: 'pre-line' }}>
                {showMore
                  ? formatContentWithLinks(item?.content)
                  : formatContentWithLinks(item?.content.slice(0, contentLimit) + '...')}
              </Typography>
              <Button
                size="small"
                onClick={toggleShowMore}
                sx={{ mt: 1, color: isMe ? 'white' : 'primary.main' }}
              >
                {showMore ? 'See Less' : 'See More'}
              </Button>
            </>
          ) : (
            <Typography sx={{ whiteSpace: 'pre-line' }}>
              {formatContentWithLinks(item?.content)}
            </Typography>
          )}
        </Box>
        <Stack width={1} justifyContent={isMe ? 'flex-end' : 'flex-start'}>
          <Typography variant="body2" color="#9D9D9D" sx={{ textAlign: isMe ? 'right' : 'left' }}>
            {formatDate(item?.created_at)}
          </Typography>
          {item?.sender?.role === 'admin' && user.role !== 'admin' && (
            <Typography variant="body2" color="#9D9D9D" sx={{ textAlign: isMe ? 'right' : 'left' }}>
              {item?.sender?.role === 'admin' ? 'By Admin' : ' '}
            </Typography>
          )}
        </Stack>
      </Box>
    </Stack>
  );
};

export default ChatBubble;
