import React from 'react'
import { NavLink } from 'react-router-dom'

const names = ['All', 'JavaScript', 'Ruby', 'Python', 'Java']
const languages = names.map(name => ({ name, param: name.toLocaleLowerCase() }))

export default function Navbar () {

	return (
		<ul>
			{languages.map(({ name, param }) => (
				<li key={param}>
					<NavLink activeStyle={{fontWeight: 'bold'}} to={`/${param}`}>
						{name}
					</NavLink>
				</li>
			))}
		</ul>
	)
}