export const validateRegisterInput = ({username, fullName, email, password, confirmPassword, about}) => {
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

  // FULL NAME VALIDATION
  if (fullName.length > 64){
    errors.fullName = 'Full name can only contain up to 64 characters'
  }

  // EMAIL ADDRESS VALIDATION
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

export const validateLoginInput = (usernameEmail, password) => {
  const errors = {}

  // TODO: USERNAME-EMAIL VALIDATION
  if (usernameEmail.length < 1 || usernameEmail.trim() === ''){
    errors.username = 'Username must not be empty'
  }

  // TODO: VALIDATE PASSWORD
  if (usernameEmail.password){
    errors.password = 'Password must not be empty'
  }

  return {
    errors,
    valid: Object.keys(errors) < 1
  }
}

export const validateCreateCourseInput = (title, courseCode, tutor, price, description) =>  {
  const errors = {}

  if (title.length < 8 || title.length > 128){
    errors.title = 'Title can only contain 8-128 string characters'
  }

  if (courseCode !== courseCode.toUpperCase() || !courseCode.match(/^[a-zA-Z0-9]+$/)){
    errors.courseCode = 'Course code must be uppercase alphanumeric'
  }else if (courseCode.length > 10){
    errors.courseCode = 'Course code can only contain max. 10 characters'
  }

  if (tutor.length < 4 || tutor.length > 16 || !tutor.match(/^[a-zA-Z0-9]+$/)){
    errors.tutor = "Enter a valid tutor's username between 4-16 alphanumeric characters"
  }

  if (price < 10000){
    errors.price = 'Price must greater than or equal to 10000 rupiahs'
  }

  if (description.length > 512){
    errors.description = 'Description must be lower than 512 characters'
  }

  return{
    errors,
    valid: Object.keys(errors) < 1
  }
}

export const validateImageInput = (thumbnailImg) => {
  const errors = {}

  const ext = thumbnailImg.substring("data:image/".length, thumbnailImg.indexOf(";base64"));

  if(ext !== 'jpg' && ext !== 'jpeg' && ext !== 'png'){
    errors.thumbnailImg = 'File must be *.jpg, *.jpeg, or *.png,'
  }else if(new Buffer(thumbnailImg, 'base64').byteLength > 	512000){
    errors.thumbnailImg = 'File\'s size must be less than 500 kilobytes'
  }

  return{
    errors,
    valid: Object.keys(errors) < 1
  }
}