// ** MUI Imports
// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import AnalyticsCongratulations from 'src/views/dashboard/AnalyticsCongratulations'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import { useState, useEffect } from 'react'
import axios from '../../api/axios'
import Account from 'mdi-material-ui/Account'
import Gamepad from 'mdi-material-ui/Gamepad'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Icon Imports

const Home = () => {
  const auth = useAuth()
  const user = auth.user
  const role = user?.role

  const [players, setPlayers] = useState('0')
  const [games, setGames] = useState('0')

  const URL = '/overview'

  useEffect(() => {
    // Call the function
    reloadData()
  }, [])

  const reloadData = async () => {
    const response = await axios.get(URL, {
      Headers: { 'content-type': "'application/json" }
    })

    setPlayers(response?.data.players)
    setGames(response?.data.games)
  }

  return (
    <ApexChartWrapper>
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12} md={8}>
          <AnalyticsCongratulations />
        </Grid>
        <Grid item xs={12} md={2}>
          <CardStatisticsVertical stats={games} color='primary' icon={<Gamepad />} title='Total Games' chipText='' />
        </Grid>
        <Grid item xs={12} md={2}>
          <CardStatisticsVertical
            stats={players}
            color='primary'
            icon={<Account />}
            title='Total Players'
            chipText=''
          />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Home
