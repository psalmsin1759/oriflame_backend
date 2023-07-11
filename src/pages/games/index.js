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
import AddGames from 'src/views/pages/games/AddGames'
import ViewGames from 'src/views/pages/games/ViewGames'

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

const GamesPage = () => {
  // ** State
  const [value, setValue] = useState('add')

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
            value='add'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Message sx={{ fontSize: '1.125rem' }} />
                <TabName>Add Games</TabName>
              </Box>
            }
          />

          <Tab
            value='all'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ViewGrid sx={{ fontSize: '1.125rem' }} />
                <TabName>View All</TabName>
              </Box>
            }
          />
        </TabList>

        <TabPanel sx={{ p: 0 }} value='add'>
          <AddGames />
        </TabPanel>

        <TabPanel sx={{ p: 0 }} value='all'>
          <ViewGames />
        </TabPanel>
      </TabContext>
    </Card>
  )
}

export default GamesPage
