const isValidEmail = (email) => {
  const emailPattern = /^\S+@\S+\.\S+$/
  return emailPattern.test(email)
}

export function validateRegistrationData({ name, email, password }) {
  if (!name.trim()) {
    return {
      error: true,
      message: "Informe seu nome",
    }
  }

  if (password.length < 6) {
    return {
      error: true,
      message: "A senha deve conter no mínimo 6 digitos",
    }
  }

  if (!isValidEmail(email)) {
    return {
      error: true,
      message: "Insira um email válido",
    }
  }

  return { error: false }
}
