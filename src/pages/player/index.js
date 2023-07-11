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
import ViewGrid from 'mdi-material-ui/ViewGrid'

// ** Demo Tabs Imports
import BulkAdd from 'src/views/pages/player/BulkAdd'
import SingleAdd from 'src/views/pages/player/SingleAdd'

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

const PlayerPage = () => {
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
          <Tab
            value='bulk'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Message sx={{ fontSize: '1.125rem' }} />
                <TabName>Bulk Upload</TabName>
              </Box>
            }
          />

          <Tab
            value='single'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ViewGrid sx={{ fontSize: '1.125rem' }} />
                <TabName>Single</TabName>
              </Box>
            }
          />
        </TabList>

        <TabPanel sx={{ p: 0 }} value='bulk'>
          <BulkAdd />
        </TabPanel>

        <TabPanel sx={{ p: 0 }} value='single'>
          <SingleAdd />
        </TabPanel>
      </TabContext>
    </Card>
  )
}

export default PlayerPage
