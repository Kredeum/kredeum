# Store Pattern

_Pattern from https://franklintarter.com/svelte-store_

## State Management Simplified

This state management system will be bulit with four concepts.

- State – observable data that our components and application will reference.
- State Changers – functions that change state. AKA mutations.
- Actions – functions that call services (like APIs) and State Changers.
- State Views – functions that compute or format state differently. These are not required but are useful for keeping
  logic out of components. AKA getters (Vuex), selectors (Redux).

### State cnagers

The only responsibility of these functions is to set new values on the state. They are not exported because they will
not be called directly by components, they will only be called by actions as we’ll see.

## Summary

Our state management has four pieces – Observable State, State Changers, Actions and State Views. We used Svelte’s
writable to create the Observable State and the State Changers. We used Svelte’s derived to create State Views. And we
created Actions which called the State Changers and a Mock API.
