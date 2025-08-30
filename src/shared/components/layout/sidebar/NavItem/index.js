import {
  Chip,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
// import { ListItemStyled } from './ui';

const NavItem = ({ item, level, onClick, hideMenu }) => {
  const pathname = usePathname();
  const pathDirect = pathname;

  const Icon = item.icon;
  const theme = useTheme();
  const itemIcon = item.icon ? level > 1 ? <Icon sx={{ fontSize: '0.8rem' }} /> : <Icon /> : <></>;

  const isItemSelected = pathDirect.startsWith(item.href);

  const ListItemStyled = styled(ListItemButton)(() => ({
    whiteSpace: 'nowrap',
    marginBottom: '2px',
    padding: '8px 10px',
    borderRadius: `${7}px`,
    backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
    color:
      level > 1 && pathDirect === item.href
        ? `${theme.palette.secondary.main}!important`
        : theme.palette.text.secondary,
    paddingLeft: hideMenu ? '10px' : level > 2 ? `${level * 15}px` : '10px',
    '&:hover': {
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.getContrastText,
    },
    '&.Mui-selected': {
      color: 'white',
      backgroundColor: theme.palette.secondary.main,
      '&:hover': {
        backgroundColor: theme.palette.secondary.main,
        color: 'white',
      },
    },
  }));

  return (
    // <List component="li" disablePadding key={item.id}>
    <ListItemStyled
      component={item.external ? 'a' : Link}
      href={item.href}
      disabled={item.disabled}
      selected={isItemSelected}
      target={item.external ? '_blank' : ''}
      onClick={onClick}
      level={level}
      // isItemSelected={isItemSelected}
      // hideMenu={hideMenu}
    >
      {itemIcon && (
        <ListItemIcon
          sx={{
            minWidth: '36px',
            p: '3px 0',
            color:
              level > 1 && isItemSelected ? `${theme.palette.secondary.main}!important` : 'inherit',
          }}
        >
          {itemIcon}
        </ListItemIcon>
      )}
      <ListItemText
        primaryTypographyProps={{
          sx: { fontSize: '0.9rem' },
          noWrap: true,
        }}
      >
        {hideMenu ? '' : <>{`${item.title}`}</>}
        <br />
        {item.subtitle ? (
          <Typography sx={{ fontSize: '0.4rem' }} variant="caption">
            {hideMenu ? '' : item.subtitle}
          </Typography>
        ) : (
          ''
        )}
      </ListItemText>

      {!item.chip || hideMenu ? null : (
        <Chip
          color={item.chipColor}
          variant={item.variant ? item.variant : 'filled'}
          size="small"
          label={item.chip}
        />
      )}
    </ListItemStyled>
    // </List>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
  pathDirect: PropTypes.any,
  hideMenu: PropTypes.any,
  onClick: PropTypes.func,
};

export default NavItem;
