import React from 'react'
import type { Preview } from "@storybook/react"
import { Provider } from 'react-redux'
import { createStore } from '../src/store'

const store = createStore()

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/
        }
    }
}

export const decorators = [
    (Story) => (
        <Provider store={store}>
            <Story />
        </Provider>
    )
]

const preview: Preview = {
    parameters,
    decorators
}

export default preview 