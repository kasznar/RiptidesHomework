import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ApolloClient, InMemoryCache, ApolloProvider, HttpLink} from '@apollo/client';


const client = new ApolloClient({
    link: new HttpLink({
        uri: 'https://api.github.com/graphql',
        headers: {
            Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
        },
    }),    cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ApolloProvider client={client}>
          <App />
      </ApolloProvider>,
  </StrictMode>,
)
