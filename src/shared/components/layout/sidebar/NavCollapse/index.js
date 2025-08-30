import PropTypes from 'prop-types';
import React, { useState } from 'react';
// mui imports
import { Collapse, ListItem, ListItemIcon, ListItemText, styled, useTheme } from '@mui/material';

// custom imports
import NavItem from '../NavItem';

// plugins
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { usePathname } from 'next/navigation';

// FC Component For Dropdown Menu
const NavCollapse = ({ menu, level, onClick, hideMenu }) => {
  const Icon = menu.icon;
  const theme = useTheme();
  const pathname = usePathname();
  const pathDirect = pathname;
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf('/'));
  const [open, setOpen] = useState(false);
  const menuIcon =
    level > 1 ? <Icon stroke={1.5} size="1rem" /> : <Icon stroke={1.5} size="1.3rem" />;

  const handleClick = () => {
    setOpen(!open);
  };

  // menu collapse for sub-levels
  React.useEffect(() => {
    setOpen(false);
    menu.children.forEach((item) => {
      if (item.href === pathname) {
        setOpen(true);
      }
    });
  }, [pathname, menu.children]);
  const ListItemStyled = styled(ListItem)(() => ({
    marginBottom: '2px',
    padding: '8px 10px',
    paddingLeft: hideMenu ? '10px' : level > 2 ? `${level * 15}px` : '10px',
    backgroundColor: open && level < 2 ? theme.palette.secondary.main : '',
    whiteSpace: 'nowrap',
    '&:hover': {
      backgroundColor:
        pathname.includes(menu.href) || open
          ? theme.palette.secondary.main
          : theme.palette.secondary.light,
      color: pathname.includes(menu.href) || open ? 'white' : theme.palette.getContrastText,
    },
    color:
      open && level < 2
        ? 'white'
        : `inherit` && level > 1 && open
          ? theme.palette.secondary.main
          : theme.palette.text.secondary,
    borderRadius: `${7}px`,
  }));
  // If Menu has Children
  const submenus = menu.children?.map((item) => {
    if (item.children) {
      return (
        // <NavCollapse
        //   key={item.id}
        //   menu={item}
        //   level={level + 1}
        //   pathWithoutLastPart={pathWithoutLastPart}
        //   pathDirect={pathDirect}
        //   hideMenu={hideMenu}
        // />
        <></>
      );
    } else {
      return (
        <NavItem
          key={item.id}
          item={item}
          level={level + 1}
          hideMenu={hideMenu}
          onClick={onClick}
        />
      );
    }
  });

  return (
    <React.Fragment key={menu.id}>
      <ListItemStyled
        component="li"
        onClick={handleClick}
        selected={pathWithoutLastPart === menu.href}
      >
        <ListItemIcon
          sx={{
            minWidth: '36px',
            p: '3px 0',
            color: 'inherit',
          }}
        >
          {menuIcon}
        </ListItemIcon>
        <ListItemText color="inherit">{hideMenu ? '' : <>{`${menu.title}`}</>}</ListItemText>
        {open ? <ExpandLess size="1rem" /> : <ExpandMore size="1rem" />}
      </ListItemStyled>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {submenus}
      </Collapse>
    </React.Fragment>
  );
};

NavCollapse.propTypes = {
  menu: PropTypes.object,
  level: PropTypes.number,
  pathDirect: PropTypes.any,
  pathWithoutLastPart: PropTypes.any,
  hideMenu: PropTypes.any,
  onClick: PropTypes.func,
};

export default NavCollapse;
