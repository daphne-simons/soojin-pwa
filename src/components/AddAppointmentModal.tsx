import {
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
  type ChangeEvent,
  useState,
} from "react"
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Autocomplete,
  Box,
  Typography,
} from "@mui/material"
// import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers"
import type { AppointmentFormData, IAppointmentInfo, ICategory } from "../models"
import { getAllClientNames } from "../apis/clients"
import { useQuery } from "@tanstack/react-query"
// import { generateId } from "../utils"

interface IProps {
  open: boolean
  handleClose: Dispatch<SetStateAction<void>>
  appointmentFormData: AppointmentFormData
  setAppointmentFormData: Dispatch<
    SetStateAction<AppointmentFormData>
  >
  onAddAppointment: (appointment: IAppointmentInfo) => void
  categories: ICategory[]
}

/////////////////////////////////////////////////////////////////////////////
export default function AddAppointmentModal({
  open,
  handleClose,
  onAddAppointment,
  categories,
}: IProps) {

  const initialFormData: AppointmentFormData = {
    clientId: undefined,
    categoryId: undefined,
    startTime: undefined,
    endTime: undefined,
    notes: undefined,
  };

  const [formData, setFormData] =
    useState<AppointmentFormData>(
      initialFormData
    );

  const { data: clients } = useQuery({
    queryKey: ["clientNamesForDropdown"],
    queryFn: () => getAllClientNames(),
  })
  function onClose() {
    handleClose()
  }
  function handleNotesChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((prevState) => ({
      ...prevState,
      notes: e.target.value
    }))
  }

  function handleCategoryChange(
    _e: React.SyntheticEvent,
    value: ICategory | null
  ) {
    setFormData((prevState) => ({
      ...prevState,
      categoryId: value?._id,
    }))
  }

  function handleSubmit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    const newAppointment: IAppointmentInfo = {
      ...formData,
      clientId: formData.clientId,
      startTime: formData.startTime,
      endTime: formData.endTime,
      notes: formData.notes,
    }

    onAddAppointment(newAppointment)
    setFormData(initialFormData)
    handleClose()
  }

  // Handle Date change
  function handleDateChange(newValue: Date | null) {
    setFormData((prevState) => ({
      ...prevState,
      // Update both start and end dates to maintain the same date
      start: newValue ? new Date(newValue) : undefined,
      end:
        newValue && prevState.end
          ? new Date(
            newValue.getFullYear(),
            newValue.getMonth(),
            newValue.getDate(),
            prevState.end.getHours(),
            prevState.end.getMinutes()
          )
          : undefined,
    }))
  }
  // Handle start time change
  function handleStartTimeChange(newValue: Date | null) {
    if (newValue && formData.start) {
      // Combine the existing date with the new time
      const updatedStart = new Date(formData.start)
      updatedStart.setHours(newValue.getHours())
      updatedStart.setMinutes(newValue.getMinutes())

      setFormData((prevState) => ({
        ...prevState,
        start: updatedStart,
      }))
    }
  }

  // Handle end time change
  function handleEndTimeChange(newValue: Date | null) {
    if (newValue && formData.start) {
      // Combine the existing date with the new time
      const updatedEnd = new Date(formData.start) // Use start date as base
      updatedEnd.setHours(newValue.getHours())
      updatedEnd.setMinutes(newValue.getMinutes())

      setFormData((prevState) => ({
        ...prevState,
        end: updatedEnd,
      }))
    }
  }

  function isDisabled() {
    const checkend = () => {
      if (!formData.allDay && formData.end === null) {
        return true
      }
    }
    if (formData.client === "" || formData.start === null || checkend()) {
      return true
    }
    return false
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle variant="h5">Add appointment</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To add a appointment, please fill in the information below.
        </DialogContentText>
        <Box component="form">
          {/* Client Name: */}
          <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
            Client
          </Typography>
          <Autocomplete
            disablePortal
            options={clients || []}
            sx={{ width: 300, mb: 2, mt: 1 }}
            onChange={(_, newValue) =>
              setFormData((prevState) => ({
                ...prevState,
                client: newValue?.label ?? "", // Default value if newValue is null
              }))
            }
            renderInput={(params) => (
              <TextField {...params} label="Enter client name" />
            )}
          />

          {/* Date: */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }} color="primary">
                Date
              </Typography>
              <DatePicker
                label="Select date"
                value={formData.start}
                onChange={handleDateChange}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                renderInput={(params: any) => (
                  <TextField {...params} halfWidth />
                )}
              />
            </Box>

            <Box sx={{ mb: 1 }}>
              <Typography variant="h6" sx={{ mb: 0 }} color="primary">
                Time
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              {/* Start Time */}
              <Box>
                <TimePicker
                  label="Start Time"
                  value={formData.start}
                  onChange={handleStartTimeChange}
                />
              </Box>
              {/* "to" separator */}
              <Typography variant="h6" sx={{ mt: 3 }}>
                to
              </Typography>
              {/* End Time */}
              <Box>
                <TimePicker
                  label="End Time"
                  value={formData.end}
                  onChange={handleEndTimeChange}
                />
              </Box>
            </Box>
          </LocalizationProvider>

          {/* Category: */}
          <Box sx={{ mb: 2, mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 0 }} color="primary">
              Category
            </Typography>
            <Autocomplete
              onChange={handleCategoryChange}
              disablePortal
              id="combo-box-demo"
              options={categories}
              sx={{ mt: 1 }}
              getOptionLabel={(option) => option.title}
              renderInput={(params) => (
                <TextField {...params} label="Select a category" />
              )}
            />
          </Box>
          {/* Notes:  */}
          <Box sx={{ mb: 2, mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 0 }} color="primary">
              Notes
            </Typography>
            <TextField
              name="notes"
              value={formData.notes}
              margin="dense"
              id="notes"
              label="Optional notes"
              type="text"
              fullWidth
              variant="outlined"
              onChange={handleNotesChange}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={isDisabled()}
          color="success"
          onClick={handleSubmit}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}
