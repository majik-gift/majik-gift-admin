import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import dayjs from 'dayjs';
import Link from 'next/link';

const ServiceCard = ({ data, handleDelete, preFix }) => {
  console.log('🚀 ~ ServiceCard ~ data:', data);
  const { service, start_time, end_time, number_of_slot } = data;
  console.log('🚀 ~ ServiceCard ~ start_time:', start_time);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="body1" color="text.secondary">
          <strong>Start Time:</strong> {dayjs.unix(start_time).format('h:mm a')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          <strong> End Time:</strong> {dayjs.unix(end_time).format('h:mm a')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          <strong> Number of Slots:</strong> {number_of_slot}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          size="small"
          LinkComponent={Link}
          href={`time-slots/${data.id}/update`}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          size="small"
          color="error"
          onClick={() => handleDelete(data.id, preFix)}
        >
          delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default ServiceCard;
