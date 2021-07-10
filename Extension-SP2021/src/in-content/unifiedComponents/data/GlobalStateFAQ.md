# Results
## Where should global state atoms and selectors be stored?
Under `unifiedComponents` there is a `data` folder where all atoms and selectors should be defined.

## How much granularity will be used for atoms and selectors (1 per file, multiple files, etc.)?
For now, all atoms and selectors will be within a single file, `unifiedComponents/data/globalState.js`.  At a later time, we can split this file if it becomes too large without much difficulty.

##  How do we approach non-deterministic state that must be retrieved asynchronously?
The answer to this requires a more thorough discussion, see more details below.

## When should a 'Suspense' component be used (if at all) and what should it look like?
Any selector that may potentially resolve to a Promise can automatically utilize a Suspense element to display an alternative UI until the data is available.  Also, if we engage the Atom Effects API (which is recommended for our database queries) we can use `setSelf()` with a Promise to get similar behavior for just an atom.

Consequently, all components that depend on asynchronous data (from either the database or from local storage) MUST be surrounded by a suspense element to handle this behavior.  The following MUI elements are recommended for use as 'fallback' elements in the suspense:
- [Skeleton Components](https://material-ui.com/components/skeleton/)
- Indeterminate [Progress Components](https://material-ui.com/components/progress/) (especially the circular option)

## When should an 'ErrorBoundary' be used and how will they be made consistent?
The recommendation for asynchronous data retrieval is to use Atom Effects.  Effects (just like react useEffect hooks) do not run during the render function and therefore will not throw an error that can be caught by an ErrorBoundary.  Because of this, all errors must be properly handled within the effect code itself.

If we do utilize any selectors that return Promises, we should consider using an ErrorBoundary as these selectors are evaluated during render and if the Promise failed, they will throw an error that can (and should) [be caught and handled](https://recoiljs.org/docs/guides/asynchronous-data-queries#error-handling) by an [ErrorBoundary](https://reactjs.org/docs/error-boundaries.html).  Presently, I do not expect this to be a common use case in Karuna so I will defer any decisions about making ErrorBoundaries required or keeping them consistent until we come upon a need for them.

# Retrieving Remote Data Asynchronously

- **tl;dr** Use [Atom Effects](https://recoiljs.org/docs/guides/atom-effects) API for asynchronous data retrieved from the DB.

Any selectors can [utilize asynchronous code](https://recoiljs.org/docs/guides/asynchronous-data-queries) and any selector that resolves to a Promise (by directly returning one or by having an async getter) will [integrate nicely with a 'React.Suspense' element.](https://recoiljs.org/docs/guides/asynchronous-data-queries#asynchronous-example)

However, because their results are cached, [selectors **must** be deterministic](https://github.com/facebookexperimental/Recoil/issues/422#issuecomment-652863477): the value they return must be completely determined by the atoms they are derived from.  If the atoms have the same values they did before, the selector MUST return the same result.  Our database data is not deterministic like this.  For example, if we want to look up a user's latest status, the query only utilizes the user's ID but the data is also dependent on time.  The same user ID will not always return the same value.

This can be solved in one of two ways:

## Incrementing Atom
First, an artificial atom could be created that is an integer that increments whenever the data in the DB changes (or whenever you want to force a 'refresh' of that data).  The selector that retrieves the data from the DB must be made dependent on that atom as well. This will cause Recoil to see a change in the dependent atoms and trigger an update in the dataflow. An example can be found [here](https://codesandbox.io/s/recoil-refetch-data-bqjp6?file=/src/App.tsx).

The Recoil developers point out that this [represents a memory leak](https://github.com/facebookexperimental/Recoil/issues/422#issuecomment-684085370).  They say that a good solution is still in development and recommend exploring the unstable API, [Atom Effects](https://recoiljs.org/docs/guides/atom-effects) which is more suited to this programming pattern.

## Atom Effects
We could acknowledge that this data is inherently non-deterministic and depends on the side effects of looking up the value.  The React function `useEffect` exists for these situations allowing you to run the code that retrieves the value regardless of whether or not the value has changed.  Recoil has an unstable feature that is similar to this called Atom Effects, where an atom can have certain side-effect functions registered to run for initialization, setting, and getting values.

In this approach, we can still utilize the automatic integration with React.Suspense by passing a Promise to `setSelf()` inside the effect code and therefore still have deterministic behavior when the asynchronous request is still pending.

# What should we do?
I believe we should opt for this SECOND option (Atom Effects).  While they are still an 'unstable' option in Recoil, this only means that the API for using them will likely change with future versions of Recoil.  The cost of this choice is that we may need to update our code to be able to use the latest version of Recoil and this seems a reasonable risk.
