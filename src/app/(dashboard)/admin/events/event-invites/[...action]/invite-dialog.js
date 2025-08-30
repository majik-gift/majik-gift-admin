import { useEffect, useState } from 'react';

import {
  Box,
  Checkbox,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';

import { useApiRequest } from '@/hooks/useApiRequest';
import { UIButton, UIDialog, UIInputField } from '@/shared/components';
import { useToast } from '@/shared/context/ToastContext';
import axiosInstance from '@/shared/services/axiosInstance';
import { getUsers } from '@/store/admin/users/users.thunks';
import { inviteUsers } from '@/store/light-worker/events/events.thunk';

const InviteDialog = ({ open, handleDialogState, id, organizerId = null, getData = () => { } }) => {
  const { addToast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [extraParams, setExtraParams] = useState({
    roles: ['light_worker', 'admin'],
    search: '',
    registration_status: 'approved',
    ...(organizerId && { excludeThisIds: [organizerId, user.id] }),
    includeAdmin: true,
  });
  const [getLightWorkers, loadingLightWorker, , , , , data] = useApiRequest(getUsers, {
    initFetch: true,
    apiProps: extraParams,
  });

  useEffect(() => {
    getLightWorkers(extraParams)
  }, [extraParams])


  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((item) => item !== id)
        : [...prevSelectedIds, id]
    );
  };

  const handleInvite = async () => {
    if (!selectedIds.length) {
      addToast({ message: 'Please select at least one user', severity: 'error' });
      return;
    }
    const url = `events/invite-users`;
    setIsLoading(true);
    try {
      const res = await axiosInstance.post(url, {
        event_id: id,
        user_ids: selectedIds,
      });
      handleDialogState(false);
      setSelectedIds([]);
      getData();
      addToast({ message: res?.data?.message, severity: 'success' });
    } catch (error) {
      addToast({ message: error?.message, severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLightWorkers = data?.details?.filter((worker) =>
    `${worker.first_name} ${worker.last_name}`.toLowerCase())


  const renderLightWorkers = (item) => (
    <ListItemButton
      key={item.id}
      onClick={() => handleCheckboxChange(item.id)}
      selected={selectedIds.includes(item.id)}
      disableRipple={false}
    >
      <Box display="flex" alignItems="center" width="100%">
        <Checkbox
          checked={selectedIds.includes(item.id)}
          onChange={() => handleCheckboxChange(item.id)}
          onClick={(e) => e.stopPropagation()}
        />
        <ListItemText
          primary={`${item?.first_name} ${item?.last_name} ${item?.role === 'admin' ? '(Admin)' : ''}`}
        />
      </Box>
    </ListItemButton>
  );

  return (
    <UIDialog
      open={open}
      onClose={() => {
        handleDialogState(false);

        setSelectedIds([]);
      }}
      dialogTitle="Invite Light Workers"
      actions={
        <>
          <UIButton isLoading={isLoading} onClick={handleInvite}>
            Invite
          </UIButton>
          <UIButton
            color="error"
            onClick={() => {
              handleDialogState(false);

              setSelectedIds([]);
            }}
          >
            Cancel
          </UIButton>
        </>
      }
    >
      <UIInputField
        label="Search"
        name="search"
        placeholder="Search here"
        value={extraParams?.search}
        onChange={(e) => setExtraParams(prev => ({ ...prev, search: e.target.value }))}

      />
      {loadingLightWorker ? (
        <Stack minHeight={200} justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      ) : (
        <List sx={{ minHeight: 200, maxHeight: '30vh', overflowY: 'scroll' }}>
          {filteredLightWorkers?.length ? (
            filteredLightWorkers?.map(renderLightWorkers)
          ) : (
            <Stack minHeight={200} justifyContent="center" alignItems="center">
              <Typography>No Record Found</Typography>
            </Stack>
          )}
        </List>
      )}
    </UIDialog>
  );
};

export default InviteDialog;
