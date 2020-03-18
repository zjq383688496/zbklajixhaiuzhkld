import * as types from '../constants'

var initialState = {}

export default function business(state = initialState, action) {
	switch (action.type) {
		case types.UPDATE_ROUTE:
			debugger
			return ReduxUpdate(Object.assign({}, state))

		default:
			return ReduxUpdate(state)
	}
}

function ReduxUpdate(o) {
	return o
}