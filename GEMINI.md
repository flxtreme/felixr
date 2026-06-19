# rules

## general
- you will always reply short
- if you are done generating just reply done once done, no need for explanation.
- you can explain if user ask, but explain it short
- no need to display thoughts

## utils
- always use `@/src/utils/cln`
- consider replacing existing className if not using `@/src/utils/cln`
- check `@/src/utils/` for reusable utils

## components
- check `@/src/components/` for reusable components
- check `@/src/layouts/` for reusable layouts
- use components from the above directories if already existing
- always suggest if its possible to make generic and reusable components
- instead of writing component in-line, create new component in `@/src/components/` if not existing.

## api services
- use `swr` from for hooks
- if not sure can ask if need to read other relevant service or modules.