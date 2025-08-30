import { Box, Button, Container, Link, Typography } from '@mui/material';

const ZoomIntegrationPage = () => {
  return (
    <>
      <Typography
        variant="h2"
        gutterBottom
        textAlign="center"
        sx={{ border: 1, p: 5, borderColor: 'divider' }}
      >
        Zoom Integration Setup
      </Typography>
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold">
            How to Connect to Zoom (Add App)
          </Typography>
          <Typography variant="body1" sx={{ mt: 0.5 }}>
            1. Navigate to <strong>Login &gt; Settings</strong> tab.
          </Typography>
          <Typography variant="body1">
            2. Click <strong>"Connect Zoom"</strong>.
          </Typography>
          <Typography variant="body1">
            3. You will be navigated to a Zoom authorization page. Please read it and accept.
          </Typography>
          <Typography variant="body1">
            4. You will be navigated back to your website settings page where you should see the
            status as <strong>"Connected"</strong>.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="primary">
              Connect Zoom
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold">
            How to Disconnect from Zoom (Remove App)
          </Typography>
          <Typography variant="body1" sx={{ mt: 0.5 }}>
            To disconnect Zoom directly from your website:
          </Typography>
          <Typography variant="body1">
            1. Navigate to <strong>Login &gt; Settings</strong> tab.
          </Typography>
          <Typography variant="body1">
            2. Click <strong>"Revoke Zoom"</strong>.
          </Typography>
          <Typography variant="body1">
            3. The page will refresh, and you should see the status as{' '}
            <strong>"Not Connected"</strong>.
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Note:</strong> All of your Zoom data is now deleted.
          </Typography>

          <Typography variant="body1" sx={{ mt: 2 }}>
            Alternatively, you can also remove the app via the Zoom App Marketplace:
          </Typography>
          <Typography variant="body1">
            1. Log into your Zoom account and navigate to the <strong>Zoom App Marketplace</strong>.
          </Typography>
          <Typography variant="body1">
            2. Click <strong>Manage &gt; Installed Apps</strong> or search for the{' '}
            <strong>Great Question</strong> app.
          </Typography>
          <Typography variant="body1">
            3. Click the <strong>Great Question</strong> app.
          </Typography>
          <Typography variant="body1">
            4. Click <strong>Uninstall</strong>.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="secondary">
              Revoke Zoom
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold">
            Usage — Required
          </Typography>
          <Typography variant="body1" sx={{ mt: 0.5 }}>
            Below are the use cases for each feature or action and their prerequisites:
          </Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>
            1. Creating a Zoom Meeting for a Service Activity
          </Typography>
          <Typography variant="body1" sx={{ mt: 0.5 }}>
            <strong>Use Case:</strong> Create a Zoom meeting for a specific service activity.
          </Typography>
          <Typography variant="body1">
            <strong>Prerequisites:</strong>
            <ul>
              <li>You must be logged into your account.</li>
              <li>You must have already connected your Zoom account.</li>
            </ul>
          </Typography>
          <Typography variant="body1">
            <strong>Steps:</strong>
          </Typography>
          <Typography variant="body1" sx={{ mt: 0.5 }}>
            1. Go to the <strong>Service</strong> section and select the desired service.
          </Typography>
          <Typography variant="body1">
            2. Navigate to the <strong>Activities</strong> tab and click{' '}
            <strong>"Create Activity"</strong>.
          </Typography>
          <Typography variant="body1">
            3. Click <strong>"Create Zoom Meeting"</strong>. A modal will open.
          </Typography>
          <Typography variant="body1">
            4. Enter the required details in the modal and confirm. A Zoom meeting will be created,
            and you will receive the meeting URL.
          </Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>
            2. Creating a Zoom Meeting for an Group Activities Activity
          </Typography>
          <Typography variant="body1" sx={{ mt: 0.5 }}>
            <strong>Use Case:</strong> Create a Zoom meeting for a specific Group Activities activity.
          </Typography>
          <Typography variant="body1">
            <strong>Prerequisites:</strong>
            <ul>
              <li>You must be logged into your account.</li>
              <li>You must have already connected your Zoom account.</li>
            </ul>
          </Typography>
          <Typography variant="body1">
            <strong>Steps:</strong>
          </Typography>
          <Typography variant="body1" sx={{ mt: 0.5 }}>
            1. Go to the <strong>Group Activities</strong> section and select the desired Group Activities.
          </Typography>
          <Typography variant="body1">
            2. Navigate to the <strong>Activities</strong> tab and click{' '}
            <strong>"Create Activity"</strong>.
          </Typography>
          <Typography variant="body1">
            3. Click <strong>"Create Zoom Meeting"</strong>. A modal will open.
          </Typography>
          <Typography variant="body1">
            4. Enter the required details in the modal and confirm. A Zoom meeting will be created,
            and you will receive the meeting URL.
          </Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>
            3. Connecting Zoom
          </Typography>
          <Typography variant="body1">
            <strong>Use Case:</strong> Link your Zoom account to enable Zoom-related features.
          </Typography>
          <Typography variant="body1">
            <strong>Prerequisites:</strong> You must have a valid Zoom account.
          </Typography>
          <Typography variant="body1">
            <strong>Steps:</strong> Follow the "How to Connect to Zoom" instructions above.
          </Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>
            4. Disconnecting Zoom
          </Typography>
          <Typography variant="body1">
            <strong>Use Case:</strong> Remove your Zoom account integration and delete all related
            data.
          </Typography>
          <Typography variant="body1">
            <strong>Prerequisites:</strong> Ensure no ongoing activities or meetings require Zoom.
          </Typography>
          <Typography variant="body1">
            <strong>Steps:</strong> Follow the "How to Disconnect from Zoom" instructions above.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="body1">
            For more details, visit the{' '}
            <Link href="https://majikgift.com/contact-us" target="_blank">
              Help Center
            </Link>
            .
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default ZoomIntegrationPage;
