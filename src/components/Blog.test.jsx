import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Pelle Peloton',
    url: 'https://testing-library.com/docs/react-testing-library/intro/',
    likes: 0,
    user: {
      name: 'Test User',
      username: 'testuser',
      id: '12345'
    },
    extendedView: false
  }

  render(<Blog blog={blog} />)

  const titleElement = screen.getByText('Component testing is done with react-testing-library')
  expect(titleElement).toBeDefined()

  //screen.debug(titleElement)

  const authorElement = screen.getByText('by Pelle Peloton')
  expect(authorElement).toBeDefined()

  const urlElement = screen.queryByText('Url: https://testing-library.com/docs/react-testing-library/intro/')
  expect(urlElement).toBeNull() // URL should not be visible initially, but will be when extendedView is true

  const likesElement = screen.queryByText('Likes: 0')
  expect(likesElement).toBeNull() // Likes should not be visible initially, but will be when extendedView is true
})

test('clicking the button shows url and likes', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Pelle Peloton',
    url: 'https://testing-library.com/docs/react-testing-library/intro/',
    likes: 0,
    user: {
      name: 'Test User',
      username: 'testuser',
      id: '12345'
    },
    extendedView: false
  }
  // We'll use a wrapper component to control extendedView
  function BlogWrapper() {
    const [extendedView, setExtendedView] = useState(false)
    return (
      <Blog
        blog={{ ...blog, extendedView }}
        onToggle={() => setExtendedView(!extendedView)}
      />
    )
  }

  render(<BlogWrapper />)

  const user = userEvent.setup()
  const button = screen.getByText('View')
  await user.click(button)

  // Now url and likes should be visible
  expect(screen.getByText('Url: https://testing-library.com/docs/react-testing-library/intro/')).toBeDefined()
  expect(screen.getByText('Likes: 0')).toBeDefined()
})