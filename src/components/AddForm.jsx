import React from "react";
import PropTypes from "prop-types";
import { Users, Phone, Ticket, CreditCard, Calendar } from "lucide-react";
import Button from "./UI/Button";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import dayjs from 'dayjs';

const AddForm = ({ formData, handleFormData, handleFormSubmit }) => {
  // Custom dark theme for MUI DatePicker
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            width: '100%',
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(30, 41, 59, 0.5)',
              '& fieldset': {
                borderColor: 'rgba(51, 65, 85, 0.5)',
              },
              '&:hover fieldset': {
                borderColor: '#ffffff',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#ffffff',
              },
            },
          },
        },
      },
    },
  });

  const handleDateChange = (date) => {
    handleFormData({
      target: {
        name: 'dob',
        value: date ? date.format('YYYY-MM-DD') : ''
      }
    });
  };

  // Update input classes
  const inputClasses =
    "w-full pl-10 pr-4 py-2 rounded-lg border bg-slate-800/50 border-slate-700/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-200 placeholder-slate-500 transition-colors";
  const iconClasses = "absolute left-3 top-2.5 h-5 w-5 text-slate-500";

  return (
    <form
      onSubmit={handleFormSubmit}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
    >
      <div className="relative">
        <input
          className={inputClasses}
          type="text"
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={handleFormData}
          required
        />
        <Users className={iconClasses} />
      </div>
      <div className="relative">
        <input
          className={inputClasses}
          type="text"
          placeholder="Coupon No."
          name="coupon"
          value={formData.coupon}
          onChange={handleFormData}
          required
        />
        <Ticket className={iconClasses} />
      </div>
      <div className="relative">
        <ThemeProvider theme={darkTheme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={formData.dob ? dayjs(formData.dob) : null}
              onChange={handleDateChange}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  required: true,
                  placeholder: "Date of Birth",
                  sx: {
                    '& .MuiInputBase-input': {
                      paddingLeft: '2.5rem',
                      paddingTop: '0.6rem', 
                      paddingBottom: '0.6rem',
                      color: '#e2e8f0',
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </ThemeProvider>
        <Calendar className={iconClasses} style={{ zIndex: 1 }} />
      </div>
      <div className="relative">
        <input
          className={inputClasses}
          type="text"
          placeholder="Mobile No."
          name="mobile"
          value={formData.mobile}
          onChange={handleFormData}
          pattern="\d*"
          maxLength="10"
          title="Please enter a valid 10-digit mobile number"
          required
        />
        <Phone className={iconClasses} />
      </div>
      <div className="relative">
        <input
          className={inputClasses}
          type="text"
          placeholder="Aadhaar No."
          name="aadhaar"
          value={formData.aadhaar}
          onChange={handleFormData}
          pattern="\d*"
          maxLength="12"
          title="Please enter a valid 12-digit Aadhaar number"
          required
        />
        <CreditCard className={iconClasses} />
      </div>

      <Button
        type="submit"
        variant="success"
        className="col-span-full justify-center"
      >
        Add Entry
      </Button>
    </form>
  );
};

AddForm.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    mobile: PropTypes.string.isRequired,
    coupon: PropTypes.string.isRequired,
    aadhaar: PropTypes.string.isRequired,
    dob: PropTypes.string.isRequired,
  }).isRequired,
  handleFormData: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
};

export default AddForm;
