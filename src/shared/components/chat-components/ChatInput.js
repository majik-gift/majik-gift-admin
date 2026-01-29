import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Send } from "@mui/icons-material";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Box, Button, CircularProgress, IconButton, InputBase, Paper, Popover, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

const ACCEPT_ATTACHMENTS = "image/*,.pdf,.doc,.docx";
const MAX_FILE_SIZE_MB = 15;

const ChatInput = ({ onSendMessage, loading = true, disabled, onTypingStart, onTypingStop, multiline, rows }) => {
  const [currentMsg, setCurrentMsg] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSendMsg = () => {
    const hasText = currentMsg?.trim() !== "";
    const hasFile = !!selectedFile;
    if (hasText || hasFile) {
      onSendMessage(hasText ? currentMsg : "", selectedFile || undefined);
      setCurrentMsg("");
      setSelectedFile(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) return;
    setSelectedFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleKeyDown = () => {
    if (!isTyping) {
      setIsTyping(true);
      if (onTypingStart) onTypingStart(); // Call the typing start callback if provided
    }

    // Clear previous timeout if the user is still typing
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleKeyUp = () => {
    // Set a timeout to detect typing stop
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (onTypingStop) onTypingStop(); // Call the typing stop callback if provided
    }, 500); // Adjust this delay as needed
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2, height: "100%" }}>
      <input
        type="file"
        ref={fileInputRef}
        accept={ACCEPT_ATTACHMENTS}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <Paper
        elevation={0}
        sx={{
          p: "12px",
          display: "flex",
          alignItems: "flex-end",
          width: "100%",
          background: "rgba(245, 245, 245, 1)",
          borderRadius: "15px",
          height: "auto",
          maxHeight: "150px",
          overflow: "hidden",
        }}
      >
        <IconButton
          size="small"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          sx={{ alignSelf: "flex-end" }}
          aria-label="Attach file"
        >
          <AttachFileIcon />
        </IconButton>
        {selectedFile && (
          <Typography variant="caption" sx={{ alignSelf: "center", mr: 1, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis" }}>
            {selectedFile.name}
          </Typography>
        )}
        <InputBase
          sx={{
            ml: 1,
            flex: 1,
            // height: "100%",
            maxHeight: "100px", // Set the maximum height
            overflowY: "auto", // Enable scrolling when the content exceeds the max height
            resize: "none", // Prevent manual resizing of the input
            "::-webkit-scrollbar": { width: "0.4em" },
            "::-webkit-scrollbar-thumb": { backgroundColor: "rgba(0,0,0,.1)", borderRadius: "10px" },
          }}
          value={currentMsg}
          disabled={disabled}
          multiline={true} // Ensure multiline behavior
          // rows={1} // Start with one row, grow dynamically
          placeholder="Type a message"
          onChange={(e) => setCurrentMsg(e.target.value)}
          // onKeyDown={handleKeyDown}

          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) e.preventDefault();
          }}
          onKeyUp={(e) => {
            handleKeyUp();
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Prevent new line on pressing Enter
              e.stopPropagation(); // Prevent new line on pressing Enter
              handleSendMsg();
            }
          }}
        />

        <IconButton size="small" aria-describedby={id} onClick={handleClick} disabled={disabled}>
          <SentimentSatisfiedAltIcon />
        </IconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Box sx={{ width: "350px", height: "100%" }}>
            <Picker
              data={data}
              onEmojiSelect={(emoji) => setCurrentMsg((previous) => previous + "" + emoji.native)}
              pickerStyle={{ width: "100%" }}
              theme="light"
            />
          </Box>
        </Popover>
      </Paper>
      <Button
        color="secondary"
        variant="contained"
        disabled={disabled ? disabled : loading}
        sx={{ p: "16px", borderRadius: "15px", height: "100%", maxHeight: "60px" }}
        onClick={handleSendMsg}
      >
        {loading ? <CircularProgress size={20} /> : <Send />}
      </Button>
    </Box>
  );
};

export default ChatInput;
