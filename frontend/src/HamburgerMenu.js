import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import {Link} from 'react-router-dom'
import './hamburgerMenu.css'


export default function HamburgerMenu(props) {
    const [state, setState] = React.useState({
      left: false,
    });
    const role=props.role;
    const user=props.user;
  
    const toggleDrawer = (anchor, open) => (event) => {
      if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
      }
  
      setState({[anchor]: open });
    };
  
    const list = (anchor) => (
      <Box
        sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
        >
        <List>
            <h2>hello, {`${user}`}</h2>
            <hr></hr>
        {(role==="Lab Incharge"||role==="Admin")?<><Link to='/labapproval'> <h3>pending requests (Lab)</h3></Link><hr></hr></>:null}
        {(role=="HOD"|| role=="Admin")?<><Link to="/hodapproval"><h3> pending requests(HOD)</h3></Link><hr></hr></>:null}
        <Link to='/summary'><h3>summary</h3></Link> 
       <hr></hr>
        </List>
      </Box>
    );
  
    return (
      <div>
        {['left'].map((anchor) => (
          <React.Fragment key={anchor}>
            <div onClick={toggleDrawer(anchor, true)}> <input id="checkbox" type="checkbox" />
    <label class="toggle" for="checkbox">
        <div id="bar1" class="bars"></div>
        <div id="bar2" class="bars"></div>
        <div id="bar3" class="bars"></div>
    </label>

</div>
            <Drawer
              anchor={anchor}
              open={state[anchor]}
              onClose={toggleDrawer(anchor, false)}
            >
              {list(anchor)}
            </Drawer>
          </React.Fragment>
        ))}
      </div>
    );
  }