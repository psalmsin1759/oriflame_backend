// ** React Imports
import { useState, useRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import toast from 'react-hot-toast'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'

import { useAuth } from 'src/hooks/useAuth'

import qs from 'qs'

import axios from '../../../api/axios'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import LoadingButton from '@mui/lab/LoadingButton'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

const defaultValues = {
  phone: '',
  message: ''
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
  phone: yup
    .string()
    .min(10, obj => showErrors('Phone', obj.value.length, obj.min))
    .required(),
  message: yup
    .string()
    .min(3, obj => showErrors('Message', obj.value.length, obj.min))
    .max(160, obj => showErrors('Message', obj.value.length, obj.max))
    .required()
})

const SingleCallSend = () => {
  const auth = useAuth()
  const user = auth.user
  const adminID = user?.id

  const [selectedActionValue, setSelectedActionValue] = useState('text')

  const handleActionChange = event => {
    setSelectedActionValue(event.target.value)
  }

  const fileInputRef = useRef(null)

  const [selectedFile, setSelectedFile] = useState(null)

  const [fileError, setFileError] = useState(null)
  const onFileChange = file => {
    const { files } = file.target

    if (files && files.length !== 0) {
      const fileType = files[0].type
      const validImageTypes = ['audio/mpeg']

      if (!validImageTypes.includes(fileType)) {
        setFileError('Please upload a MP3 audio file.')
        file.target.value = null // Reset the input field
        return
      }

      const fileSize = files[0].size
      const maxSize = 4 * 1024 * 1024 // 4 MB in bytes

      if (fileSize > maxSize) {
        setFileError('File size exceeds the limit of 4MB.')
        setButtonLoading(false)
        file.target.value = null // Reset the input field
        return
      } else {
        setFileError(null)
        setSelectedFile(files[0]) //
      }
    }
  }

  const [buttonLoading, setButtonLoading] = useState(false)

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

  const [messageLength, setMessageLength] = useState(0)

  const [open1, setOpen1] = useState(false)

  const [severity, setSeverity] = useState('error')
  const [outputValue, setOutputValue] = useState('')

  const MAX_AUDIO_LENGTH = 60

  const onSubmit = async data => {
    setButtonLoading(true)

    /*const audioURL = window.URL.createObjectURL(selectedFile)
    const audioElement = new Audio(audioURL)

    audioElement.onloadedmetadata = async () => {
      const duration = audioElement.duration
      if (duration > MAX_AUDIO_LENGTH) {
        setError(`Audio length exceeds the maximum limit of ${MAX_AUDIO_LENGTH} seconds`)
        setButtonLoading(false)
      } else {
        
      }
    }*/

    const formData = new FormData()
    formData.append('adminid', adminID)
    formData.append('phone', data.phone)
    formData.append('type', selectedActionValue)

    if (selectedActionValue == 'text') {
      formData.append('message', data.message)
    } else if (selectedActionValue == 'audio') {
      formData.append('file', selectedFile)
    }

    const URL = '/dashboard/sendSingleAdminCall'

    try {
      const response = await axios.post(URL, formData, {
        Headers: { 'content-type': 'multipart/form-data' }
      })

      if (response?.data.status === '200') {
        reset()

        setButtonLoading(false)

        toast.success('Call Sent!')

        setSeverity('success')
        setOutputValue('Call successfully sent')
        setOpen1(true)
      } else {
        setButtonLoading(false)
        setSeverity('error')
        setOpen1(true)
        setOutputValue(response?.data.message)
      }
    } catch (error) {
      if ((error.response && error.response.status === 500) || error.response.status === 404) {
        setButtonLoading(false)
        setSeverity('error')
        setOpen1(true)
        setOutputValue(error.message)
      }
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

          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <InputLabel id='form-layouts-separator-select-label'>Action</InputLabel>
              <Select
                label='Action'
                defaultValue='text'
                name='action'
                onChange={handleActionChange}
                id='form-layouts-separator-select'
                labelId='form-layouts-separator-select-label'
              >
                {/* <MenuItem value='1'>All Mobile Users</MenuItem> */}
                <MenuItem value='text'>Text To Voice Call</MenuItem>
                <MenuItem value='file'>Upload Audio File</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='phone'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='Phone Number'
                    type='number'
                    placeholder='Phone (080XXXXXX'
                    onChange={onChange}
                    fullWidth
                    error={Boolean(errors.phone)}
                  />
                )}
              />
              {errors.phone && <FormHelperText sx={{ color: 'error.main' }}>{errors.phone.message}</FormHelperText>}
            </FormControl>
          </Grid>

          {selectedActionValue === 'text' && (
            <>
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='message'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Text To Voice'
                        rows={3}
                        multiline
                        fullWidth
                        onChange={event => {
                          onChange(event)
                          setMessageLength(event.target.value.length)
                        }}
                        placeholder='Text To Speech'
                        error={Boolean(errors.message)}
                      />
                    )}
                  />
                  {errors.message && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.message.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Typography sx={{ mb: 2 }}>{messageLength}/160</Typography>
              </Grid>
            </>
          )}

          {selectedActionValue === 'file' && (
            <Grid item xs={12} sm={12}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required={true}
                  onChange={onFileChange}
                  accept='.mp3,audio/*'
                  fullWidth
                  type='file'
                  label=''
                  placeholder='Audio File'
                  InputProps={{ inputRef: fileInputRef }}
                />
              </Grid>
              {fileError && <div style={{ color: 'red' }}>{fileError}</div>}
            </Grid>
          )}

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

export default SingleCallSend
