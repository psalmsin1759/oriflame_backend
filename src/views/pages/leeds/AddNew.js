// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Collapse from '@mui/material/Collapse'
import toast from 'react-hot-toast'

import qs from 'qs'

import axios from '../../../api/axios'
import { useAuth } from 'src/hooks/useAuth'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import LoadingButton from '@mui/lab/LoadingButton'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

const defaultValues = {
  name: '',
  phone: '',
  email: ''
}

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const schema = yup.object().shape({
  name: yup
    .string()
    .min(3, obj => showErrors(' Name', obj.value.length, obj.min))
    .required(),

  phone: yup
    .string()
    .min(6, obj => showErrors('Phone', obj.value.length, obj.min))
    .required()
})

const AddNew = () => {
  const auth = useAuth()
  const user = auth.user
  const adminID = user?.id
  const churchID = user.church_id

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const [buttonLoading, setButtonLoading] = useState(false)

  const [open1, setOpen1] = useState(false)

  const [severity, setSeverity] = useState('error')
  const [outputValue, setOutputValue] = useState('')

  const onSubmit = async data => {
    setButtonLoading(true)

    const input = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      churchid: churchID,
      adminid: adminID
    }

    const URL = '/dashboard/addnewleeds'

    const response = await axios.post(URL, qs.stringify(input), {
      Headers: { 'content-type': 'application/x-www-form-urlencoded' }
    })

    if (response?.data.status === 'success') {
      reset()

      setButtonLoading(false)

      setSeverity('success')
      setOutputValue('Successful')
      setOpen1(true)

      toast.success('Successful!')
    } else {
      var message = response?.data.message
      setButtonLoading(false)
      setSeverity('error')
      setOpen1(true)
      setOutputValue(message)
    }
  }
  return (
    <CardContent>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Box sx={{ mb: 6 }}>
              <Collapse in={open1}>
                <Alert
                  severity={severity}
                  action={
                    <IconButton size='small' color='inherit' aria-label='close' onClick={() => setOpen1(false)}>
                      <Close fontSize='inherit' />
                    </IconButton>
                  }
                >
                  {outputValue}
                </Alert>
              </Collapse>
              {/* <Button disabled={open1} variant='outlined' sx={{ mt: 2 }} onClick={() => setOpen1(true)}>
                    Open Collapse
                  </Button> */}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label=' Name *'
                    placeholder=' Name'
                    onChange={onChange}
                    fullWidth
                    error={Boolean(errors.name)}
                  />
                )}
              />
              {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='phone'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='Phone Number *'
                    placeholder='Phone Number'
                    type='number'
                    onChange={onChange}
                    fullWidth
                    error={Boolean(errors.phone)}
                  />
                )}
              />
              {errors.phone && <FormHelperText sx={{ color: 'error.main' }}>{errors.phone.message}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='email'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='Email'
                    placeholder='Email'
                    type='email'
                    onChange={onChange}
                    fullWidth
                    error={Boolean(errors.email)}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <LoadingButton
              loading={buttonLoading}
              loadingPosition='start'
              onClick={handleSubmit}
              size='large'
              type='submit'
              sx={{ mr: 2 }}
              variant='contained'
            >
              Submit
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default AddNew
