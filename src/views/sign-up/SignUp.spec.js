vi.mock('axios')
import { render, screen } from '@testing-library/vue'
import SignUp from './SignUp.vue'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import { expect } from 'vitest'
import { setupServer } from 'msw/node'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('Sign Up', () => {
  it('has Sign Up header', () => {
    render(SignUp)
    const header = screen.getByRole('heading', { name: 'Sign Up' })
    expect(header).toBeInTheDocument()
  })

  it('has username input', () => {
    render(SignUp)
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
  })

  it('has email input', () => {
    render(SignUp)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('has password input', () => {
    render(SignUp)
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('has password type for password input', () => {
    render(SignUp)
    expect(screen.getByLabelText('Password'))
      .toHaveAttribute('type', 'password')
      .toBeInTheDocument()
  })

  it('has password repeat input', () => {
    render(SignUp)
    expect(screen.getByLabelText('Password Repeat')).toBeInTheDocument()
  })

  it('has password type for password repeat input', () => {
    render(SignUp)
    expect(screen.getByLabelText('Password Repeat'))
      .toHaveAttribute('type', 'password')
      .toBeInTheDocument()
  })

  it('has a Sign Up button', () => {
    render(SignUp)
    const button = screen.getByRole('button', { name: 'Sign Up' })
    expect(button).toBeInTheDocument()
  })

  it('disables the button initially', () => {
    render(SignUp)
    const button = screen.getByRole('button', { name: 'Sign Up' })
    expect(button).toBeDisabled()
  })

  describe('when user sets same value for password inputs', () => {
    it('enables button', async () => {
      const user = userEvent.setup()
      render(SignUp)
      const passwordInput = screen.getByLabelText('Password')
      const passwordRepeatInput = screen.getByLabelText('Password Repeat')
      await user.type(passwordInput, 'P4ssword')
      await user.type(passwordRepeatInput, 'P4ssword')
      expect(screen.getByRole('button', { name: 'Sign Up' })).toBeEnabled()
    })

    describe('when user submits form', () => {
      it('sends username, email and password to the backend', async () => {
        let requestBody
        const server = setupServer(
          rest.post('/api/v1/users', async ({ request, response, ctx }) => {
            requestBody = await request.json()
            return response(ctx.json({}))
          })
        )
        server.listen()
        const user = userEvent.setup()
        render(SignUp)
        const passwordInput = screen.getByLabelText('Password')
        const passwordRepeatInput = screen.getByLabelText('Password Repeat')
        const usernameInput = screen.getByLabelText('Username')
        const emailInput = screen.getByLabelText('Email')
        await user.type(usernameInput, 'Bobbo')
        await user.type(emailInput, 'bobbo@bobbo.com')
        await user.type(passwordInput, 'P4ssword')
        await user.type(passwordRepeatInput, 'P4ssword')
        const button = screen.getByRole('button', { name: 'Sign Up' })
        await user.click(button)
        await waitFor(() => {
          expect(requestBody).toEqual({
            username: 'Bobbo',
            email: 'bobbo@bobbo.com',
            password: 'P4ssword'
          })
        })
        // expect(axios.post).toHaveBeenCalledWith('/api/v1/users', {
        //   username: 'Bobbo',
        //   email: 'bobbo@bobbo.com',
        //   password: 'P4ssword'
        // })
        // expect(mockFetch).toHaveBeenCalledWith('/api/v1/users', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({
        //     username: 'Bobbo',
        //     email: 'bobbo@bobbo.com',
        //     password: 'P4ssword'
        //   })
        // })
      })
    })
  })
})
