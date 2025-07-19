import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlog from './newBlog'
import blogService from '../services/blogs'
import { test } from 'vitest'

vi.mock('../services/blogs', () => ({
  default: {
    setToken: vi.fn(),
    create: vi.fn(),
  },
}))
// 5.16 Testataan, että tapahtumankutsufunktion kutsuminen onnistuu blogin luomisen jälkeen
test('calls onSuccess with correct message when blog is submitted', async () => {
  blogService.create.mockResolvedValue({})

  const onSuccess = vi.fn()
  const onError = vi.fn()

  render(<NewBlog onSuccess={onSuccess} onError={onError} />)

  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Title:'), 'React Patterns')
  await user.type(screen.getByLabelText('Author:'), 'Michael Chan')
  await user.type(screen.getByLabelText('URL:'), 'https://reactpatterns.com')
  await user.click(screen.getByText('Send'))

  expect(onSuccess).toHaveBeenCalledWith(
    'A new blog called "React Patterns" by "Michael Chan" added'
  )
  expect(onSuccess).toHaveBeenCalledTimes(1)
  expect(onError).not.toHaveBeenCalled()
})
// 5.16 Testataan, että tapahtumankutsufunktio toimii oikein, kun annetaan virheellinen syöte
test('calls onError with correct message when blog submission fails', async () => {
  const errorMessage = 'Submission failed'
  blogService.create.mockRejectedValue({
    response: { data: { error: errorMessage } },
  })

  const onSuccess = vi.fn()
  const onError = vi.fn()

  render(<NewBlog onSuccess={onSuccess} onError={onError} />)

  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Title:'), 'React Patterns')
  await user.type(screen.getByLabelText('Author:'), 'Michael Chan')
  await user.type(screen.getByLabelText('URL:'), 'https://reactpatterns.com')
  await user.click(screen.getByText('Send'))

  expect(onSuccess).not.toHaveBeenCalled()
  expect(onError).toHaveBeenCalledWith(errorMessage)
  expect(onError).toHaveBeenCalledTimes(1)
})