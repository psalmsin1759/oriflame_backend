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
import AccountPlus from 'mdi-material-ui/AccountPlus'
import AccountMultiplePlus from 'mdi-material-ui/AccountMultiplePlus'
import ViewGrid from 'mdi-material-ui/ViewGrid'
import Wallet from 'mdi-material-ui/Wallet'

// ** Demo Tabs Imports
import AddNew from 'src/views/pages/leeds/AddNew'
import Bulk from 'src/views/pages/leeds/Bulk'
import ChurchLeeds from 'src/views/pages/leeds/ChurchLeeds'

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

const NewMemberPage = () => {
  // ** State
  const [value, setValue] = useState('bulk')

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
          {/*  <Tab
            value='single'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountPlus sx={{ fontSize: '1.125rem' }} />
                <TabName>Add New Leed</TabName>
              </Box>
            }
          /> */}
          <Tab
            value='bulk'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountMultiplePlus sx={{ fontSize: '1.125rem' }} />
                <TabName>Upload Bulk Leeds</TabName>
              </Box>
            }
          />
          <Tab
            value='transaction'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ViewGrid sx={{ fontSize: '1.125rem' }} />
                <TabName>All</TabName>
              </Box>
            }
          />
        </TabList>

        {/*  <TabPanel sx={{ p: 0 }} value='single'>
          <AddNew />
        </TabPanel> */}
        <TabPanel sx={{ p: 0 }} value='bulk'>
          <Bulk />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='transaction'>
          <ChurchLeeds />
        </TabPanel>
      </TabContext>
    </Card>
  )
}

export default NewMemberPage
