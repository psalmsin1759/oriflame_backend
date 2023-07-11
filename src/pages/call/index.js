// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'

// ** Icons Imports
import PhoneInTalk from 'mdi-material-ui/PhoneInTalk'
import PhoneDial from 'mdi-material-ui/PhoneDial'
import ViewGrid from 'mdi-material-ui/ViewGrid'
import Wallet from 'mdi-material-ui/Wallet'

// ** Demo Tabs Imports
import SingleCallSend from 'src/views/pages/call/SingleCallSend'
import CallTransaction from 'src/views/pages/call/CallTransaction'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

const Tab = styled(MuiTab)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 100
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 67
  }
}))

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  marginLeft: theme.spacing(2.5),
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))

const CallPage = () => {
  // ** State
  const [value, setValue] = useState('single')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Card>
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          aria-label='account-settings tabs'
          sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
        >
          <Tab
            value='single'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneInTalk sx={{ fontSize: '1.125rem' }} />
                <TabName>Single Call</TabName>
              </Box>
            }
          />

          <Tab
            value='transaction'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ViewGrid sx={{ fontSize: '1.125rem' }} />
                <TabName>History</TabName>
              </Box>
            }
          />
        </TabList>

        <TabPanel sx={{ p: 0 }} value='single'>
          <SingleCallSend />
        </TabPanel>

        <TabPanel sx={{ p: 0 }} value='transaction'>
          <CallTransaction />
        </TabPanel>
      </TabContext>
    </Card>
  )
}

export default CallPage
