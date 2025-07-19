// 5.4 Ilmoituskomponentti, joka näyttää mahdolliset virheet ja muutokset käyttäjälle
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="notification">
      {message}
    </div>
  )
}

export default Notification