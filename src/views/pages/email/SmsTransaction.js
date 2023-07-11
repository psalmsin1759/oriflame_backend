// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'

import axios from '../../../api/axios'
import { useAuth } from 'src/hooks/useAuth'

const SmsTransaction = () => {
  const auth = useAuth()
  const user = auth.user

  //const [walletBalance, setWalletBalance] = useState(200)

  const [data, setData] = useState([])

  const URL = '/dashboard/getEmailLogActivity'

  useEffect(() => {
    const loadTransaction = async () => {
      const response = await axios.get(URL, {
        Headers: { 'content-type': "'application/json" }
      })

      setData(response?.data.data)
    }

    // Call the function
    loadTransaction()
  }, [])

  const columns = [
    {
      flex: 0.15,
      minWidth: 150,
      field: 'name',
      headerName: 'Staff'
    },
    {
      flex: 0.15,
      field: 'activity',
      minWidth: 300,
      headerName: 'Activity'
    },

    {
      flex: 0.15,
      minWidth: 100,
      field: 'created_at',
      headerName: 'Date'
    }
  ]

  return (
    <CardContent>
      <Box sx={{ height: 500 }}>
        <DataGrid columns={columns} rows={data} pageSize={12} />
      </Box>
    </CardContent>
  )
}

export default SmsTransaction
