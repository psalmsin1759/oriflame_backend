// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'

import axios from '../../../api/axios'
import { useAuth } from 'src/hooks/useAuth'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

const FundWallet = () => {
  const auth = useAuth()
  const user = auth.user
  const churchID = user.church_id

  const [walletBalance, setWalletBalance] = useState(0)

  const URL = '/dashboard/getWalletBalance/' + churchID
  useEffect(() => {
    const loadData = async () => {
      const response = await axios.get(URL, {
        Headers: { 'content-type': "'application/json" }
      })

      var balance = response?.data.balance

      setWalletBalance(balance)
    }

    // Call the function
    loadData()
  }, [])

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <CardContent>
      <form onSubmit={e => e.preventDefault()} noValidate>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={12}>
            <Typography sx={{ mb: 2 }}>Your wallet balance is: ₦{walletBalance}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Button onClick={handleOpen}>Fund Wallet</Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby='modal-modal-title'
              aria-describedby='modal-modal-description'
            >
              <Box sx={style}>
                <Typography id='modal-modal-title' variant='h6' component='h2'>
                  Fund Wallet
                </Typography>
                <Typography id='modal-modal-description' sx={{ mt: 2 }}>
                  Send us an email info@qnetixtechnologies.com to fund your wallet
                </Typography>
              </Box>
            </Modal>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default FundWallet
