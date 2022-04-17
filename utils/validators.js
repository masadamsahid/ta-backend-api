export const validateRegisterInput = (username, email, password, confirmPassword) => {
  const errors = {}

  // USERNAME VALIDATION
  if (username.length < 4 || username.trim() === ''){
    errors.username = 'Username must contain min 4 characters'
  }else {
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!username.match(usernameRegex)){
      errors.username = 'Username must only contain alphanumeric characters'
    }
  }

  // EMAIL ADRESS VALIDATION
  if(email.length <= 0 || email.trim() === ''){
    errors.email = 'Email must not be empty'
  }else {
    const emailRegEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(emailRegEx)){
      errors.email = 'Email address must be a valid email address'
    }
  }

  // PASSWORD VALIDATION
  if (password === ''){
    errors.password = 'Password must not be empty'
  }else if (password !== confirmPassword){
    errors.confirmPassword = 'Password must match'
  }

  return {
    errors,
    valid: Object.keys(errors) < 1,
  }
}

export const validateLoginInput = () => {
  const errors = {}

  return {
    errors,
    valid: Object.keys(errors) < 1
  }
}