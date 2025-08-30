import MenuIcon from "@mui/icons-material/Menu";
import { Avatar, IconButton, ListItem, ListItemAvatar, ListItemText, Paper, useMediaQuery } from "@mui/material";
import moment from "moment";

const ChatHeader = ({ recipient, handleOpenDrawer }) => {
  const isLargeScreen = useMediaQuery("(min-width:900px)");

  const formatDate = (dateString) => {
    const date = moment(dateString);

    if (date.isSame(moment(), "day")) {
      return `Today, ${date.format("hh:mm a")}`;
    } else {
      return date.format("MMM DD, h:mm a");
    }
  };

  return (
    <Paper variant="outlined" sx={{ minHeight: "80px", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <ListItem>
        {!isLargeScreen && (
          <ListItemAvatar sx={{ minWidth: "40px" }}>
            <IconButton onClick={handleOpenDrawer}>
              <MenuIcon />
            </IconButton>
          </ListItemAvatar>
        )}
        <ListItemAvatar sx={{ minWidth: { sm: 64 } }}>
          <Avatar
            alt={recipient ? `${recipient.first_name} ${recipient.last_name}` : "Select a Chat"}
            src={recipient?.profile_image}
            sx={{ width: { xs: 40, sm: 50, md: 54 }, height: { xs: 40, sm: 50, md: 54 } }}
          />
        </ListItemAvatar>
        <ListItemText
          primary={recipient ? `${recipient.first_name} ${recipient.last_name}` : "Select a Chat"}
          primaryTypographyProps={{
            noWrap: true,
            variant: "h6",
            fontWeight: "bold",
          }}
          secondary={recipient?.is_online ? "online" : recipient?.last_online ? formatDate(recipient?.last_online) : ""}
        />
      </ListItem>
    </Paper>
  );
};

export default ChatHeader;
