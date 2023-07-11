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
import Message from 'mdi-material-ui/Message'
import MessageBadge from 'mdi-material-ui/MessageBadge'
import ViewGrid from 'mdi-material-ui/ViewGrid'
import Wallet from 'mdi-material-ui/Wallet'

// ** Demo Tabs Imports
import SingleSMSSend from 'src/views/pages/sms/SingleSMSSend'
import SmsTransaction from 'src/views/pages/sms/SmsTransaction'

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

const SMSPage = () => {
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
                <Message sx={{ fontSize: '1.125rem' }} />
                <TabName>Single SMS</TabName>
              </Box>
            }
          />

          <Tab
            value='transaction'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ViewGrid sx={{ fontSize: '1.125rem' }} />
                <TabName>Transaction</TabName>
              </Box>
            }
          />
        </TabList>

        <TabPanel sx={{ p: 0 }} value='single'>
          <SingleSMSSend />
        </TabPanel>

        <TabPanel sx={{ p: 0 }} value='transaction'>
          <SmsTransaction />
        </TabPanel>
      </TabContext>
    </Card>
  )
}

export default SMSPage
