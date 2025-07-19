import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { useState } from 'react'
import Blog from './Blog'
import { expect } from 'vitest'

// 5.13 Testataan, että Blog-komponentti renderöi sisältönsä oikein
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
  expect(urlElement).toBeNull() // Verkko-osoitteen ei pitäisi näkyä, koska extendedView on false

  const likesElement = screen.queryByText('Likes: 0')
  expect(likesElement).toBeNull() // Tykkäysten ei pitäisi näkyä, koska extendedView on false

  const addedByElement = screen.queryByText('Added by: Test User')
  expect(addedByElement).toBeNull() // Blogin lisääjän nimi ei pitäisi näkyä, koska extendedView on false
})

// 5.14 Testataan, että lisätiedot näkyvät, kun View-painiketta klikataan
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
  // Luodaan wrapper, joka hallitsee extendedView-tilaa
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

  expect(screen.getByText('Hide')).toBeDefined() // Painikkeen tekstin tulee muuttua "View" -> "Hide"
  expect(screen.getByText('Url: https://testing-library.com/docs/react-testing-library/intro/')).toBeDefined() // URL näkyy
  expect(screen.getByText('Likes: 0')).toBeDefined() // Tykkäykset näkyvät
  expect(screen.getByText('Added by: Test User')).toBeDefined() // Blogin lisääjän nimi näkyy
})

// 5.15 Testataan, että tapahtumankäsittelijää kutsutaan kahdesti, kun tykkäyspainiketta klikataan kaksi kertaa
test('clicking the like button calls event handler twice', async () => {
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
    extendedView: true
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} onLike={mockHandler} />)

  const user = userEvent.setup()
  const likeButton = screen.getByText('like')
  for (let i = 0; i < 2; i++) {
    await user.click(likeButton)
  }

  expect(mockHandler).toHaveBeenCalledTimes(2)
  expect(mockHandler.mock.calls).toHaveLength(2)
})
